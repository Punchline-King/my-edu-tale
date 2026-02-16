"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface PageFlipProps {
    children: React.ReactNode;
    direction: number; // 1 for next, -1 for previous
    sceneKey: number | string;
}

const pageVariants = {
    enter: (direction: number) => ({
        rotateY: direction > 0 ? 90 : -90,
        opacity: 0,
        scale: 0.9,
    }),
    center: {
        rotateY: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        rotateY: direction > 0 ? -90 : 90,
        opacity: 0,
        scale: 0.9,
    }),
};

export function PageFlip({ children, direction, sceneKey }: PageFlipProps) {
    return (
        <div className="perspective-1000 preserve-3d">
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={sceneKey}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        rotateY: { duration: 0.6, ease: "easeInOut" },
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.4 },
                    }}
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
