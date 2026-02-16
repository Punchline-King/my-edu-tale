import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChildInfo, GameSession } from "@/lib/types";

interface UserStore {
    // State
    childInfo: ChildInfo | null;
    gameSession: GameSession | null;
    currentStoryId: string | null;
    completedStages: string[];

    // Actions
    setChildInfo: (info: ChildInfo) => void;
    setGameSession: (session: GameSession) => void;
    setCurrentStoryId: (id: string) => void;
    markStageComplete: (stage: string) => void;
    reset: () => void;
}

const initialState = {
    childInfo: null,
    gameSession: null,
    currentStoryId: null,
    completedStages: [],
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            ...initialState,

            setChildInfo: (info) => set({ childInfo: info }),

            setGameSession: (session) => set({ gameSession: session }),

            setCurrentStoryId: (id) => set({ currentStoryId: id }),

            markStageComplete: (stage) =>
                set((state) => ({
                    completedStages: state.completedStages.includes(stage)
                        ? state.completedStages
                        : [...state.completedStages, stage],
                })),

            reset: () => set(initialState),
        }),
        {
            name: "edu-tale-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
