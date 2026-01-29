import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateProductDescription(args: {
  name: string;
  seedDescription?: string | null;
}) {
  const { name, seedDescription } = args;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a product marketing expert. Write concise, compelling product descriptions for SaaS products.",
      },
      {
        role: "user",
        content: seedDescription?.trim()
          ? `Product name: "${name}". Here is a rough draft description: "${seedDescription}". Rewrite it into a polished product description (2-4 sentences).`
          : `Product name: "${name}". Write a polished product description (2-4 sentences).`,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content?.trim() ?? "";
}
