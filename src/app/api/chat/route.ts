import "server-only";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { OpenAI } from "openai";
import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { takeUpToChars } from "@/src/lib/utils/takeChars";
import { requireProductAccess } from "@/src/lib/auth/require-product-access";
import { requireUserId } from "@/src/lib/auth/require-user";
import { handleApiError } from "@/src/lib/api/handle-api-error";

function lastTextFromUiMessage(msg: UIMessage | undefined) {
  if (!msg) return "";
  for (let i = msg.parts.length - 1; i >= 0; i--) {
    const part = msg.parts[i];
    if (part.type === "text") return part.text;
  }
  return "";
}

export async function POST(req: Request) {
  try {
    const openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const payload = await req.json();

    // v6 DefaultChatTransport shape
    const productId: string | undefined = payload?.productId;
    const uiMessages: UIMessage[] | undefined = payload?.messages;

    if (!productId) throw new Error("BAD_REQUEST");
    if (!uiMessages?.length)
      throw new Error("BAD_REQUEST");

    const userId = await requireUserId();

    const product = await requireProductAccess(productId, userId);

    const userText = lastTextFromUiMessage(uiMessages[uiMessages.length - 1]);
    if (!userText)
      throw new Error("BAD_REQUEST");

    // Save user message
    await prisma.message.create({
      data: { productId, role: "user", content: userText },
    });

    // Embed the user question
    const embeddingRes = await openAI.embeddings.create({
      model: "text-embedding-3-small",
      input: userText,
    });

    const queryEmbedding = embeddingRes.data[0].embedding;

    const queryEmbeddingLiteral = `[${queryEmbedding.join(",")}]`;

    const relevantChunks = await prisma.$queryRaw<
      { content: string; docId: string; title: string; distance: number }[]
    >(Prisma.sql`
  SELECT c."content", c."docId", d."title",
         (c."embedding" <-> ${queryEmbeddingLiteral}::vector) as distance
  FROM "ProductDocChunk" c
  JOIN "ProductDoc" d ON d."id" = c."docId"
  WHERE c."productId" = ${productId}
  ORDER BY c."embedding" <-> ${queryEmbeddingLiteral}::vector
  LIMIT 8
`);

    const THRESHOLD = 1.05;
    const filtered = relevantChunks
      .filter((c) => c.distance <= THRESHOLD)
      .slice(0, 5);

    const fallback = relevantChunks.slice(0, 3); // small fallback set

    const chunksForContext = filtered.length > 0 ? filtered : fallback;

    const MAX_DOC_CHARS = filtered.length > 0 ? 6000 : 2500; // tighter when fallback
    const contextPieces = takeUpToChars(chunksForContext, MAX_DOC_CHARS);

    const docContext = contextPieces
      .map((c, i) => `Source ${i + 1} (${chunksForContext[i].title}):\n${c}`)
      .join("\n\n");

    const sources = chunksForContext.map((c, idx) => ({
      index: idx + 1,
      title: c.title,
      docId: c.docId,
      distance: c.distance,
    }));

    const systemPrompt = `
You are an AI Product Copilot.

You may reference ${docContext} for details on the project.
You may use the provided product documentation sources below.
If the provided documentation excerpts do not contain the answer, say: 
"I don't see that in the provided docs" and then give best-effort guidance.
Do NOT claim that no documentation exists for the product—only comment on the excerpts provided.



Product Name: "${product.name}"
Product Description: "${product.description ?? "No description yet"}"

When you use information from the documentation, be explicit and reference it. Display the
following label and logic when your answer comes from the documentation. Don't display it if
it's a simple question that you answered.
Documentation Sources:
${`Sources: ${sources}` || "(No relevant documentation provided.)"}
`.trim();

    // Convert UIMessage[] -> ModelMessage[] (text-only)
    const modelMessages = await convertToModelMessages(uiMessages);

    modelMessages.unshift({ role: "system", content: systemPrompt });

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [{ role: "system", content: systemPrompt }, ...modelMessages],
      onFinish: async ({ text }) => {
        await prisma.message.create({
          data: {
            productId,
            role: "assistant",
            content: text,
          },
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    return handleApiError(err);
  }
}
