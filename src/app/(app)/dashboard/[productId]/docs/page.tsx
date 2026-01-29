import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { UploadDocForm } from "@/src/components/docs/UploadDocForm";
import { getMyProductWithDocs } from "@/src/lib/server/queries/product";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function DocsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await getMyProductWithDocs(productId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Docs for {product?.name}</h1>
          <p className="text-muted-foreground">
            Paste notes your Copilot can reference.
          </p>
        </div>

        <Link className="underline" href={`/dashboard/${productId}/chat`}>
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" /> {product?.name}'s Chat
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a doc</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadDocForm productId={productId} />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {product?.docs.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle className="text-base">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
              {doc.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
