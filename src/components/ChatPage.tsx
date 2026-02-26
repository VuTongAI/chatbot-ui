"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useChatContext } from "@/context/ChatContext";
import { Message } from "@/types/chat";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import WelcomeScreen from "@/components/WelcomeScreen";

export default function ChatPage() {
    const { data: session } = useSession();
    const { state, createSession, addMessage, getActiveSession } = useChatContext();

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const activeSession = getActiveSession();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeSession?.messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "22px";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + "px";
        }
    }, [input]);

    const sendMessage = useCallback(
        async (text: string) => {
            const trimmed = text.trim();
            if (!trimmed || isLoading) return;
            const sessionId = state.activeSessionId;
            if (!sessionId) return;

            setInput("");
            setIsLoading(true);

            const userMsg: Message = {
                id: crypto.randomUUID?.() || Date.now().toString(),
                role: "user",
                content: trimmed,
                timestamp: Date.now(),
            };
            addMessage(sessionId, userMsg);

            try {
                const session = state.sessions.find((s) => s.id === sessionId);
                const history = session
                    ? session.messages.map((m) => ({ role: m.role, content: m.content }))
                    : [];
                history.push({ role: "user", content: trimmed });

                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: history }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Request failed");

                addMessage(sessionId, {
                    id: crypto.randomUUID?.() || (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.message,
                    timestamp: Date.now(),
                });
            } catch (err) {
                addMessage(sessionId, {
                    id: crypto.randomUUID?.() || (Date.now() + 1).toString(),
                    role: "assistant",
                    content: `Something went wrong. ${err instanceof Error ? err.message : "Please try again."}`,
                    timestamp: Date.now(),
                });
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, state.activeSessionId, state.sessions, addMessage]
    );

    useEffect(() => {
        if (pendingMessage && state.activeSessionId) {
            sendMessage(pendingMessage);
            setPendingMessage(null);
        }
    }, [pendingMessage, state.activeSessionId, sendMessage]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;
        if (!state.activeSessionId) {
            setPendingMessage(trimmed);
            setInput("");
            createSession();
        } else {
            sendMessage(trimmed);
        }
    };

    const handleSuggestion = (text: string) => {
        if (!state.activeSessionId) {
            setPendingMessage(text);
            createSession();
        } else {
            sendMessage(text);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="app-container">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <main className="chat-area">
                {/* Header */}
                <header className="chat-header">
                    <div className="chat-header-left">
                        {!sidebarOpen && (
                            <button className="menu-btn" onClick={() => setSidebarOpen(true)} id="open-sidebar-btn" aria-label="Menu">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            </button>
                        )}
                        <span className="chat-header-title">
                            {activeSession ? activeSession.title : "New conversation"}
                        </span>
                    </div>
                    <div className="chat-header-right">
                        <div className="status-indicator">
                            <div className="status-dot" />
                            <span>Online</span>
                        </div>
                        {session?.user && (
                            <div className="user-profile">
                                {session.user.image && (
                                    <img
                                        src={session.user.image}
                                        alt=""
                                        className="user-avatar"
                                        referrerPolicy="no-referrer"
                                    />
                                )}
                                <span className="user-name">{session.user.name?.split(" ")[0]}</span>
                                <button
                                    className="signout-btn"
                                    onClick={() => signOut()}
                                    title="Sign out"
                                    aria-label="Sign out"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Body */}
                {!activeSession || activeSession.messages.length === 0 ? (
                    <WelcomeScreen onSuggestionClick={handleSuggestion} />
                ) : (
                    <div className="messages-container" id="messages-container">
                        {activeSession.messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="typing-row">
                                <div className="message-avatar assistant">
                                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16 }}>
                                        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="4" opacity="0.3" />
                                        <text x="50" y="58" textAnchor="middle" fill="currentColor" fontSize="32" fontWeight="600">AI</text>
                                    </svg>
                                </div>
                                <div className="typing-bubble">
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Input */}
                <div className="input-area">
                    <div className="input-container">
                        <div className="input-box">
                            <textarea
                                ref={textareaRef}
                                className="input-textarea"
                                placeholder="Message Assistant..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                disabled={isLoading}
                                id="chat-input"
                            />
                            <button
                                className="send-btn"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                aria-label="Send"
                                id="send-btn"
                            >
                                {isLoading ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'breathe 1.5s ease-in-out infinite' }}>
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="input-footer">
                            LangChain + OpenAI · Enter to send · Shift+Enter for new line
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
