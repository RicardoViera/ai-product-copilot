import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 p-4">
        <h2 className="mb-4 text-lg font-semibold">
          AI Product Copilot
        </h2>
        <nav className="space-y-2 text-sm text-muted-foreground">
          <div>Dashboard</div>
          <div>Products</div>
          <div>Settings</div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
