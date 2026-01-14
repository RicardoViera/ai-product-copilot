import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        AI Product Copilot
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Train an AI assistant on your product documentation and chat with it.
      </p>
      <Button size="lg">Get Started</Button>
    </main>
  );
}
