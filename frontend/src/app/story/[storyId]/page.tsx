"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FullscreenToggle } from "@/components/ui/FullscreenToggle";
import { PageFlip } from "@/components/StoryPlayer/PageFlip";
import { StoryViewer } from "@/components/StoryPlayer/StoryViewer";
import { AudioPlayer } from "@/components/StoryPlayer/AudioPlayer";
import { QuizModal } from "@/components/StoryPlayer/QuizModal";
import { useUserStore } from "@/store/userStore";
import { getMockStory } from "@/lib/mockData";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function StoryPage({
    params,
}: {
    params: Promise<{ storyId: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const childInfo = useUserStore((state) => state.childInfo);
    const gameSession = useUserStore((state) => state.gameSession);
    const markStageComplete = useUserStore((state) => state.markStageComplete);

    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showStageClear, setShowStageClear] = useState(false);

    // Fetch story data
    const story = getMockStory(resolvedParams.storyId, childInfo, gameSession);
    const currentScene = story.scenes[currentSceneIndex];
    const isLastScene = currentSceneIndex === story.scenes.length - 1;
    const isFirstScene = currentSceneIndex === 0;

    // Check if current scene has a quiz
    useEffect(() => {
        if (currentScene.quiz && !quizCompleted) {
            // Show quiz after a short delay (simulating audio completion)
            const timer = setTimeout(() => {
                setShowQuiz(true);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setShowQuiz(false);
        }
    }, [currentSceneIndex, currentScene.quiz, quizCompleted]);

    const handleNext = () => {
        if (currentScene.quiz && !quizCompleted) {
            alert("퀴즈를 먼저 완료해주세요!");
            return;
        }

        if (isLastScene) {
            // Show stage clear screen
            setShowStageClear(true);
            if (gameSession?.stage) {
                markStageComplete(gameSession.stage);
            }
        } else {
            setDirection(1);
            setCurrentSceneIndex((prev) => prev + 1);
            setQuizCompleted(false);
        }
    };

    const handlePrevious = () => {
        if (!isFirstScene) {
            setDirection(-1);
            setCurrentSceneIndex((prev) => prev - 1);
            setQuizCompleted(false);
        }
    };

    const handleQuizComplete = () => {
        setQuizCompleted(true);
        setShowQuiz(false);
    };

    const handleBackToMap = () => {
        router.push("/stage-select");
    };

    if (showStageClear) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center max-w-2xl"
                >
                    <div className="text-8xl mb-6 animate-bounce-gentle">🎉</div>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
                        스테이지 완료!
                    </h1>
                    <h2 className="text-3xl font-bold mb-4">{story.title}</h2>
                    <p className="text-lg text-foreground/70 mb-8">{story.summary}</p>

                    <div className="flex gap-4 justify-center">
                        <Button variant="ghost" size="lg" onClick={handleBackToMap}>
                            <Home className="mr-2" size={20} />
                            맵으로 돌아가기
                        </Button>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => {
                                setCurrentSceneIndex(0);
                                setShowStageClear(false);
                                setQuizCompleted(false);
                            }}
                        >
                            다시 보기
                        </Button>
                    </div>

                    {/* Confetti */}
                    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                                    y: -20,
                                    rotate: 0,
                                }}
                                animate={{
                                    y: typeof window !== "undefined" ? window.innerHeight + 100 : 1000,
                                    rotate: 720,
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    ease: "linear",
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                                className="absolute w-3 h-3 rounded-sm"
                                style={{
                                    backgroundColor: [
                                        "#FEF9C3",
                                        "#E0F2FE",
                                        "#A7F3D0",
                                        "#FBCFE8",
                                        "#DDD6FE",
                                    ][i % 5],
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <FullscreenToggle />

            <div className="max-w-5xl mx-auto">
                {/* Story Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{story.title}</h1>
                    <p className="text-foreground/60">{story.summary}</p>
                </motion.div>

                {/* Story Content with Page Flip */}
                <PageFlip direction={direction} sceneKey={currentSceneIndex}>
                    <div className="space-y-6">
                        <StoryViewer
                            scene={currentScene}
                            currentSceneIndex={currentSceneIndex}
                            totalScenes={story.scenes.length}
                        />

                        {/* Audio Player */}
                        {currentScene.audio_url && (
                            <AudioPlayer
                                audioUrl={currentScene.audio_url}
                                autoPlay={true}
                            />
                        )}
                    </div>
                </PageFlip>

                {/* Navigation Controls */}
                <div className="flex justify-between items-center mt-8 gap-4">
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={handlePrevious}
                        disabled={isFirstScene}
                        className="flex-1 max-w-xs"
                    >
                        <ChevronLeft className="mr-2" size={20} />
                        이전
                    </Button>

                    <Button variant="ghost" size="md" onClick={handleBackToMap}>
                        <Home size={20} />
                    </Button>

                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleNext}
                        disabled={currentScene.quiz !== null && !quizCompleted}
                        className="flex-1 max-w-xs"
                    >
                        {isLastScene ? "완료" : "다음"}
                        <ChevronRight className="ml-2" size={20} />
                    </Button>
                </div>
            </div>

            {/* Quiz Modal */}
            {currentScene.quiz && (
                <QuizModal
                    quiz={currentScene.quiz}
                    isOpen={showQuiz}
                    onComplete={handleQuizComplete}
                />
            )}
        </div>
    );
}
