"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { ChatMessages } from "./ChatMessages";
import { ChevronDown } from "lucide-react";

type Props = {
  productId: string;
  initialMessages: UIMessage[];
};

export default function ChatClient({ productId, initialMessages }: Props) {
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { productId },
      }),
    [productId],
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
    id: `product:${productId}`,
    messages: initialMessages,
  });

  const isBusy = status === "submitted" || status === "streaming";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;

    await sendMessage({ text });
    setInput("");
  }

  function scrollToBottom(smooth = true) {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    setShowScrollButton(!nearBottom);
  }

  // Auto-scroll only if user is near bottom (won’t hijack if they scroll up)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) scrollToBottom(true);
  }, [messages, status]);

  // Ensure we start at bottom on first render
  useEffect(() => {
    scrollToBottom(false);
     
  }, []);

  return (
    <div className="relative flex max-h-[90vh] flex-col rounded-lg border p-4">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto pr-4"
      >
        <ChatMessages messages={messages}></ChatMessages>

        {status === "error" && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
            {error?.message ?? "Something went wrong sending that message."}
          </div>
        )}

        {/* Bottom anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Down Arrow */}
      {showScrollButton && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full border bg-background p-2 shadow-md hover:bg-muted transition"
          aria-label="Scroll to bottom"
        >
          <ChevronDown />
        </button>
      )}

      <form onSubmit={onSubmit} className="flex gap-2 pt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about this product..."
          disabled={isBusy}
        />
        <Button type="submit" disabled={isBusy || !input.trim()}>
          {isBusy ? "Thinking..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
