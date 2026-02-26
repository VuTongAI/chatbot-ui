"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/types/chat";

interface ChatMessageProps {
    message: Message;
}

function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div className={`message-row ${message.role}`}>
            {!isUser && (
                <div className="message-avatar assistant">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="4" opacity="0.3" />
                        <text x="50" y="58" textAnchor="middle" fill="currentColor" fontSize="32" fontWeight="600" fontFamily="Inter, sans-serif">AI</text>
                    </svg>
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
                <div className="message-timestamp">{formatTime(message.timestamp)}</div>
            </div>
        </div>
    );
}
