"use client";

import React from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4 overflow-y-auto max-h-[400px] p-4 bg-white rounded-md shadow-sm">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-3 rounded-md ${
            msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100"
          }`}
        >
          <p>{msg.content}</p>
        </div>
      ))}
    </div>
  );
}
