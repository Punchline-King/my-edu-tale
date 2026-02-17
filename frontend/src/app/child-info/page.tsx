"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useUserStore } from "@/store/userStore";
import { UserCircle } from "lucide-react";
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
        age: "",
        gender: "male" as "male" | "female" | "other",
        personality: "ENFP",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Save to Zustand store
            setChildInfo(formData);

            // Save to Supabase if user is authenticated
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                console.log('Saving profile to Supabase for user:', user.id);
                await saveUserProfile(user.id, formData);
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
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl"
            >
                <Card variant="default" hover={false} className="p-8">
                    <div className="text-center mb-8">
                        <UserCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h1 className="text-3xl font-bold mb-2">아이 정보 입력</h1>
                        <p className="text-foreground/60">
                            맞춤형 수학 이야기를 위해 아이의 정보를 알려주세요
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                이름 <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.child_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, child_name: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                placeholder="예: 김민준"
                                required
                            />
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                나이 <span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                min="5"
                                max="10"
                                value={formData.age}
                                onChange={(e) =>
                                    setFormData({ ...formData, age: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                placeholder="예: 7"
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                성별 <span className="text-danger">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {["male", "female"].map((gender) => (
                                    <button
                                        key={gender}
                                        type="button"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                gender: gender as "male" | "female" | "other",
                                            })
                                        }
                                        className={`
                      px-4 py-3 rounded-xl border-2 transition-all
                      ${formData.gender === gender
                                                ? "border-primary bg-primary text-white"
                                                : "border-gray-200 hover:border-primary"
                                            }
                    `}
                                    >
                                        {gender === "male" ? "남자" : "여자"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* MBTI */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                성격 유형 (MBTI) <span className="text-danger">*</span>
                            </label>
                            <select
                                value={formData.personality}
                                onChange={(e) =>
                                    setFormData({ ...formData, personality: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                required
                            >
                                {MBTI_TYPES.map((mbti) => (
                                    <option key={mbti} value={mbti}>
                                        {mbti}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full mt-8"
                            disabled={isLoading}
                        >
                            {isLoading ? '저장 중...' : '다음 단계로 🎯'}
                        </Button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
