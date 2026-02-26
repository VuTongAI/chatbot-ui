// Types for the chat application

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

export interface ChatContextState {
    sessions: ChatSession[];
    activeSessionId: string | null;
}
