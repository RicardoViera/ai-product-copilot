import { prisma } from "@/src/lib/db/prisma";
import { supabaseAdmin } from "@/src/lib/supabase/admin";
import { chunkText } from "@/src/lib/utils/chunk";
import { embedText } from "@/src/lib/ai/embed";
import { Prisma } from "@prisma/client";
import { requireUserId } from "@/src/lib/auth/require-user";
import { requireProductAccess } from "@/src/lib/auth/require-product-access";
import { handleApiError } from "@/src/lib/api/handle-api-error";

export const runtime = "nodejs"; // ensure Node runtime (File APIs + buffering)

function safeTitleFromFileName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "");
}

async function processChunksAsync(
  productId: string,
  docId: string,
  chunks: string[],
) {
  for (const chunk of chunks) {
    const embedding = await embedText(chunk);
    const embeddingLiteral = `[${embedding.join(",")}]`;

    await prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO "ProductDocChunk"
        ("id", "productId", "docId", "content", "embedding", "createdAt")
        VALUES
        (gen_random_uuid(), ${productId}, ${docId}, ${chunk}, ${embeddingLiteral}::vector, now())
      `,
    );
  }

  // mark doc as indexed
  await prisma.productDoc.update({
    where: { id: docId },
    data: { isIndexed: true },
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const productId = (formData.get("productId") as string) ?? "";
    const file = formData.get("file");

    if (!productId) throw new Error("BAD_REQUEST");
    if (!(file instanceof File))
      throw new Error("BAD_REQUEST");

    const userId = await requireUserId();
    await await requireProductAccess(productId, userId);

    // Only allow lightweight text files for now
    const allowed = ["text/plain", "text/markdown"];
    if (!allowed.includes(file.type)) {
      return new Response("Only .txt and .md are supported for now.", {
        status: 415,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = `${productId}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-docs")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return new Response(`Upload failed: ${uploadError.message}`, {
        status: 500,
      });
    }

    const contentText = buffer.toString("utf8");

    const doc = await prisma.productDoc.create({
      data: {
        productId,
        title: safeTitleFromFileName(file.name),
        content: contentText,
        filePath,
        fileName: file.name,
        mimeType: file.type,
        isIndexed: false,
      },
    });

    const chunks = chunkText(contentText);

    void processChunksAsync(productId, doc.id, chunks);

    return Response.json({ id: doc.id });
  } catch (err) {
    return handleApiError(err);
  }
}
