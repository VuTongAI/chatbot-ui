"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { ChatSession, Message, ChatContextState } from "@/types/chat";

// ===== STORAGE KEY =====
const STORAGE_KEY = "chatbot_ai_sessions";

// ===== HELPER: Generate UUID =====
function generateId(): string {
    return crypto.randomUUID?.() ||
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
}

// ===== HELPER: Generate title from first message =====
function generateTitle(content: string): string {
    const cleaned = content.replace(/[#*`]/g, '').trim();
    if (cleaned.length <= 40) return cleaned;
    return cleaned.substring(0, 40) + '...';
}

// ===== ACTIONS =====
type ChatAction =
    | { type: 'LOAD_STATE'; payload: ChatContextState }
    | { type: 'CREATE_SESSION' }
    | { type: 'DELETE_SESSION'; payload: string }
    | { type: 'SET_ACTIVE_SESSION'; payload: string }
    | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: Message } }
    | { type: 'UPDATE_SESSION_TITLE'; payload: { sessionId: string; title: string } };

// ===== REDUCER =====
function chatReducer(state: ChatContextState, action: ChatAction): ChatContextState {
    switch (action.type) {
        case 'LOAD_STATE':
            return action.payload;

        case 'CREATE_SESSION': {
            const newSession: ChatSession = {
                id: generateId(),
                title: 'Cuộc trò chuyện mới',
                messages: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            return {
                sessions: [newSession, ...state.sessions],
                activeSessionId: newSession.id,
            };
        }

        case 'DELETE_SESSION': {
            const filtered = state.sessions.filter(s => s.id !== action.payload);
            let newActiveId = state.activeSessionId;
            if (state.activeSessionId === action.payload) {
                newActiveId = filtered.length > 0 ? filtered[0].id : null;
            }
            return {
                sessions: filtered,
                activeSessionId: newActiveId,
            };
        }

        case 'SET_ACTIVE_SESSION':
            return {
                ...state,
                activeSessionId: action.payload,
            };

        case 'ADD_MESSAGE': {
            const { sessionId, message } = action.payload;
            return {
                ...state,
                sessions: state.sessions.map(session => {
                    if (session.id !== sessionId) return session;
                    const updatedMessages = [...session.messages, message];
                    // Auto-update title from first user message
                    let title = session.title;
                    if (message.role === 'user' && session.messages.filter(m => m.role === 'user').length === 0) {
                        title = generateTitle(message.content);
                    }
                    return {
                        ...session,
                        messages: updatedMessages,
                        title,
                        updatedAt: Date.now(),
                    };
                }),
            };
        }

        case 'UPDATE_SESSION_TITLE':
            return {
                ...state,
                sessions: state.sessions.map(session =>
                    session.id === action.payload.sessionId
                        ? { ...session, title: action.payload.title, updatedAt: Date.now() }
                        : session
                ),
            };

        default:
            return state;
    }
}

// ===== CONTEXT =====
interface ChatContextValue {
    state: ChatContextState;
    createSession: () => void;
    deleteSession: (id: string) => void;
    setActiveSession: (id: string) => void;
    addMessage: (sessionId: string, message: Message) => void;
    getActiveSession: () => ChatSession | null;
}

const ChatContext = createContext<ChatContextValue | null>(null);

// ===== PROVIDER =====
export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(chatReducer, {
        sessions: [],
        activeSessionId: null,
    });

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as ChatContextState;
                dispatch({ type: 'LOAD_STATE', payload: parsed });
            }
        } catch (err) {
            console.error('Failed to load chat state:', err);
        }
    }, []);

    // Save to localStorage on state change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
            console.error('Failed to save chat state:', err);
        }
    }, [state]);

    const createSession = useCallback(() => {
        dispatch({ type: 'CREATE_SESSION' });
    }, []);

    const deleteSession = useCallback((id: string) => {
        dispatch({ type: 'DELETE_SESSION', payload: id });
    }, []);

    const setActiveSession = useCallback((id: string) => {
        dispatch({ type: 'SET_ACTIVE_SESSION', payload: id });
    }, []);

    const addMessage = useCallback((sessionId: string, message: Message) => {
        dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message } });
    }, []);

    const getActiveSession = useCallback((): ChatSession | null => {
        return state.sessions.find(s => s.id === state.activeSessionId) || null;
    }, [state.sessions, state.activeSessionId]);

    return (
        <ChatContext.Provider value={{ state, createSession, deleteSession, setActiveSession, addMessage, getActiveSession }}>
            {children}
        </ChatContext.Provider>
    );
}

// ===== HOOK =====
export function useChatContext() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChatContext must be within ChatProvider');
    return ctx;
}
