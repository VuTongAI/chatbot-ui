"use client";

import { ChatProvider } from "@/context/ChatContext";
import ChatPage from "@/components/ChatPage";

export default function Home() {
  return (
    <ChatProvider>
      <ChatPage />
    </ChatProvider>
  );
}
