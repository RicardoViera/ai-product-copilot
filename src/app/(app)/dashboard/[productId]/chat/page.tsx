import { ChatClientWrapper } from "@/src/components/chat/ChatClientWrapper";
import { UIMessage } from "ai";
import { getMyProductWithMessages } from "@/src/lib/server/queries/product";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await getMyProductWithMessages(productId);

  const messages: UIMessage[] = product.messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    parts: [{ type: "text", text: m.content }],
  }));

  return (
    <div>
      <div className="flex justify-between">
      <h1 className="text-2xl font-bold mb-4">Chat about {product.name}</h1>
      <Link className="underline" href={`/dashboard/${productId}/docs`}>
          <Button variant="ghost" className="w-fit">
            <ArrowLeft className="h-4 w-4" /> {product?.name}'s Documents
          </Button>
        </Link>
      </div>

      <ChatClientWrapper initialMessages={messages} productId={productId} />
    </div>
  );
}
