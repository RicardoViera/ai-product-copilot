"use server";

import { prisma } from "@/src/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateProductDescription } from "@/src/lib/ai/generate-description";
import { revalidatePath } from "next/cache";

export async function generateDescription(productId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { owner: true },
  });

  if (!product || product.owner.clerkId !== userId) {
    throw new Error("Not allowed");
  }

  const aiDescription = await generateProductDescription(product.name);

  await prisma.product.update({
    where: { id: productId },
    data: { description: aiDescription },
  });

  revalidatePath("/dashboard");
}
