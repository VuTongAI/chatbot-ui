"use client";

import React from "react";
import AILogo from "@/components/AILogo";

interface WelcomeScreenProps {
    onSuggestionClick: (text: string) => void;
}

const suggestions = [
    {
        title: "Analyze data",
        desc: "Analyze data and data analytics to organize around data.",
        prompt: "Hướng dẫn tôi cách phân tích dữ liệu với Python pandas",
    },
    {
        title: "Write code",
        desc: "Write code and communicate with write specialist.",
        prompt: "Viết một REST API đơn giản bằng Node.js Express",
    },
    {
        title: "Creative writing",
        desc: "Creative writing, write content and creative direction.",
        prompt: "Giúp tôi viết một bài giới thiệu sản phẩm công nghệ",
    },
    {
        title: "Summarize text",
        desc: "Summarize text with insights and meaningful context.",
        prompt: "Tóm tắt và phân tích nội dung văn bản cho tôi",
    },
];

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
    return (
        <div className="welcome-screen">
            <div className="welcome-logo">
                <AILogo size={72} />
            </div>
            <h1 className="welcome-heading">How can I help you?</h1>
            <div className="suggestions-grid">
                {suggestions.map((s, i) => (
                    <div
                        key={i}
                        className="suggestion-card"
                        onClick={() => onSuggestionClick(s.prompt)}
                        id={`suggestion-${i}`}
                    >
                        <div className="suggestion-title">{s.title}</div>
                        <div className="suggestion-desc">{s.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
