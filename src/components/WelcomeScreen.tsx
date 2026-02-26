"use client";

import React from "react";

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
            {/* AI Logo */}
            <div className="welcome-logo">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                    <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
                    <path d="M50 18 C50 18 72 28 72 50 C72 72 50 82 50 82 C50 82 28 72 28 50 C28 28 50 18 50 18Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                    <text x="50" y="56" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="600" fontFamily="Inter, sans-serif">AI</text>
                </svg>
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
