"use server";

import { prisma } from "@/src/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { generateProductDescription } from "@/src/lib/ai/generate-description";
import { syncUser } from "../lib/auth/sync-user";

export async function createProduct(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string | null)?.trim() || null;

  if (!name) throw new Error("Product name is required");

  const dbUser = await syncUser()

  // 1) create product first
  const product = await prisma.product.create({
    data: {
      name,
      description, // store user's draft if provided
      ownerId: dbUser.id,
    },
  });

  // 2) generate a polished description
  const aiDescription = await generateProductDescription({
    name,
    seedDescription: description,
  });

  // 3) update product with AI description (only if AI returned something)
  if (aiDescription) {
    await prisma.product.update({
      where: { id: product.id },
      data: { description: aiDescription },
    });
  }

  // 4) refresh dashboard list
  revalidatePath("/dashboard");
}
