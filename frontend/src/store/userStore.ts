import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChildInfo, GameSession } from "@/lib/types";

interface UserStore {
    // Authentication State
    isLoggedIn: boolean;
    userId: string | null;

    // User State
    childInfo: ChildInfo | null;
    gameSession: GameSession | null;
    currentStoryId: string | null;
    completedStages: string[];

    // Authentication Actions
    setAuth: (userId: string) => void;
    setUser: (user: { id: string; email: string; name: string }) => void;
    clearUser: () => void;
    logout: () => void;

    // User Actions
    setChildInfo: (info: ChildInfo) => void;
    setGameSession: (session: GameSession) => void;
    setCurrentStoryId: (id: string) => void;
    markStageComplete: (stage: string) => void;
    reset: () => void;
}

const initialState = {
    isLoggedIn: false,
    userId: null,
    childInfo: null,
    gameSession: null,
    currentStoryId: null,
    completedStages: [],
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            ...initialState,

            // Authentication actions
            setAuth: (userId) => set({ isLoggedIn: true, userId }),

            setUser: (user) => set({
                isLoggedIn: true,
                userId: user.id
            }),

            clearUser: () => set(initialState),

            logout: () => set(initialState),

            // User actions
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
