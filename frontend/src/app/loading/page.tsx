"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { generateStory, ApiError } from "@/services/apiService";
import type { GenerateStoryResponse } from "@/services/apiService";

const loadingMessages = [
    "AI가 그림 그리는 중...",
    "색칠하는 중...",
    "이야기를 만드는 중...",
    "주인공을 그리는 중...",
    "배경을 꾸미는 중...",
    "마법을 부리는 중...",
];

export default function LoadingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const childInfo = useUserStore((state) => state.childInfo);
    const setCurrentStoryId = useUserStore((state) => state.setCurrentStoryId);

    // Get parameters from URL
    const emotion = searchParams.get("emotion");
    const stage = searchParams.get("stage");

    useEffect(() => {
        // Rotate messages every 3 seconds
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 3000);

        // Increment progress
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + 3; // Slower for backend generation (~20 seconds)
            });
        }, 600);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, []);

    useEffect(() => {
        // Generate story on mount
        if (!emotion || !stage || !childInfo || isGenerating) {
            return;
        }

        const generateStoryFromBackend = async () => {
            setIsGenerating(true);
            setError(null);

            try {
                // Map stage code (e.g., "1-1-1" to "MATH-001")
                const stageCode = mapStageToCode(stage);

                const response: GenerateStoryResponse = await generateStory(
                    {
                        child_name: childInfo.child_name,
                        age: parseInt(childInfo.age, 10),
                        personality: childInfo.personality || "활발함",
                        emotion: emotion,
                        stage_code: stageCode,
                    },
                    (progressMessage) => {
                        // Update progress message from backend
                        console.log("Progress:", progressMessage);
                    }
                );

                // Save story ID
                setCurrentStoryId(response.story_id);

                // Set progress to 100%
                setProgress(100);

                // Navigate to story page
                setTimeout(() => {
                    router.push(`/story/${response.story_id}`);
                }, 500);

            } catch (err) {
                console.error("Story generation error:", err);

                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError("스토리 생성 중 오류가 발생했습니다.");
                }

                setProgress(0);
            } finally {
                setIsGenerating(false);
            }
        };

        generateStoryFromBackend();
    }, [emotion, stage, childInfo, router, setCurrentStoryId, isGenerating]);

    // Map stage code from frontend format to backend format
    const mapStageToCode = (stageStr: string): string => {
        // Map "1-1-1" to "MATH-001", "1-1-2" to "MATH-002", etc.
        // This is a simple mapping, adjust based on your actual stage structure
        const parts = stageStr.split("-");
        if (parts.length === 3) {
            const num = parseInt(parts[2], 10);
            return `MATH-${String(num).padStart(3, "0")}`;
        }
        return "MATH-001"; // Default
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* Mesh Gradient Background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: "#FFE5D9",
                    backgroundImage: `
                        radial-gradient(at 0% 0%, #B4E4FF 0px, transparent 50%),
                        radial-gradient(at 100% 0%, #E5C1FF 0px, transparent 50%),
                        radial-gradient(at 100% 100%, #FFE5D9 0px, transparent 50%),
                        radial-gradient(at 0% 100%, #B4E4FF 0px, transparent 50%)
                    `,
                }}
            />

            {/* Top Header */}
            <header className="fixed top-0 left-0 w-full flex items-center justify-between px-10 py-6 z-10">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-white/40 backdrop-blur-md rounded-lg flex items-center justify-center text-primary shadow-sm">
                        <span className="text-2xl">📖</span>
                    </div>
                    <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-tight">
                        Story AI
                    </h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="bg-white/40 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/20">
                        <span className={`size-2 rounded-full ${error ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`} />
                        <span className="text-xs font-semibold text-[#111418]/70 uppercase tracking-widest">
                            {error ? "Error" : "Processing"}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Loading Content */}
            <main className="flex flex-col items-center justify-center px-4 text-center max-w-2xl w-full z-10">
                {error ? (
                    /* Error State */
                    <div className="space-y-6">
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-[#111418]">
                            오류가 발생했습니다
                        </h2>
                        <p className="text-[#111418]/70 text-sm max-w-md">
                            {error}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleRetry}
                                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                다시 시도
                            </button>
                            <button
                                onClick={handleGoBack}
                                className="px-6 py-3 bg-white/40 backdrop-blur-md text-[#111418] rounded-lg font-semibold hover:bg-white/60 transition-colors"
                            >
                                뒤로 가기
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Loading State */
                    <>
                        {/* Central Animation Container */}
                        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12 flex items-center justify-center">
                            {/* Glowing Background Ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-white/30 border-t-primary/40 animate-spin shadow-[0_0_40px_rgba(19,127,236,0.15)]" />

                            {/* Floating Art Tools */}
                            <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-white/60 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                    🎨
                                </div>
                            </div>
                            <div className="absolute inset-0 animate-[spin_15s_linear_infinite_reverse]">
                                <div className="absolute top-1/2 right-0 translate-x-4 -translate-y-1/2 bg-white/60 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                    ✏️
                                </div>
                            </div>
                            <div className="absolute inset-0 animate-[spin_18s_linear_infinite]">
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-white/60 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                    🖌️
                                </div>
                            </div>
                            <div className="absolute inset-0 animate-[spin_22s_linear_infinite_reverse]">
                                <div className="absolute top-1/2 left-0 -translate-x-4 -translate-y-1/2 bg-white/60 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                    📐
                                </div>
                            </div>

                            {/* Center Icon */}
                            <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-full size-24 md:size-32 flex items-center justify-center shadow-xl">
                                <span className="text-5xl md:text-6xl">🤖</span>
                            </div>
                        </div>

                        {/* Loading Message */}
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#111418] mb-4 animate-pulse">
                            {loadingMessages[messageIndex]}
                        </h1>

                        <p className="text-[#111418]/60 text-sm md:text-base mb-10 max-w-md">
                            AI가 {childInfo?.child_name}님을 위한 특별한 동화를 만들고 있어요
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full max-w-md">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-[#111418]/50 uppercase tracking-widest">
                                    Progress
                                </span>
                                <span className="text-sm font-bold text-[#111418]">
                                    {Math.min(progress, 100)}%
                                </span>
                            </div>
                            <div className="h-2 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 ease-out rounded-full"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
