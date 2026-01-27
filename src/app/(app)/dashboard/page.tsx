import { prisma } from "@/src/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { NewProductForm } from "@/src/components/forms/new-product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { generateDescription } from "@/src/actions/generate-description";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId! },
    include: { products: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Your Products</h1>
        <p className="text-muted-foreground">
          Create and manage your AI-assisted products
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <NewProductForm />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {dbUser?.products.map((product) => (
          <Link
            key={product.id}
            href={`/dashboard/${product.id}/chat`}
            className="block"
          >
            <Card>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {product.description || "No description yet."}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

    </div>
  );
}
