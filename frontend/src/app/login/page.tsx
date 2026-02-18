"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { signInWithGoogle } from "@/services/authService";
import { useUserStore } from "@/store/userStore";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Kept the store logic just in case, though unused in the simplified view
    const { setAuth } = useUserStore();

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            await signInWithGoogle();
        } catch (error) {
            console.error("Google login failed:", error);
            setIsLoading(false);
            alert(error instanceof Error ? error.message : '로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-pastel-mesh relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ y: [0, -15, 0], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-20 left-10 text-4xl"
                >
                    ✏️
                </motion.div>
                <motion.div
                    animate={{ y: [0, 15, 0], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute top-40 right-20 text-4xl"
                >
                    📚
                </motion.div>
                <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 mix-blend-multiply filter"></div>
                <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-30 mix-blend-multiply filter"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative z-10 flex flex-col items-center mt-12"
            >
                {/* Mascot Peeking - Now separated */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-[120px] drop-shadow-xl z-20 mb-10 relative"
                >
                    🤖
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute -right-8 -top-4 bg-white px-4 py-2 rounded-full text-lg shadow-lg border border-gray-100 whitespace-nowrap"
                    >
                        안녕! 👋
                    </motion.div>
                </motion.div>

                <div className="w-full glass-card p-12 pt-12 rounded-[2.5rem] backdrop-blur-xl border border-white/50 shadow-2xl relative bg-white/40">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold mb-4 text-gray-700">
                            부모님 로그인
                        </h1>
                        <p className="text-gray-600 text-lg font-medium leading-relaxed">
                            아이의 모험을 기록하기 위해<br />로그인이 필요해요!
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-none shadow-lg py-8 rounded-3xl flex items-center justify-center gap-4 transition-all"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                                />
                            ) : (
                                <>
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="font-bold text-xl">Google계정으로 로그인</span>
                                </>
                            )}
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
