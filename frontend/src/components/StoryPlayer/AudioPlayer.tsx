"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
    audioUrl: string;
    onEnded?: () => void;
    autoPlay?: boolean;
    autoPlayToken?: string | number;
}

export function AudioPlayer({
    audioUrl,
    onEnded,
    autoPlay = true,
    autoPlayToken,
}: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hasEnded, setHasEnded] = useState(false);
    const lastAutoPlayTokenRef = useRef<string | number | undefined>(undefined);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Auto-play exactly once per token (prevents duplicate auto-reads)
        if (autoPlay && autoPlayToken !== undefined && lastAutoPlayTokenRef.current !== autoPlayToken) {
            lastAutoPlayTokenRef.current = autoPlayToken;
            audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setHasEnded(false);
                    })
                    .catch((error) => {
                        console.warn("Auto-play prevented:", error);
                        // Browser blocked auto-play
                    });
            }
        }

        return () => {
            audio.pause();
        };
    }, [audioUrl, autoPlay, autoPlayToken]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            // Restart only after the audio has fully ended
            if (hasEnded || (audio.duration && audio.currentTime >= audio.duration - 0.05)) {
                audio.currentTime = 0;
                setProgress(0);
            }
            audio.play().then(() => setIsPlaying(true));
        }
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = !audio.muted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="w-full mx-auto">
            <audio
                ref={audioRef}
                src={audioUrl}
                preload="auto"
                onLoadedData={() => {
                    setIsPlaying(false);
                    setProgress(0);
                    setHasEnded(false);
                }}
                onTimeUpdate={(e) => {
                    const audio = e.currentTarget;
                    if (audio.duration) {
                        setProgress((audio.currentTime / audio.duration) * 100);
                    }
                    if (hasEnded && audio.currentTime < audio.duration) {
                        setHasEnded(false);
                    }
                }}
                onEnded={() => {
                    setIsPlaying(false);
                    setProgress(100);
                    setHasEnded(true);
                    onEnded?.();
                }}
            />

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                {/* Controls */}
                <div className="flex items-center gap-4 mb-3">
                    {/* Play/Pause Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="bg-primary hover:bg-blue-500 text-white p-3 rounded-full transition-colors"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </motion.button>

                    {/* Progress Bar */}
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="bg-primary h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Mute Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMute}
                        className="text-foreground hover:text-primary transition-colors"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </motion.button>
                </div>

                {/* Status Text */}
                <p className="text-xs text-center text-foreground/60">
                    {isPlaying ? "재생 중..." : "일시 정지"}
                </p>
            </div>
        </div>
    );
}
