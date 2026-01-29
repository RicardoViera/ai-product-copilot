"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export function UploadDocForm({ productId }: { productId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const fd = new FormData();
    fd.append("productId", productId);
    fd.append("file", file);

    startTransition(async () => {
      const res = await fetch("/api/docs/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg);
        return;
      }

      // simplest refresh: reload current route
      window.location.reload();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input
        type="file"
        accept=".txt,.md,text/plain,text/markdown"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <Button type="submit" disabled={isPending || !file}>
        {isPending ? "Uploading..." : "Upload doc"}
      </Button>
    </form>
  );
}
