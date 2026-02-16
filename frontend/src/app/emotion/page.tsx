"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useUserStore } from "@/store/userStore";
import { EMOTION_ICONS } from "@/lib/types";
import { generateStoryId } from "@/lib/mockData";
import { motion } from "framer-motion";
import type { GameSession } from "@/lib/types";

export default function EmotionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const stage = searchParams.get("stage") || "1-1-1";

    const childInfo = useUserStore((state) => state.childInfo);
    const setGameSession = useUserStore((state) => state.setGameSession);
    const setCurrentStoryId = useUserStore((state) => state.setCurrentStoryId);

    const emotions: Array<{
        key: GameSession["emotion"];
        label: string;
        color: string;
    }> = [
            { key: "happiness", label: "기쁨", color: "lemon" },
            { key: "sadness", label: "슬픔", color: "sky" },
            { key: "anger", label: "화남", color: "coral" },
            { key: "fear", label: "두려움", color: "lavender" },
            { key: "bored", label: "지루함", color: "mint" },
        ];

    const handleEmotionSelect = (emotion: GameSession["emotion"]) => {
        const gameSession: GameSession = { emotion, stage };
        setGameSession(gameSession);

        if (childInfo) {
            const storyId = generateStoryId(childInfo, emotion, stage);
            setCurrentStoryId(storyId);
            router.push(`/story/${storyId}`);
        } else {
            alert("아이 정보를 먼저 입력해주세요!");
            router.push("/child-info");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        오늘 기분이 어때요? 😊
                    </h1>
                    <p className="text-lg text-foreground/70">
                        지금 느끼는 감정을 선택해주세요
                    </p>
                </motion.div>

                {/* Emotion Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {emotions.map((emotion, index) => (
                        <motion.div
                            key={emotion.key}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                variant={emotion.color as any}
                                className="cursor-pointer text-center"
                                onClick={() => handleEmotionSelect(emotion.key)}
                            >
                                <div className="text-6xl mb-4">
                                    {EMOTION_ICONS[emotion.key]}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{emotion.label}</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEmotionSelect(emotion.key);
                                    }}
                                >
                                    선택하기
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => router.back()}
                    >
                        ← 뒤로 가기
                    </Button>
                </div>
            </div>
        </div>
    );
}
