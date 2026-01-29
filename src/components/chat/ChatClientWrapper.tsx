import type { UIMessage } from "ai";
import ChatClient from "./ChatClient";

type Props = {
  initialMessages: UIMessage[];
  productId: string;
};

export function ChatClientWrapper({ initialMessages, productId }: Props) {
  return <ChatClient initialMessages={initialMessages} productId={productId} />;
}