// ===== Type Definitions for My Edu-Tale Platform =====

export interface ChildInfo {
    child_name: string;
    age: string;
    gender: "male" | "female" | "other";
    personality: string; // MBTI type
}

export interface GameSession {
    emotion: "happiness" | "sadness" | "anger" | "fear" | "bored";
    stage: string; // e.g., "1-1-1"
}

export interface Quiz {
    type: "short_answer" | "choice";
    question: string;
    answer: string;
    choices?: string[]; // For choice type
    correct_msg: string;
    wrong_msg: string;
}

export interface Scene {
    scene_no: number;
    text: string;
    image_url: string;
    audio_url: string;
    quiz: Quiz | null;
}

export interface Story {
    story_id: string;
    title: string;
    summary: string;
    created_at: string;
    pdf_url?: string;
    scenes: Scene[];
}

// Stage status type
export type StageStatus = "locked" | "unlocked" | "completed";

// Emotion icons mapping
export const EMOTION_ICONS: Record<GameSession["emotion"], string> = {
    happiness: "😊",
    sadness: "😢",
    anger: "😠",
    fear: "😨",
    bored: "😑",
};

// MBTI personality options
export const MBTI_TYPES = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP",
] as const;
