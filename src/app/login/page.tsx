"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    return (
        <div className="login-page">
            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                        <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
                        <path
                            d="M50 18 C50 18 72 28 72 50 C72 72 50 82 50 82 C50 82 28 72 28 50 C28 28 50 18 50 18Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.3"
                        />
                        <text x="50" y="56" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="600" fontFamily="Inter, sans-serif">
                            AI
                        </text>
                    </svg>
                </div>

                <h1 className="login-title">Welcome to Assistant</h1>
                <p className="login-desc">Sign in to start chatting with AI</p>

                {/* Google Sign In Button */}
                <button
                    className="google-btn"
                    onClick={() => signIn("google", { callbackUrl })}
                    id="google-signin-btn"
                >
                    <svg className="google-icon" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span>Continue with Google</span>
                </button>

                <div className="login-footer">
                    By continuing, you agree to our Terms of Service
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="login-page">
                    <div className="login-card">
                        <div className="login-logo" />
                        <h1 className="login-title">Loading...</h1>
                    </div>
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}
