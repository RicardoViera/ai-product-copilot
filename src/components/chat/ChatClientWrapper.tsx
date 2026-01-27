"use client";

import dynamic from "next/dynamic";

const ChatClient = dynamic(() => import("./ChatClient"), { ssr: false });

type Props = {
  messages: {
    id: string;
    role: "user" | "assistant";
    content: string;
  }[];
  productId: string;
};

export function ChatClientWrapper({ messages, productId }: Props) {
  return <ChatClient messages={messages} productId={productId} />;
}
