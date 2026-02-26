"use client";

import React from "react";
import { useChatContext } from "@/context/ChatContext";
import AILogo from "@/components/AILogo";

function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return "now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d < 7) return `${d}d ago`;
    return new Date(ts).toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
}

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const { state, createSession, deleteSession, setActiveSession } = useChatContext();

    return (
        <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <AILogo size={18} />
                    </div>
                    <span className="sidebar-brand-name">Assistant</span>
                </div>
                <button className="sidebar-close-btn" onClick={onToggle} aria-label="Close sidebar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            </div>

            <button className="new-chat-btn" onClick={createSession} id="new-chat-btn">
                New conversation
            </button>

            <div className="session-list" id="session-list">
                {state.sessions.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-text">No conversations yet.</div>
                    </div>
                ) : (
                    state.sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`session-item ${session.id === state.activeSessionId ? "active" : ""}`}
                            onClick={() => setActiveSession(session.id)}
                            id={`session-${session.id}`}
                        >
                            <div className="session-item-content">
                                <div className="session-item-title">{session.title}</div>
                                <div className="session-item-meta">{timeAgo(session.updatedAt)}</div>
                            </div>
                            <div className="session-item-dot" />
                            <button
                                className="session-item-delete"
                                onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                                aria-label="Delete"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}
