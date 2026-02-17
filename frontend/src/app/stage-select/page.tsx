"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FullscreenToggle } from "@/components/ui/FullscreenToggle";
import { useUserStore } from "@/store/userStore";
import { getMockStages } from "@/lib/mockData";
import { Lock, Check, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function StageSelectPage() {
    const router = useRouter();
    const childInfo = useUserStore((state) => state.childInfo);
    const completedStages = useUserStore((state) => state.completedStages);

    const stages = getMockStages();

    const handleStageClick = (stageId: string) => {
        router.push(`/emotion?stage=${stageId}`);
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <FullscreenToggle />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        스테이지를 선택하세요! 🗺️
                    </motion.h1>
                    {childInfo && (
                        <p className="text-lg text-foreground/70">
                            {childInfo.child_name}님, 어느 모험을 시작할까요?
                        </p>
                    )}
                </div>

                {/* Stage Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stages.map((stage, index) => {
                        const isCompleted = completedStages.includes(stage.id);

                        return (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    variant={
                                        isCompleted
                                            ? "mint"
                                            : index % 3 === 0
                                                ? "sky"
                                                : index % 3 === 1
                                                    ? "lemon"
                                                    : "pink"
                                    }
                                    hover={true}
                                >
                                    {/* Status Badge */}
                                    {isCompleted && (
                                        <div className="absolute top-4 right-4">
                                            <div className="bg-success text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                                <Check size={12} />
                                                완료
                                            </div>
                                        </div>
                                    )}

                                    {/* Stage Info */}
                                    <div className="text-center mb-6">
                                        <div className="text-5xl mb-4">
                                            {isCompleted ? "✅" : "🎮"}
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{stage.name}</h3>
                                        <p className="text-sm text-foreground/60">
                                            {stage.chapter}
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        variant={isCompleted ? "success" : "primary"}
                                        size="md"
                                        className="w-full"
                                        onClick={() => handleStageClick(stage.id)}
                                    >
                                        {isCompleted ? (
                                            <>다시 플레이</>
                                        ) : (
                                            <>
                                                <Play size={18} className="mr-2" />
                                                시작하기
                                            </>
                                        )}
                                    </Button>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
