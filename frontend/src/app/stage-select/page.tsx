"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FullscreenToggle } from "@/components/ui/FullscreenToggle";
import { useUserStore } from "@/store/userStore";
import { getMockStages } from "@/lib/mockData";
import { Lock, Check, Play, Star } from "lucide-react";
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
        <div className="min-h-screen bg-pastel-mesh relative overflow-x-hidden p-4 flex flex-col items-center justify-center">
            <FullscreenToggle />

            {/* Background Clouds */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-10 text-8xl opacity-40 blur-sm"
                >
                    ☁️
                </motion.div>
                <motion.div
                    animate={{ x: [0, -50, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/3 right-10 text-9xl opacity-30 blur-md"
                >
                    ☁️
                </motion.div>
                <motion.div
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 left-1/4 text-6xl opacity-40"
                >
                    🎈
                </motion.div>
            </div>

            <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col min-h-screen pb-10" style={{ paddingTop: '100px' }}>
                {/* Header */}
                <div className="text-center mb-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-md tracking-wide" style={{ marginBottom: '15px' }}>
                            모험 지도 🗺️
                        </h1>
                        <div className="glass-card rounded-full inline-block" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                            {childInfo && (
                                <p className="text-2xl md:text-4xl text-gray-700 font-bold leading-relaxed">
                                    {childInfo.child_name} 대장님,<br className="md:hidden" /> 어디로 떠날까요?
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Map Container */}
                <div className="relative flex flex-col items-center gap-24 md:gap-40" style={{ marginTop: '150px' }}>

                    {/* Winding Path SVG (Background) */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none flex justify-center">
                        <svg className="w-full h-full max-w-md opacity-30" viewBox="0 0 100 2000" preserveAspectRatio="none">
                            {/* Simple S-curve approximation - extended for longer list */}
                            <path
                                d="M50,0 Q90,200 50,400 T50,800 T50,1200 T50,1600"
                                fill="none"
                                stroke="white"
                                strokeWidth="4"
                                strokeDasharray="10 10"
                            />
                        </svg>
                    </div>

                    {stages.map((stage, index) => {
                        const isCompleted = completedStages.includes(stage.id);
                        const isLocked = false; // Disabled locking feature as per user request
                        const isChapter2 = index >= 8;

                        // Theme Colors
                        const borderColor = isChapter2 ? "border-purple-200" : "border-blue-200";
                        const badgeColor = isChapter2 ? "bg-purple-400" : "bg-blue-400";
                        const dotsColor = isChapter2 ? "bg-purple-300" : "bg-blue-300";

                        return (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className={`relative z-10 ${index % 2 === 0 ? 'translate-x-0 md:-translate-x-32' : 'translate-x-0 md:translate-x-32'}`}
                            >
                                <motion.div
                                    whileHover={!isLocked ? { y: -10, scale: 1.05 } : {}}
                                    className="relative group"
                                >
                                    {/* Island Base */}
                                    <div className={`
                                        w-64 md:w-72 p-6 rounded-[2rem] text-center transition-all duration-300
                                        ${isLocked
                                            ? "bg-gray-200/50 backdrop-blur-sm border-2 border-white/30"
                                            : `bg-white/80 backdrop-blur-md shadow-xl border-4 ${borderColor}`
                                        }
                                    `}>
                                        {/* Stage Badge */}
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                            <div className={`
                                                w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md border-4 border-white text-white font-bold
                                                ${isLocked ? 'bg-gray-400' : badgeColor}
                                            `}>
                                                {index + 1}
                                            </div>
                                        </div>

                                        <div className="mt-6 mb-4">
                                            <div className="text-4xl mb-2">{isLocked ? "🔒" : "🏝️"}</div>
                                            <h3 className={`text-xl font-bold mb-1 ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                                                {stage.name}
                                            </h3>
                                            <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {stage.chapter}
                                            </p>
                                        </div>

                                        <Button
                                            variant={isChapter2 ? "secondary" : "primary"}
                                            size="md"
                                            className={`
                                                w-full rounded-xl shadow-md font-bold
                                                ${isLocked ? '!bg-gray-300 pointer-events-none text-gray-500' : 'text-white'}
                                            `}
                                            onClick={() => handleStageClick(stage.id)}
                                            disabled={isLocked}
                                        >
                                            모험 시작
                                        </Button>
                                    </div>

                                    {/* Decorative dots underneath island to simulate floating */}
                                    {!isLocked && (
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 opacity-50">
                                            <div className={`w-2 h-2 rounded-full animate-bounce ${dotsColor}`} style={{ animationDelay: '0s' }} />
                                            <div className={`w-2 h-2 rounded-full animate-bounce ${dotsColor}`} style={{ animationDelay: '0.2s' }} />
                                            <div className={`w-2 h-2 rounded-full animate-bounce ${dotsColor}`} style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
