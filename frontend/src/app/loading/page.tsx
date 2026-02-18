"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Edit, Paintbrush, Palette, Sparkles } from "lucide-react";

export default function LoadingPage() {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        "AI가 그림 그리는 중...",
        "특별한 이야기를 만들고 있어요...",
        "재미있는 퀴즈를 준비하고 있어요...",
        "거의 다 되었어요! ✨"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3000);

        return () => clearInterval(messageInterval);
    }, []);

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-pastel-mesh overflow-hidden font-sans text-[#111418]">
            {/* Top Navigation */}
            <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-10 py-6 z-10">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-white/40 backdrop-blur-md rounded-xl flex items-center justify-center text-primary shadow-sm border border-white/20">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight">Story AI</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="bg-white/40 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/20 shadow-sm">
                        <span className="size-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-[#111418]/70 uppercase tracking-widest">Processing</span>
                    </div>
                </div>
            </header>

            {/* Main Loading Content */}
            <main className="flex flex-col items-center justify-center px-4 text-center w-full z-10">
                {/* Central Animation Container */}
                <div className="relative size-80 mb-12 flex items-center justify-center">
                    {/* Glowing Background Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 border-t-[#137fec]/40 animate-[spin_3s_linear_infinite] shadow-[0_0_40px_rgba(19,127,236,0.15)]"></div>

                    {/* Inner Rotating Tools Layer */}
                    <div className="relative size-full flex items-center justify-center animate-float">
                        {/* Art Tool 1: Pencils (Top Left) - Rounded Square */}
                        <div className="absolute -top-4 -left-4 size-32 bg-pastel-peach rounded-2xl rotate-[-15deg] shadow-xl flex items-center justify-center border-4 border-white transform transition-transform hover:scale-105">
                            <Edit size={48} className="text-orange-400/80" />
                        </div>

                        {/* Art Tool 2: Paintbrush (Center Focus) - Circle */}
                        <div className="z-20 size-40 bg-white rounded-full shadow-2xl flex items-center justify-center border-8 border-white group relative">
                            <div className="size-full rounded-full bg-gradient-to-br from-pastel-blue via-white to-pastel-purple flex items-center justify-center overflow-hidden">
                                <div className="flex flex-col items-center gap-2 transform group-hover:scale-110 transition-transform duration-500">
                                    <Paintbrush size={72} className="text-[#137fec]" />
                                    <div className="flex gap-1 mt-2">
                                        <div className="size-1.5 bg-pastel-peach rounded-full animate-bounce"></div>
                                        <div className="size-1.5 bg-pastel-blue rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="size-1.5 bg-pastel-purple rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Art Tool 3: Palette (Bottom Right) - Rounded Squircle */}
                        <div className="absolute -bottom-6 -right-6 size-32 bg-pastel-purple rounded-3xl rotate-[20deg] shadow-xl flex items-center justify-center border-4 border-white transform transition-transform hover:scale-105">
                            <Palette size={48} className="text-purple-500/80" />
                        </div>

                        {/* Stardust Particles (Floating Orbs) */}
                        <div className="absolute top-0 right-10 size-4 bg-white rounded-full blur-[1px] animate-pulse shadow-glow-white"></div>
                        <div className="absolute bottom-10 left-0 size-3 bg-white/80 rounded-full blur-[1px] animate-pulse [animation-delay:0.5s] shadow-glow-white"></div>
                        <div className="absolute top-20 -right-5 size-2 bg-white/60 rounded-full blur-[1px] animate-pulse [animation-delay:1s] shadow-glow-white"></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 relative z-10 w-full flex flex-col items-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight px-4 leading-[1.2] text-gray-900 drop-shadow-sm min-h-[60px] transition-all duration-300">
                        {messages[messageIndex]}
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl font-medium px-4">
                        잠시만 기다려주세요 ✨
                    </p>

                    {/* Progress Bar Section */}
                    <div className="mt-12 w-full max-w-sm mx-auto space-y-3">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-[#137fec] font-bold text-xs md:text-sm tracking-wider">CREATING MAGIC</span>
                            <span className="text-gray-800 font-bold text-xs md:text-sm">{progress}%</span>
                        </div>
                        <div className="h-4 w-full bg-white/40 backdrop-blur-sm rounded-full overflow-hidden p-1 border border-white/30 shadow-inner">
                            <div
                                className="h-full bg-[#137fec] rounded-full shadow-[0_0_10px_rgba(19,127,236,0.3)] transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Almost ready to show you</p>
                    </div>
                </div>
            </main>

            {/* Footer Caption */}
            <footer className="fixed bottom-8 md:bottom-12 w-full text-center px-6 z-10 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-lg px-6 py-3 rounded-full border border-white/40 shadow-lg">
                    <Sparkles size={20} className="text-primary" />
                    <p className="text-gray-800 font-semibold text-sm md:text-base">
                        특별한 이야기를 만들고 있어요 🎨
                    </p>
                </div>
            </footer>

            {/* Background Decorative Elements */}
            <div className="fixed top-1/4 -left-20 size-80 bg-pastel-blue/30 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-1/4 -right-20 size-80 bg-pastel-purple/30 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
    );
}
