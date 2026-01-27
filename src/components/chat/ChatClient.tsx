"use client";

import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatClient({
  messages,
  productId,
}: {
  messages: Message[];
  productId: string;
}) {
  return (
    <div>
      <ChatMessages messages={messages} />
      <ChatInput productId={productId} />
    </div>
  );
}
