import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/src/lib/auth/sync-user";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await syncUser();

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
