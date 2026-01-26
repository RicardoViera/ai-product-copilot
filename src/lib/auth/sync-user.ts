import { prisma } from "@/src/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  const user = await currentUser();

  if (!user || !user.emailAddresses[0]?.emailAddress) {
    return null;
  }

  const email = user.emailAddresses[0].emailAddress;
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      email,
      name: fullName,
    },
    create: {
      clerkId: user.id,
      email,
      name: fullName,
    },
  });

  return dbUser;
}
