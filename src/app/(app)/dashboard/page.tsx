import { NewProductForm } from "@/src/components/forms/new-product-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Link from "next/link";
import { getMyProducts } from "@/src/lib/server/queries/products";
import { Button } from "@/src/components/ui/button";

export default async function DashboardPage() {
  const products = await getMyProducts();

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
        {products.map((product: any) => (
          <div className="flex flex-col gap-2 pt-3" key={product.id}>
            <Link href={`/dashboard/${product.id}/chat`} className="block">
              <Card>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {product.description || "No description yet."}
                </CardContent>
              </Card>
            </Link>
            <Button className="w-fit" asChild variant="outline" size="sm">
              <Link href={`/dashboard/${product.id}/docs`}>{product.name} Documents</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
