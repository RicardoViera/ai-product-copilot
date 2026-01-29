import { prisma } from "@/src/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";

export const syncUser = cache(async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("USER_MISSING_EMAIL");
  }

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return prisma.user.upsert({
    where: { clerkId: user.id },
    update: { email, name: fullName },
    create: { clerkId: user.id, email, name: fullName },
  });
});
