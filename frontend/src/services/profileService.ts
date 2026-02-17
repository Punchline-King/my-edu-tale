/**
 * Profile Service
 * 
 * Handles fetching and managing user child profiles.
 * Mock implementation that can be easily switched to real Supabase queries.
 */

import type { ChildInfo } from "@/lib/types";
import { IS_MOCK } from "./authService";

// Extended ChildInfo with user ID for database mapping
export interface UserProfile extends ChildInfo {
    userId: string;
}

// Mock database - Simulates existing user profiles
const MOCK_PROFILES: UserProfile[] = [
    {
        userId: "user_001",
        child_name: "민준",
        age: "7",
        gender: "male",
        personality: "INFJ",
    },
    {
        userId: "user_002",
        child_name: "서연",
        age: "6",
        gender: "female",
        personality: "ENFP",
    },
];

/**
 * Mock Profile Fetch
 * Simulates database query to find user's child profile
 */
async function mockFetchProfile(userId: string): Promise<ChildInfo | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Search mock database
    const profile = MOCK_PROFILES.find((p) => p.userId === userId);

    if (!profile) {
        return null; // New user - no profile exists
    }

    // Return child info without userId
    const { userId: _, ...childInfo } = profile;
    return childInfo;
}

/**
 * Real Supabase Profile Fetch
 */
async function supabaseFetchProfile(userId: string): Promise<ChildInfo | null> {
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');

    if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, using mock profile');
        return mockFetchProfile(userId);
    }

    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('child_name, age, gender, personality')
            .eq('user_id', userId)
            .single();

        if (error) {
            // PGRST116 = not found, which is normal for new users
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        return null;
    }
}

/**
 * Fetch user's child profile
 * Uses mock or real implementation based on IS_MOCK flag
 */
export async function fetchUserProfile(userId: string): Promise<ChildInfo | null> {
    if (IS_MOCK) {
        return mockFetchProfile(userId);
    } else {
        return supabaseFetchProfile(userId);
    }
}

/**
 * Save/Update user's child profile to Supabase
 */
export async function saveUserProfile(
    userId: string,
    profile: ChildInfo
): Promise<void> {
    if (IS_MOCK) {
        // Mock save - just log
        console.log("Mock: Saving profile for user", userId, profile);
        return Promise.resolve();
    }

    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');

    if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, profile not saved');
        return;
    }

    try {
        // Use upsert to insert or update
        const { error } = await supabase
            .from('user_profiles')
            .upsert({
                user_id: userId,
                child_name: profile.child_name,
                age: profile.age,
                gender: profile.gender,
                personality: profile.personality,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (error) {
            console.error('Error saving profile:', error);
            throw new Error(`Failed to save profile: ${error.message}`);
        }

        console.log('Profile saved successfully for user:', userId);
    } catch (error) {
        console.error('Unexpected error saving profile:', error);
        throw error;
    }
}

/**
 * Delete user's profile
 */
export async function deleteUserProfile(userId: string): Promise<void> {
    if (IS_MOCK) {
        console.log("Mock: Deleting profile for user", userId);
        return Promise.resolve();
    }

    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');

    if (!isSupabaseConfigured()) {
        return;
    }

    try {
        const { error } = await supabase
            .from('user_profiles')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting profile:', error);
            throw new Error(`Failed to delete profile: ${error.message}`);
        }
    } catch (error) {
        console.error('Unexpected error deleting profile:', error);
        throw error;
    }
}
