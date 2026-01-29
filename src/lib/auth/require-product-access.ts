// src/lib/auth/require-product-access.ts
import { prisma } from "@/src/lib/db/prisma";

export async function requireProductAccess(productId: string, userId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, owner: { clerkId: userId } }
  });

  if (!product) throw new Error("NOT_FOUND");
  return product;
}
