"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/userStore";
import { EMOTION_ICONS } from "@/lib/types";
import { motion } from "framer-motion";
import type { GameSession } from "@/lib/types";

export default function EmotionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const stage = searchParams.get("stage") || "1-1-1";

    const childInfo = useUserStore((state) => state.childInfo);
    const setGameSession = useUserStore((state) => state.setGameSession);

    const emotions: Array<{
        key: GameSession["emotion"];
        label: string;
        color: string;
    }> = [
            { key: "happiness", label: "기쁨", color: "bg-yellow-100" },
            { key: "sadness", label: "슬픔", color: "bg-blue-100" },
            { key: "anger", label: "화남", color: "bg-red-100" },
            { key: "fear", label: "두려움", color: "bg-purple-100" },
            { key: "bored", label: "지루함", color: "bg-green-100" },
        ];

    const handleEmotionSelect = (emotion: GameSession["emotion"]) => {
        const gameSession: GameSession = { emotion, stage };
        setGameSession(gameSession);

        if (childInfo) {
            // Navigate to loading page with query params for backend API call
            router.push(`/loading?emotion=${emotion}&stage=${stage}`);
        } else {
            alert("아이 정보를 먼저 입력해주세요!");
            router.push("/child-info");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 text-[200px] opacity-10"
                >
                    🎡
                </motion.div>
                <div className="absolute top-20 right-20 w-32 h-32 bg-pink-300 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-40"></div>
            </div>

            <div className="max-w-5xl w-full relative z-10 text-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="inline-block bg-white/40 backdrop-blur-md px-10 py-6 rounded-3xl border border-white/50 shadow-lg">
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-gray-700">
                            오늘 기분이 어때요? 🤔
                        </h1>
                        <p className="text-lg text-gray-600 font-medium">
                            지금 느끼는 감정을 선택하면<br className="md:hidden" /> AI가 이야기를 만들어줄게요!
                        </p>
                    </div>
                </motion.div>

                {/* Emotion Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {emotions.map((emotion, index) => (
                        <motion.button
                            key={emotion.key}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEmotionSelect(emotion.key)}
                            className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center gap-4 group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-white/80"
                        >
                            <div className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                                {EMOTION_ICONS[emotion.key]}
                            </div>
                            <div className="bg-white/60 px-4 py-1 rounded-full text-lg font-bold text-gray-800 group-hover:bg-white group-hover:text-primary transition-colors">
                                {emotion.label}
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12"
                >
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 font-bold bg-white/30 hover:bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm"
                    >
                        ← 뒤로 가기
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
