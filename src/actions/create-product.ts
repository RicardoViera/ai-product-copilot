"use server";

import { prisma } from "@/src/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    throw new Error("Product name is required");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  await prisma.product.create({
    data: {
      name,
      description,
      ownerId: dbUser.id,
    },
  });

  revalidatePath("/dashboard");
}
