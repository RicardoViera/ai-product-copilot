import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const { userId } = await auth();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { owner: true, messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!product || product.owner.clerkId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(product.messages);
}
