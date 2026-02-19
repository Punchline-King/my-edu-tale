"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/userStore";
import { motion } from "framer-motion";
import { MBTI_TYPES } from "@/lib/types";
import { saveUserProfile } from "@/services/profileService";
import { supabase } from "@/lib/supabase";

export default function ChildInfoPage() {
    const router = useRouter();
    const setChildInfo = useUserStore((state) => state.setChildInfo);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        child_name: "",
        age: "7",
        gender: "male" as "male" | "female" | "other",
        personality: "ENFP",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Convert age to number to match ChildInfo interface & DB
            const profileData = {
                ...formData,
                age: parseInt(formData.age.toString(), 10) || 7 // Default to 7 if parsing fails
            };

            // Save to Zustand store
            setChildInfo(profileData);

            // Save to Supabase if user is authenticated
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                console.log('Saving profile to Supabase for user:', user.id);
                await saveUserProfile(user.id, profileData);
            }

            // Navigate to stage select
            router.push("/stage-select");
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('프로필 저장 중 오류가 발생했습니다. 계속 진행합니다.');
            router.push("/stage-select");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-2xl opacity-50 animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>

            <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 relative z-10">

                {/* Mascot Guide Section */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 text-center md:text-right"
                >
                    <div className="inline-block relative">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="text-[120px] md:text-[150px] drop-shadow-2xl"
                        >
                            🤖
                        </motion.div>
                        {/* Speech Bubble */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="absolute -top-4 -left-45 p-3 md:-left-50 bg-white md:p-4 rounded-3xl rounded-br-none shadow-xl border border-blue-100 w-[180px] md:w-[200px] text-center z-20"
                        >
                            <p className="text-gray-700 font-bold text-base leading-relaxed">
                                친구의 이름이 뭐니?<br />
                                나랑 같이 놀자!
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Form Section */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex-[1.5] w-full"
                >
                    <div className="glass-card p-8 rounded-3xl backdrop-blur-xl border border-white/50 shadow-xl bg-white/40">
                        <div className="text-center mb-6 md:hidden">
                            <h1 className="text-2xl font-bold text-gray-800">아이 정보 입력</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                    이름
                                </label>
                                <input
                                    type="text"
                                    value={formData.child_name}
                                    onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-white/50 bg-white/60 focus:bg-white focus:border-blue-400 focus:outline-none transition-all text-lg shadow-sm placeholder:text-gray-400"
                                    placeholder="친구의 이름을 알려줘!"
                                    required
                                    suppressHydrationWarning
                                />
                            </div>

                            <div className="flex gap-4">
                                {/* Age Input */}
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                        나이
                                    </label>
                                    <input
                                        type="number"
                                        min="4"
                                        max="13"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-white/50 bg-white/60 focus:bg-white focus:border-blue-400 focus:outline-none transition-all text-lg shadow-sm"
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>

                                {/* Gender Toggle */}
                                <div className="flex-[2]">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                        성별
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/40">
                                        {["male", "female"].map((gender) => (
                                            <button
                                                key={gender}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, gender: gender as "male" | "female" })}
                                                className={`
                                                  relative py-2.5 rounded-xl text-sm font-bold transition-all overflow-hidden
                                                  ${formData.gender === gender
                                                        ? "bg-white text-blue-600 shadow-md scale-[1.02]"
                                                        : "text-gray-500 hover:bg-white/50"
                                                    }
                                                `}
                                            >
                                                {gender === "male" ? "👦 왕자님" : "👧 공주님"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* MBTI Selection (Hidden/Advanced) */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                    성격 (MBTI)
                                </label>
                                <select
                                    value={formData.personality}
                                    onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-white/50 bg-white/60 focus:bg-white focus:border-blue-400 focus:outline-none transition-all appearance-none cursor-pointer"
                                    suppressHydrationWarning
                                >
                                    {MBTI_TYPES.map((mbti) => (
                                        <option key={mbti} value={mbti}>{mbti}</option>
                                    ))}
                                </select>
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full mt-4 py-8 text-xl rounded-2xl shadow-xl bg-gradient-to-r from-blue-400 to-purple-400 border-none hover:opacity-90 transition-opacity"
                                    disabled={isLoading}
                                >
                                    {isLoading ? '저장 중...' : '모험 떠나기 🚀'}
                                </Button>
                            </motion.div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
