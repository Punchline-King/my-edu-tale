"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import type { Quiz } from "@/lib/types";

interface QuizModalProps {
    quiz: Quiz;
    isOpen: boolean;
    onComplete: () => void;
}

export function QuizModal({ quiz, isOpen, onComplete }: QuizModalProps) {
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
    const [shake, setShake] = useState(false);
    const [confetti, setConfetti] = useState(false);

    // Reset state when quiz changes
    useEffect(() => {
        setUserAnswer("");
        setFeedback(null);
        setShake(false);
        setConfetti(false);
    }, [quiz]);

    const handleSubmit = () => {
        if (!userAnswer.trim()) {
            alert("답을 입력해주세요!");
            return;
        }

        const isCorrect =
            userAnswer.trim().toLowerCase() === quiz.answer.toLowerCase();

        if (isCorrect) {
            setFeedback("correct");
            setConfetti(true);
            // Auto-proceed after showing correct feedback
            setTimeout(() => {
                onComplete();
            }, 2000);
        } else {
            setFeedback("wrong");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const handleContinue = () => {
        onComplete();
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { }} showCloseButton={false}>
            <motion.div
                animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                {/* Quiz Question */}
                <div className="mb-8">
                    <div className="text-5xl mb-4">🧩</div>
                    <h2 className="text-2xl font-bold mb-4">퀴즈 시간! 🎯</h2>
                    <p className="text-lg text-foreground/80 leading-relaxed">
                        {quiz.question}
                    </p>
                </div>

                {/* Answer Input or Feedback */}
                {feedback === null ? (
                    <div className="space-y-4">
                        {quiz.type === "short_answer" ? (
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                                className="w-full px-6 py-4 text-center text-xl rounded-2xl border-2 border-primary focus:border-secondary focus:outline-none transition-colors"
                                placeholder="답을 입력하세요..."
                                autoFocus
                            />
                        ) : (
                            <div className="space-y-3">
                                {quiz.choices?.map((choice, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setUserAnswer(choice)}
                                        className={`
                      w-full px-6 py-4 rounded-xl border-2 transition-all
                      ${userAnswer === choice
                                                ? "border-primary bg-primary text-white"
                                                : "border-gray-200 hover:border-primary"
                                            }
                    `}
                                    >
                                        {choice}
                                    </button>
                                ))}
                            </div>
                        )}

                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full mt-6"
                            onClick={handleSubmit}
                            disabled={!userAnswer.trim()}
                        >
                            제출하기! 🚀
                        </Button>
                    </div>
                ) : feedback === "correct" ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="text-6xl">🎉</div>
                        <p className="text-2xl font-bold text-success">정답입니다!</p>
                        <p className="text-lg">{quiz.correct_msg}</p>

                        {/* Confetti Effect */}
                        {confetti && (
                            <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
                                {[...Array(30)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{
                                            x: Math.random() * window.innerWidth,
                                            y: -20,
                                            rotate: 0,
                                        }}
                                        animate={{
                                            y: window.innerHeight + 100,
                                            rotate: 720,
                                        }}
                                        transition={{
                                            duration: 2 + Math.random(),
                                            ease: "linear",
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
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="text-6xl">😅</div>
                        <p className="text-2xl font-bold text-danger">아쉬워요!</p>
                        <p className="text-lg">{quiz.wrong_msg}</p>

                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full"
                            onClick={() => {
                                setFeedback(null);
                                setUserAnswer("");
                            }}
                        >
                            다시 시도하기
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </Modal>
    );
}
