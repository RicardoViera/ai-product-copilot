import { cache } from "react";
import { prisma } from "@/src/lib/db/prisma";
import { requireUserId } from "@/src/lib/auth/require-user";

/**
 * Fetch a product only if owned by the current user.
 * Cached per request/render pass.
 */
export const getMyProductBase = cache(async (productId: string) => {
  const clerkId = await requireUserId();
  const product = await prisma.product.findFirst({
    where: { id: productId, owner: { clerkId } },
    select: { id: true, name: true, description: true },
  });
  if (!product) throw new Error("NOT_FOUND");
  return product;
});

export const getMyProductWithMessages = cache(async (productId: string) => {
  const clerkId = await requireUserId();
  const product = await prisma.product.findFirst({
    where: { id: productId, owner: { clerkId } },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!product) throw new Error("NOT_FOUND");
  return product;
});

export const getMyProductWithDocs = cache(async (productId: string) => {
  const clerkId = await requireUserId();
  const product = await prisma.product.findFirst({
    where: { id: productId, owner: { clerkId } },
    include: { docs: { orderBy: { createdAt: "desc" } } },
  });
  if (!product) throw new Error("NOT_FOUND");
  return product;
});
