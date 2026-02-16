"use client";

import { Maximize, Minimize } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./Button";

export function FullscreenToggle() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        // Check if Fullscreen API is supported
        if (!document.fullscreenEnabled) {
            setIsSupported(false);
        }

        // Listen for fullscreen changes
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
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
        <div className="fixed bottom-6 right-6 z-30">
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
