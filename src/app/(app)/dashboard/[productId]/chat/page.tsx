import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { ChatClientWrapper } from "@/src/components/chat/ChatClientWrapper";

export default async function ChatPage({
    params,
}: {
    params: Promise<{ productId: string }>;
}) {
    const { userId } = await auth();
    if (!userId) notFound();

    // ✅ Await params
    const { productId } = await params;

    if (!productId) notFound();

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            owner: true,
            messages: { orderBy: { createdAt: "asc" } },
        },
    });

    if (!product || product.owner.clerkId !== userId) {
        notFound();
    }

    const messages = product.messages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
    }));

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Chat about {product.name}
            </h1>

            <ChatClientWrapper messages={messages} productId={productId} />
        </div>
    );
}
