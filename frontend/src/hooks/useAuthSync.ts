"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/userStore";
import { fetchUserProfile } from "@/services/profileService";

export function useAuthSync() {
    const { userId, setUser, clearUser, setChildInfo } = useUserStore();

    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("Auth Event:", event, session?.user?.id);

                if (session?.user) {
                    // If the user in the store is different from the session user, sync it
                    if (session.user.id !== userId) {
                        console.log("Syncing user store for:", session.user.id);

                        // Update basic info
                        setUser({
                            id: session.user.id,
                            email: session.user.email ?? "",
                            name: session.user.user_metadata?.name ?? session.user.email ?? "",
                        });

                        // Fetch child profile from DB
                        const profile = await fetchUserProfile(session.user.id);
                        if (profile) {
                            setChildInfo(profile);
                        } else {
                            // If no profile exists, we don't necessarily clear it if we're on the child-info page
                            // but for safety in navigation, we should know if it's missing
                            setChildInfo(null as any);
                        }
                    }
                } else if (event === 'SIGNED_OUT' || !session) {
                    // Clear store on logout
                    if (userId) {
                        console.log("Clearing user store due to sign out");
                        clearUser();
                    }
                }
            }
        );

        // Initial check in case onAuthStateChange doesn't fire immediately with the current session
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user && session.user.id !== userId) {
                setUser({
                    id: session.user.id,
                    email: session.user.email ?? "",
                    name: session.user.user_metadata?.name ?? session.user.email ?? "",
                });
                const profile = await fetchUserProfile(session.user.id);
                if (profile) setChildInfo(profile);
            }
        };

        if (userId) {
            initSession();
        }

        return () => {
            subscription.unsubscribe();
        };
    }, [userId, setUser, clearUser, setChildInfo]);
}
