import React from "react";

interface AILogoProps {
    size?: number;
    className?: string;
}

export default function AILogo({ size = 72, className }: AILogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer hexagon frame */}
            <path
                d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.15"
            />
            {/* Inner hexagon */}
            <path
                d="M32 12L48 21V39L32 48L16 39V21L32 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.25"
            />
            {/* Center brain circuit nodes */}
            {/* Top node */}
            <circle cx="32" cy="16" r="2" fill="currentColor" opacity="0.6" />
            {/* Top-right */}
            <circle cx="44" cy="23" r="2" fill="currentColor" opacity="0.6" />
            {/* Bottom-right */}
            <circle cx="44" cy="37" r="2" fill="currentColor" opacity="0.6" />
            {/* Bottom */}
            <circle cx="32" cy="44" r="2" fill="currentColor" opacity="0.6" />
            {/* Bottom-left */}
            <circle cx="20" cy="37" r="2" fill="currentColor" opacity="0.6" />
            {/* Top-left */}
            <circle cx="20" cy="23" r="2" fill="currentColor" opacity="0.6" />

            {/* Core circle */}
            <circle cx="32" cy="30" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <circle cx="32" cy="30" r="3" fill="currentColor" opacity="0.8" />

            {/* Neural connections from core to nodes */}
            <line x1="32" y1="22" x2="32" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="38" y1="25" x2="44" y2="23" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="38" y1="35" x2="44" y2="37" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="32" y1="38" x2="32" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="26" y1="35" x2="20" y2="37" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="26" y1="25" x2="20" y2="23" stroke="currentColor" strokeWidth="1" opacity="0.35" />

            {/* Cross connections */}
            <line x1="32" y1="16" x2="44" y2="23" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />
            <line x1="44" y1="23" x2="44" y2="37" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />
            <line x1="44" y1="37" x2="32" y2="44" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />
            <line x1="32" y1="44" x2="20" y2="37" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />
            <line x1="20" y1="37" x2="20" y2="23" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />
            <line x1="20" y1="23" x2="32" y2="16" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />

            {/* Outer corner dots */}
            <circle cx="32" cy="4" r="1.5" fill="currentColor" opacity="0.2" />
            <circle cx="56" cy="18" r="1.5" fill="currentColor" opacity="0.2" />
            <circle cx="56" cy="46" r="1.5" fill="currentColor" opacity="0.2" />
            <circle cx="32" cy="60" r="1.5" fill="currentColor" opacity="0.2" />
            <circle cx="8" cy="46" r="1.5" fill="currentColor" opacity="0.2" />
            <circle cx="8" cy="18" r="1.5" fill="currentColor" opacity="0.2" />
        </svg>
    );
}
