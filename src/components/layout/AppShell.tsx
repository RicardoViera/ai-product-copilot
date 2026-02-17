"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const linkClass =
    "block rounded-md px-3 py-2 text-sm hover:bg-muted transition";

  return (
    <nav className="space-y-1">
      <Link className={linkClass} href="/dashboard" onClick={onNavigate}>
        Dashboard
      </Link>
     
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-14 items-center gap-3 px-4">
          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  ☰
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-4">
                  <div className="font-semibold">AI Product Copilot</div>
                  <div className="text-xs text-muted-foreground">
                    Navigation
                  </div>
                </div>
                <Separator />
                <div className="p-3">
                  <NavLinks onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Brand */}
          <Link href="/dashboard" className="font-semibold">
            AI Product Copilot
          </Link>

          <div className="ml-auto">
            {/* later: user menu */}
          </div>
        </div>
      </div>

      <div className="flex max-w-6xl h-dvh">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <div className="p-4">
            <div className="font-semibold">Navigation</div>
            <div className="text-xs text-muted-foreground">
              Manage your workspace
            </div>
          </div>
          <Separator />
          <div className="p-3">
            <NavLinks />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
