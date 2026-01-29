import { ReactNode } from "react";
import { syncUser } from "@/src/lib/auth/sync-user";
import { requireUserId } from "@/src/lib/auth/require-user";
import { AppShell } from "@/src/components/layout/AppShell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireUserId();
  await syncUser();

  return <AppShell>{children}</AppShell>;
}
