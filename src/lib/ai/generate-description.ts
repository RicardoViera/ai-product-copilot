import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateProductDescription(name: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a product marketing expert. Write compelling, clear product descriptions.",
      },
      {
        role: "user",
        content: `Write a short product description for a product called "${name}".`,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content ?? "";
}
