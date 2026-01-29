import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14  items-center px-4">
          <Link href="/" className="font-semibold">
            AI Product Copilot
          </Link>

          <nav className="ml-6 hidden gap-4 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#how" className="hover:text-foreground">
              How it works
            </a>
          </nav>

          <div className="ml-auto flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* hero */}
      <main className="mx-auto max-w-6xl px-4 py-16 flex flex-col justify-center items-center h-[60vh]">
        <h1 className="text-4xl font-bold tracking-tight ">
          Your Product Copilot for docs, roadmap, and decisions.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Upload product docs, chat with context, and generate actionable product
          guidance—fast.
        </p>

        <div className="mt-6 flex gap-3 justify-center">
          <Button asChild>
            <Link href="/dashboard">Products dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="#features">See features</a>
          </Button>
        </div>
      </main>
    </div>
  );
}

