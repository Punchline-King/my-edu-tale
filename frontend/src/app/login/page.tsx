"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { signInWithGoogle } from "@/services/authService";
import { fetchUserProfile } from "@/services/profileService";
import { useUserStore } from "@/store/userStore";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { setAuth, setChildInfo } = useUserStore();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login - just navigate to next step
        router.push("/child-info");
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);

            // Supabase will handle the redirect automatically
            // If using mock, it will return user data
            await signInWithGoogle();

            // Note: For real Supabase OAuth, this code won't execute
            // because the browser will redirect to Google
            // The flow will continue in /auth/callback after Google redirect

        } catch (error) {
            console.error("Google login failed:", error);
            setIsLoading(false);

            // Show error message
            alert(error instanceof Error ? error.message : '로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card variant="default" hover={false} className="p-8">
                    <div className="text-center mb-8">
                        <LogIn className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h1 className="text-3xl font-bold mb-2">부모님 로그인</h1>
                        <p className="text-foreground/60">
                            아이의 학습을 시작하려면 로그인해주세요
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 shadow-md flex items-center justify-center gap-3"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="w-5 h-5 border-3 border-primary border-t-transparent rounded-full"
                            />
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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
                                <span>Google로 계속하기</span>
                            </>
                        )}
                    </Button>
                </Card>
            </motion.div>
        </div>
    );
}
