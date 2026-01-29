import { cache } from "react";
import { prisma } from "@/src/lib/db/prisma";
import { syncUser } from "../../auth/sync-user";

/**
 * Returns all products owned by the current user.
 * Cached per request/render pass.
 */
export const getMyProducts = cache(async () => {
  const dbUser = await syncUser();

  return prisma.product.findMany({
    where: { ownerId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });
});
