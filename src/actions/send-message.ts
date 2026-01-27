"use server";

import { prisma } from "@/src/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function sendMessage(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const productId = formData.get("productId") as string;
  const message = formData.get("message") as string;

  if (!productId || !message) throw new Error("Missing data");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { owner: true, messages: true },
  });

  if (!product || product.owner.clerkId !== userId) {
    throw new Error("Not allowed");
  }

  // Save user message
  await prisma.message.create({
    data: {
      content: message,
      role: "user",
      productId,
    },
  });

  // Prepare context: last 5 messages
  const recentMessages: { role: "user" | "assistant"; content: string }[] = product.messages
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .slice(-5)
    .map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

  const messages = [
    {
      role: "system" as const,
      content:
      `You are an AI Product Copilot.

      You help the user build, describe, and improve a software product.
      
      You are currently assisting with this product:
      
      Product Name: "${product.name}"
      Product Description: "${product.description ?? "No description yet"}"
      
      Be proactive, specific, and product-focused. 
      Give actionable suggestions, improvements, ideas, and feedback.
      `,
    },
    ...recentMessages,
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  const aiResponse = completion.choices[0].message?.content ?? "";

  // Save AI response
  await prisma.message.create({
    data: {
      content: aiResponse,
      role: "assistant",
      productId,
    },
  });

  revalidatePath(`/dashboard/${productId}/chat`);
}
