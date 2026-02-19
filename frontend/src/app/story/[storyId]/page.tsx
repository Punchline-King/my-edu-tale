"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FullscreenToggle } from "@/components/ui/FullscreenToggle";
import { PageFlipBook, Page, PageFlipBookHandle } from "@/components/StoryPlayer/PageFlip";
import { StoryViewer } from "@/components/StoryPlayer/StoryViewer";
import { AudioPlayer } from "@/components/StoryPlayer/AudioPlayer";
import { QuizModal } from "@/components/StoryPlayer/QuizModal";
import { useUserStore } from "@/store/userStore";
import { getMockStory } from "@/lib/mockData";
import { ChevronLeft, ChevronRight, Home, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

// Helper function to split text naturally at sentence boundaries
function splitTextIntoHalves(text: string): [string, string] {
    if (!text) return ["", ""];

    const mid = Math.floor(text.length / 2);
    // Search nicely for sentence ending (.!?) near the middle (within 30% range)
    const searchRange = Math.floor(text.length * 0.3);
    const startSearch = Math.max(0, mid - searchRange);
    const endSearch = Math.min(text.length, mid + searchRange);

    const substring = text.substring(startSearch, endSearch);

    // Regex for sentence endings followed by space or end of string
    // Matches: . ! ? following by space
    const matches = Array.from(substring.matchAll(/([.!?])\s/g));

    let splitIndex = mid;

    if (matches.length > 0) {
        // Find the match closest to the relative middle
        const relativeMid = mid - startSearch;
        const bestMatch = matches.reduce((prev, curr) => {
            return Math.abs(curr.index! - relativeMid) < Math.abs(prev.index! - relativeMid) ? curr : prev;
        });
        // split after the punctuation (index + 1 because group 1 is the punctuation)
        splitIndex = startSearch + bestMatch.index! + 1;
    } else {
        // Fallback to nearest space
        const spaceMatches = Array.from(substring.matchAll(/\s/g));
        if (spaceMatches.length > 0) {
            const relativeMid = mid - startSearch;
            const bestMatch = spaceMatches.reduce((prev, curr) => {
                return Math.abs(curr.index! - relativeMid) < Math.abs(prev.index! - relativeMid) ? curr : prev;
            });
            splitIndex = startSearch + bestMatch.index!;
        }
    }

    return [text.substring(0, splitIndex).trim(), text.substring(splitIndex).trim()];
}

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
    const bookRef = useRef<PageFlipBookHandle>(null);
    const bookFullscreenRef = useRef<HTMLDivElement>(null);

    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showStageClear, setShowStageClear] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [isMobilePortrait, setIsMobilePortrait] = useState(false);
    const [mobileScale, setMobileScale] = useState(1);
    const [bookScale, setBookScale] = useState(1);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isNarrationDone, setIsNarrationDone] = useState(false);
    const [isBookFullscreen, setIsBookFullscreen] = useState(false);
    const [fullscreenReplayToken, setFullscreenReplayToken] = useState(0);

    // State for story data
    const [story, setStory] = useState<any>(null); // Using any temporarily to avoid strict type mismatch during dev, or import types
    const [loading, setLoading] = useState(true);

    const BOOK_PAGE_WIDTH = 896;
    const BOOK_PAGE_HEIGHT = 1024;

    // Force landscape-style viewing on phones
    useEffect(() => {
        const checkOrientation = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const shortSide = Math.min(width, height);
            const longSide = Math.max(width, height);
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);
            // Broader phone detection so larger phones/foldables are still treated as mobile
            const isMobile = (isTouch && shortSide <= 900 && longSide <= 1600) || isMobileUA;
            const isPortrait = height > width;

            setIsMobileDevice(isMobile);
            setIsMobilePortrait(isMobile && isPortrait);

            if (isMobile) {
                // Fit the whole open book inside the visible device viewport (landscape basis)
                const landscapeViewportWidth = Math.max(width, height);
                const landscapeViewportHeight = Math.min(width, height);
                const horizontalPadding = 12;
                const verticalPadding = 12;
                const spreadWidth = BOOK_PAGE_WIDTH * 2;
                const scaleByWidth = (landscapeViewportWidth - horizontalPadding) / spreadWidth;
                const scaleByHeight = (landscapeViewportHeight - verticalPadding) / BOOK_PAGE_HEIGHT;
                setMobileScale(Math.max(0.3, Math.min(scaleByWidth, scaleByHeight)));
            } else {
                setMobileScale(1);
            }
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    // Fetch story data
    useEffect(() => {
        async function loadStory() {
            try {
                // Import dynamically to avoid server-side issues if any
                const { fetchStory } = await import("@/services/apiService");
                const data = await fetchStory(resolvedParams.storyId);
                setStory(data);
            } catch (error) {
                console.error("Failed to load story:", error);
                // Fallback to mock if fetch fails? Or just show error?
                // For now, let's fallback to mock for safety during dev/demo if backend is down
                const { getMockStory } = await import("@/lib/mockData");
                setStory(getMockStory(resolvedParams.storyId, childInfo, gameSession));
            } finally {
                setLoading(false);
            }
        }
        loadStory();
    }, [resolvedParams.storyId, childInfo, gameSession]);

    // Safe access to current scene
    const currentScene = story?.scenes?.[currentSceneIndex];
    const isLastScene = story?.scenes ? currentSceneIndex === story.scenes.length - 1 : false;
    const isFirstScene = currentSceneIndex === 0;
    const isSceneLastPage = currentPageIndex % 2 === 1;
    const readDelayMs = Math.min(
        14000,
        Math.max(4500, Math.round(((currentScene?.text?.length || 0) / 14) * 1000))
    );
    const scaledPageWidth = Math.round(BOOK_PAGE_WIDTH * bookScale);
    const scaledPageHeight = Math.round(BOOK_PAGE_HEIGHT * bookScale);
    const pageFlipRenderKey = `${isBookFullscreen ? "fs" : "normal"}-${scaledPageWidth}x${scaledPageHeight}`;
    const prevFullscreenRef = useRef(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsBookFullscreen(document.fullscreenElement === bookFullscreenRef.current);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    useEffect(() => {
        // Replay current scene audio once when entering fullscreen
        if (isBookFullscreen && !prevFullscreenRef.current) {
            setFullscreenReplayToken((prev) => prev + 1);
        }
        prevFullscreenRef.current = isBookFullscreen;
    }, [isBookFullscreen]);

    // Keep the open-book size within one screen while preserving aspect ratio
    useEffect(() => {
        const calculateBookScale = () => {
            if (isMobileDevice) return;
            const spreadWidth = BOOK_PAGE_WIDTH * 2;
            const horizontalPadding = isBookFullscreen ? 8 : 80;
            const verticalReserved = isBookFullscreen ? 8 : currentScene?.audio_url ? 320 : 260;
            const availableWidth = window.innerWidth - horizontalPadding;
            const availableHeight = window.innerHeight - verticalReserved;
            const scaleByWidth = availableWidth / spreadWidth;
            const scaleByHeight = availableHeight / BOOK_PAGE_HEIGHT;

            // Keep aspect ratio and scale until either width or height touches viewport bounds
            const fitScale = Math.min(scaleByWidth, scaleByHeight);
            const nextScale = isBookFullscreen ? fitScale : Math.min(1, fitScale);
            setBookScale(Math.max(0.45, nextScale));
        };

        calculateBookScale();
        window.addEventListener("resize", calculateBookScale);
        return () => window.removeEventListener("resize", calculateBookScale);
    }, [currentScene?.audio_url, isMobileDevice, isBookFullscreen]);

    // Reset quiz timing state when scene changes
    useEffect(() => {
        if (!currentScene) return;
        setShowQuiz(false);
        setQuizCompleted(false);
        setIsNarrationDone(false);
    }, [currentSceneIndex, currentScene]);

    // If there is no narration audio, wait long enough for reading
    useEffect(() => {
        if (!currentScene?.quiz || currentScene.audio_url || quizCompleted || !isSceneLastPage) return;

        const timer = setTimeout(() => {
            setIsNarrationDone(true);
        }, readDelayMs);

        return () => clearTimeout(timer);
    }, [currentScene, quizCompleted, isSceneLastPage, readDelayMs]);

    // Show quiz only after the scene is fully read/listened
    useEffect(() => {
        if (!currentScene?.quiz || quizCompleted) {
            setShowQuiz(false);
            return;
        }

        if (currentScene.audio_url && isNarrationDone) {
            setShowQuiz(true);
            return;
        }

        if (!currentScene.audio_url && isSceneLastPage && isNarrationDone) {
            setShowQuiz(true);
        } else {
            setShowQuiz(false);
        }
    }, [currentScene, quizCompleted, isSceneLastPage, isNarrationDone]);

    if (loading || !story || !currentScene) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-bounce text-4xl">📚</div>
            </div>
        );
    }

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
            bookRef.current?.flipNext();
        }
    };

    const handlePrevious = () => {
        if (!isFirstScene) {
            bookRef.current?.flipPrev();
        }
    };



    const handleQuizComplete = () => {
        setQuizCompleted(true);
        setShowQuiz(false);

        if (isLastScene) {
            setShowStageClear(true);
            if (gameSession?.stage) {
                markStageComplete(gameSession.stage);
            }
        }
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
                    className="text-center max-w-2xl glass-card p-12 rounded-[3rem] shadow-2xl relative bg-white/40 backdrop-blur-xl border border-white/60"
                >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[100px] drop-shadow-lg animate-bounce-gentle">🎉</div>
                    <h1 className="text-5xl font-extrabold mb-4 mt-12 text-gradient-primary">
                        스테이지 완료!
                    </h1>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">{story.title}</h2>
                    <p className="text-lg text-gray-600 mb-10">{story.summary}</p>

                    <div className="flex gap-4 justify-center">
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={handleBackToMap}
                            className="bg-white/50 hover:bg-white/70 rounded-full max-[379px]:!px-4 max-[379px]:!py-4"
                            aria-label="맵으로 돌아가기"
                        >
                            <span className="inline-flex items-center gap-2">
                                <Home size={20} />
                                <span className="hidden min-[380px]:inline">맵으로 돌아가기</span>
                            </span>
                        </Button>
                        <Button
                            variant="primary"
                            size="lg"
                            className="rounded-full shadow-lg bg-gradient-to-r from-blue-400 to-purple-400 border-none max-[379px]:!px-4 max-[379px]:!py-4"
                            aria-label="다시 보기"
                            onClick={() => {
                                setCurrentPageIndex(0);
                                setCurrentSceneIndex(0);
                                setShowStageClear(false);
                                setQuizCompleted(false);
                                setShowQuiz(false);
                                setIsNarrationDone(false);
                            }}
                        >
                            <span className="inline-flex items-center gap-2">
                                <RotateCcw size={20} />
                                <span className="hidden min-[380px]:inline">다시 보기</span>
                            </span>
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
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden transition-all duration-300
            ${isMobilePortrait ? 'fixed inset-0 w-[100vh] h-[100vw] rotate-90 origin-top-left translate-x-[100vw] z-50 m-0 p-0 overflow-hidden' : ''}
            ${!isMobilePortrait && isMobileDevice ? 'fixed inset-0 z-50 m-0 p-0 overflow-hidden' : ''}
        `}>
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-24 h-24 bg-yellow-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="absolute top-1/2 right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-1/4 text-5xl opacity-20"
                >
                    ✨
                </motion.div>
            </div>

            <div
                className={`w-full max-w-[1920px] px-2 relative z-10 flex flex-col items-center ${isMobileDevice ? 'h-full justify-center' : ''}`}
            >
                {/* Story Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${isMobileDevice ? "fixed top-2 left-1/2 -translate-x-1/2 z-30 text-center w-full max-w-2xl mb-0" : "text-center mb-8 w-full max-w-2xl"}`}
                >
                    <div className="glass-card py-3 px-8 rounded-full inline-block backdrop-blur-md bg-white/30 border border-white/40 shadow-sm">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">{story.title}</h1>
                    </div>
                </motion.div>

                {/* Story Content with Page Flip */}
                <div
                    ref={bookFullscreenRef}
                    className={`relative ${isMobileDevice ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20" : ""} ${isBookFullscreen ? "fixed inset-0 z-[70] bg-black/20 p-1 md:p-2 flex items-center justify-center" : ""}`}
                >
                    <div
                        style={isMobileDevice && !isBookFullscreen ? { transform: `scale(${mobileScale})`, transformOrigin: "center center" } : {}}
                    >
                        <div className="relative shadow-2xl rounded-lg overflow-hidden border-2 border-white/20">
                            <PageFlipBook
                                key={pageFlipRenderKey}
                                ref={bookRef}
                                onPageChange={(pageIndex) => {
                                    // Each scene has 2 pages, so divide by 2 to get scene index
                                    const sceneIndex = Math.floor(pageIndex / 2);
                                    setCurrentSceneIndex(sceneIndex);
                                    setCurrentPageIndex(pageIndex);
                                }}
                                width={scaledPageWidth}
                                height={scaledPageHeight}
                                usePortrait={false}
                                startPage={currentPageIndex}
                            >
                                {story.scenes.flatMap((scene: any, sceneIndex: number) => {
                                    const [leftText, rightText] = splitTextIntoHalves(scene.text);

                                    return [
                                        // Left Page - Left half of image with text
                                        <Page key={`scene-${sceneIndex}-left`} className="relative overflow-hidden bg-white">
                                            <div className="h-full w-full flex flex-col">

                                            {/* Left half of image - fills entire page */}
                                            {scene.image_url && (
                                                <div className="flex-1 relative overflow-hidden">
                                                    <div
                                                        className="absolute inset-0 bg-cover bg-center"
                                                        style={{
                                                            backgroundImage: `url(${scene.image_url})`,
                                                            backgroundPosition: 'left center',
                                                            backgroundSize: '200% auto',
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Text at bottom - First Half */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 pt-12 min-h-[160px] flex items-end justify-center">
                                                <p className="text-white text-base md:text-lg leading-relaxed text-center font-medium drop-shadow-md pb-4 font-sans">
                                                    {leftText}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Paper texture overlay (subtle) */}
                                        <div className="absolute inset-0 bg-yellow-50 opacity-10 pointer-events-none mix-blend-multiply"></div>
                                        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
                                    </Page>,

                                    // Right Page - Right half of image with text (Audio removed from here)
                                    <Page key={`scene-${sceneIndex}-right`} className="relative overflow-hidden bg-white">
                                        <div className="h-full w-full flex flex-col">
                                            {/* Right half of image - fills entire page */}
                                            {scene.image_url && (
                                                <div className="flex-1 relative overflow-hidden">
                                                    <div
                                                        className="absolute inset-0 bg-cover bg-center"
                                                        style={{
                                                            backgroundImage: `url(${scene.image_url})`,
                                                            backgroundPosition: 'right center',
                                                            backgroundSize: '200% auto',
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Text at bottom - Second Half */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 pt-12 min-h-[160px] flex items-end justify-center">
                                                <p className="text-white text-base md:text-lg leading-relaxed text-center font-medium drop-shadow-md pb-4 font-sans">
                                                    {rightText}
                                                </p>
                                            </div>

                                            {/* Scene Number - Bottom Right */}
                                            <div className="absolute bottom-4 right-4 z-20 text-xs font-bold text-white/80 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                                                {sceneIndex + 1} / {story.scenes.length}
                                            </div>
                                        </div>
                                        {/* Paper texture and spine shadow */}
                                        <div className="absolute inset-0 bg-yellow-50 opacity-10 pointer-events-none mix-blend-multiply"></div>
                                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
                                        </Page>
                                    ]
                                })}
                            </PageFlipBook>
                        </div>
                    </div>

                    <FullscreenToggle
                        targetRef={bookFullscreenRef}
                        className="fixed bottom-6 right-6 z-[90]"
                    />

                    {currentScene.quiz && (
                        <QuizModal
                            quiz={currentScene.quiz}
                            isOpen={showQuiz}
                            onComplete={handleQuizComplete}
                        />
                    )}
                </div>


                {/* Audio Player - Positioned under RIGHT page frame, Wide and Right Aligned */}
                {currentScene.audio_url && (
                    <div className={`${isMobileDevice ? "fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[min(92vw,24rem)]" : "mt-8 w-full max-w-md"}`}>
                        <div className="glass-card p-2 rounded-2xl bg-white/50 backdrop-blur-md border border-white/50 shadow-sm">
                            <AudioPlayer
                                audioUrl={currentScene.audio_url}
                                autoPlay={true}
                                autoPlayToken={`scene-${currentSceneIndex}-fs-${fullscreenReplayToken}`}
                                onEnded={() => setIsNarrationDone(true)}
                            />
                        </div>
                    </div>
                )}


                {/* Navigation removed - use page clicks to navigate */}
            </div>
        </div >
    );
}
