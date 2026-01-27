"use client";

import { useTransition } from "react";
import { sendMessage } from "@/src/actions/send-message";

type Props = {
  productId: string;
};

export function ChatInput({ productId }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        formData.append("productId", productId);
        startTransition(() => sendMessage(formData));
      }}
      className="mt-4 flex space-x-2"
    >
      <input
        name="message"
        type="text"
        placeholder="Ask your AI Copilot..."
        className="flex-grow border border-gray-300 rounded-md px-3 py-2"
        disabled={isPending}
        required
      />

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {isPending ? "Thinking..." : "Send"}
      </button>
    </form>
  );
}
