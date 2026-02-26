"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/types/chat";
import AILogo from "@/components/AILogo";

interface ChatMessageProps {
    message: Message;
}

function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatResponseTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";
    const isAssistant = message.role === "assistant";

    return (
        <div className={`message-row ${message.role}`}>
            {isAssistant && (
                <div className="message-avatar assistant">
                    <AILogo size={16} />
                </div>
            )}
            <div className="message-content">
                <div className={`message-bubble ${message.role}`}>
                    {isUser ? (
                        message.content
                    ) : (
                        <div className="markdown-body">
                            <ReactMarkdown
                                components={{
                                    code({ className, children, ...props }) {
                                        const isInline = !className;
                                        if (isInline) {
                                            return <code {...props}>{children}</code>;
                                        }
                                        return (
                                            <pre>
                                                <code className={className} {...props}>{children}</code>
                                            </pre>
                                        );
                                    },
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Meta info row */}
                <div className="message-meta">
                    <span className="message-timestamp">{formatTime(message.timestamp)}</span>

                    {isAssistant && (message.responseTime || message.tokens) && (
                        <span className="message-stats">
                            {message.responseTime && (
                                <span className="stat-item">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    {formatResponseTime(message.responseTime)}
                                </span>
                            )}
                            {message.tokens && (
                                <span className="stat-item">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                    {message.tokens.total} tokens
                                </span>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
