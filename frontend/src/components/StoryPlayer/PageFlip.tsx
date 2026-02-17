"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface BookPageFlipProps {
    children: ReactNode[];
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function BookPageFlip({ children, currentPage, onPageChange }: BookPageFlipProps) {
    const [direction, setDirection] = useState(1);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        setDirection(currentPage > (currentPage - 1) ? 1 : -1);
    }, [currentPage]);

    // 3D book flip animation with page curl effect
    const pageVariants = {
        enter: (direction: number) => ({
            rotateY: direction > 0 ? 180 : -180,
            opacity: 0,
            x: direction > 0 ? "100%" : "-100%",
            scale: 0.8,
            transformOrigin: direction > 0 ? "left center" : "right center",
        }),
        center: {
            rotateY: 0,
            opacity: 1,
            x: 0,
            scale: 1,
        },
        exit: (direction: number) => ({
            rotateY: direction > 0 ? -180 : 180,
            opacity: 0,
            x: direction > 0 ? "-100%" : "100%",
            scale: 0.8,
            transformOrigin: direction > 0 ? "right center" : "left center",
        }),
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto perspective-[2000px]">
            {/* Book Container */}
            <div className="relative bg-gradient-to-br from-amber-50 to-stone-100 rounded-2xl shadow-2xl p-8 md:p-12 preserve-3d">
                {/* Page Container */}
                <div className="relative min-h-[600px] overflow-hidden rounded-xl bg-white">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentPage}
                            custom={direction}
                            variants={pageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                rotateY: {
                                    duration: 0.8,
                                    ease: [0.32, 0.72, 0, 1]
                                },
                                opacity: { duration: 0.4 },
                                x: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
                                scale: { duration: 0.8 },
                            }}
                            onAnimationStart={() => setIsFlipping(true)}
                            onAnimationComplete={() => setIsFlipping(false)}
                            style={{
                                transformStyle: "preserve-3d",
                                backfaceVisibility: "hidden",
                            }}
                            className="absolute inset-0 p-6 md:p-8"
                        >
                            {children[currentPage]}
                        </motion.div>
                    </AnimatePresence>

                    {/* Page Shadow Effect */}
                    {isFlipping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none"
                        />
                    )}
                </div>

                {/* Book Spine Shadow */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-stone-400/50 to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-stone-400/50 to-transparent" />

                {/* Page Number Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 font-medium">
                    {currentPage + 1} / {children.length}
                </div>
            </div>

            {/* Book Stand Effect */}
            <div className="absolute -bottom-2 left-8 right-8 h-4 bg-gradient-to-b from-stone-300/50 to-transparent rounded-b-3xl blur-sm" />
        </div>
    );
}
