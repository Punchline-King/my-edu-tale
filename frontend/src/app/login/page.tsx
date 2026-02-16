"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login - just navigate to next step
        router.push("/child-info");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card variant="default" hover={false} className="p-8">
                    <div className="text-center mb-8">
                        <LogIn className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h1 className="text-3xl font-bold mb-2">부모님 로그인</h1>
                        <p className="text-foreground/60">
                            아이의 학습을 시작하려면 로그인해주세요
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                이메일
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button type="submit" variant="primary" size="lg" className="w-full mt-6">
                            로그인
                        </Button>

                        <p className="text-center text-sm text-foreground/60 mt-4">
                            데모 모드입니다. 아무 값이나 입력하세요.
                        </p>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
