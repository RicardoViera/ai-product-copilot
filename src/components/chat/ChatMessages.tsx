"use client";

import { UIMessage } from "ai";

export function ChatMessages({ messages }: { messages: UIMessage[] }) {
  return (
    <div className="space-y-4">
      {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-lg p-3 ${
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {m.parts.map((part, i) =>
                part.type === "text" ? (
                  <span key={i} className="whitespace-pre-wrap">
                    {part.text}
                  </span>
                ) : null
              )}
        </div>
      ))}
    </div>
  );
}
