"use client";

import { useTransition } from "react";
import { createProduct } from "@/src/actions/create-product";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";

export function NewProductForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(() => createProduct(formData))
      }
      className="space-y-4"
    >
      <Input name="name" placeholder="Product name" required />
      <Textarea name="description" placeholder="What is this product about?" />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
}
