"use client";

import { BookOpen, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl"
      >
        {/* Logo/Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <BookOpen className="w-24 h-24 text-primary" strokeWidth={1.5} />
            <Sparkles className="w-8 h-8 text-warning absolute -top-2 -right-2 animate-pulse" />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
          My Edu-Tale
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-foreground/80 mb-4">
          AI가 만들어주는 나만의 수학 동화
        </p>
        <p className="text-base md:text-lg text-foreground/60 mb-12 max-w-2xl mx-auto">
          어린이의 감정과 성향에 맞춘 특별한 수학 이야기가 시작됩니다.
          <br />
          재미있는 모험을 통해 수학을 배워보세요!
        </p>

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/login")}
          className="text-xl px-12 py-6"
        >
          시작하기 🚀
        </Button>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 rounded-2xl p-6 shadow-lg"
          >
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2">감정 맞춤형</h3>
            <p className="text-sm text-foreground/70">
              오늘의 기분에 맞는 이야기
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 rounded-2xl p-6 shadow-lg"
          >
            <div className="text-4xl mb-3">🧮</div>
            <h3 className="font-bold text-lg mb-2">재미있는 수학</h3>
            <p className="text-sm text-foreground/70">
              게임처럼 즐기는 학습
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 rounded-2xl p-6 shadow-lg"
          >
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-bold text-lg mb-2">AI 친구</h3>
            <p className="text-sm text-foreground/70">
              함께 성장하는 학습 동반자
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
