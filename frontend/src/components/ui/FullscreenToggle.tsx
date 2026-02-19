"use client";

import { Maximize, Minimize } from "lucide-react";
import { RefObject, useState, useEffect } from "react";
import { Button } from "./Button";

interface FullscreenToggleProps {
    targetRef?: RefObject<HTMLElement | null>;
    className?: string;
}

export function FullscreenToggle({ targetRef, className = "fixed bottom-6 right-6 z-30" }: FullscreenToggleProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const isSupported = typeof document === "undefined" ? true : document.fullscreenEnabled;

    useEffect(() => {
        // Listen for fullscreen changes
        const handleFullscreenChange = () => {
            const fullscreenEl = document.fullscreenElement;
            if (!fullscreenEl) {
                setIsFullscreen(false);
                return;
            }

            if (targetRef?.current) {
                setIsFullscreen(fullscreenEl === targetRef.current);
                return;
            }

            setIsFullscreen(true);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [targetRef]);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                const target = targetRef?.current ?? document.documentElement;
                await target.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error("Fullscreen error:", error);
            alert(
                "전체 화면 모드를 사용할 수 없습니다. iOS Safari에서는 지원되지 않습니다."
            );
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <div className={className}>
            <Button
                variant="ghost"
                size="md"
                onClick={toggleFullscreen}
                className="!rounded-full !p-4 shadow-xl"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </Button>
        </div>
    );
}
