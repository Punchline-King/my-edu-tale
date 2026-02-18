"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-pastel-mesh overflow-hidden relative">

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl opacity-60"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 text-6xl opacity-60"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ x: [0, 30, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 text-4xl opacity-40"
        >
          ➕
        </motion.div>
        <motion.div
          animate={{ x: [0, -30, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/4 text-4xl opacity-40"
        >
          ➗
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl z-10"
      >
        {/* Hero Section */}
        <div className="mb-8 relative inline-block">
          {/* Robot Mascot */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[120px] md:text-[180px] drop-shadow-2xl relative z-10"
          >
            🤖
          </motion.div>

          {/* Glow Effect behind robot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/50 blur-3xl rounded-full" />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-gradient-primary tracking-tight shrink-0">
          My Edu-Tale
        </h1>

        {/* Subtitle */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-10 max-w-2xl mx-auto backdrop-blur-xl border-white/40">
          <p className="text-xl md:text-2xl text-foreground/80 font-bold mb-2">
            AI 친구와 함께 떠나는 수학 모험!
          </p>
          <p className="text-base md:text-lg text-foreground/60">
            나만의 특별한 이야기를 만들고 재미있게 수학을 배워봐요.
          </p>
        </div>

        {/* CTA Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/login")}
            className="text-2xl md:text-3xl px-16 py-10 md:px-20 md:py-12 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary border-none"
          >
            모험 시작하기 🚀
          </Button>
        </motion.div>

        {/* Feature Icons (Small) */}
        <div className="flex justify-center gap-8 mt-16 opacity-80">
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl bg-white/40 p-3 rounded-full">🎨</span>
            <span className="text-xs font-semibold text-foreground/60">감정 맞춤</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl bg-white/40 p-3 rounded-full">📚</span>
            <span className="text-xs font-semibold text-foreground/60">나만의 동화</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl bg-white/40 p-3 rounded-full">🧩</span>
            <span className="text-xs font-semibold text-foreground/60">수학 퀴즈</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
