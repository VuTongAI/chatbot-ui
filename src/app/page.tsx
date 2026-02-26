"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatProvider } from "@/context/ChatContext";
import ChatPage from "@/components/ChatPage";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" opacity="0.2" />
              <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
              <text x="50" y="56" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="600" fontFamily="Inter, sans-serif">AI</text>
            </svg>
          </div>
          <h1 className="login-title">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <ChatProvider>
      <ChatPage />
    </ChatProvider>
  );
}
