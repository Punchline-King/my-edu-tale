"use client";

import Image from "next/image";
import type { Scene } from "@/lib/types";

interface StoryViewerProps {
    scene: Scene;
    currentSceneIndex: number;
    totalScenes: number;
}

export function StoryViewer({
    scene,
    currentSceneIndex,
    totalScenes,
}: StoryViewerProps) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Image Container - 16:9 Aspect Ratio */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl mb-6 bg-gray-100">
                <Image
                    src={scene.image_url}
                    alt={`Scene ${scene.scene_no}`}
                    fill
                    className="object-cover"
                    priority
                    unoptimized // For demo with external images
                />

                {/* Scene Number Indicator */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {currentSceneIndex + 1} / {totalScenes}
                </div>
            </div>

            {/* Text Subtitle Box */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <p className="text-lg md:text-xl text-center leading-relaxed text-foreground">
                    {scene.text}
                </p>
            </div>
        </div>
    );
}
