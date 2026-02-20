"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MockUser, signOut as serviceSignOut } from '@/services/authService';
import { useUserStore } from '@/store/userStore';

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<MockUser | null>(null);
    const [loading, setLoading] = useState(true);
    const userStore = useUserStore();

    useEffect(() => {
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                // User is authenticated
                const currentUser: MockUser = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                };

                setUser(currentUser);
                userStore.setUser(currentUser);

                // Load profile from Supabase
                const { fetchUserProfile } = await import('@/services/profileService');
                try {
                    const profile = await fetchUserProfile(session.user.id);
                    if (profile) {
                        console.log('Loaded profile from Supabase:', profile);
                        userStore.setChildInfo(profile);
                    }
                } catch (error) {
                    console.error('Error loading profile:', error);
                }
            } else {
                setUser(null);
                userStore.clearUser();
            }

            setLoading(false);
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const currentUser: MockUser = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                };

                setUser(currentUser);
                userStore.setUser(currentUser);

                // Load profile on auth state change
                const { fetchUserProfile } = await import('@/services/profileService');
                try {
                    const profile = await fetchUserProfile(session.user.id);
                    if (profile) {
                        userStore.setChildInfo(profile);
                    }
                } catch (error) {
                    console.error('Error loading profile:', error);
                }
            } else {
                setUser(null);
                userStore.clearUser();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [userStore]);

    const signOut = async () => {
        try {
            await serviceSignOut();
            setUser(null);
            userStore.clearUser();
            router.push('/login');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return {
        user,
        loading,
        signOut,
        isAuthenticated: !!user,
    };
}
