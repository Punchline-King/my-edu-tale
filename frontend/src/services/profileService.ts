/**
 * Profile Service
 * 
 * Handles fetching and managing user child profiles.
 * Correctly maps to the 'users' table in Supabase.
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
        age: 7, // Changed to number to match types.ts/DB
        gender: "male",
        personality: "INFJ",
    },
    {
        userId: "user_002",
        child_name: "서연",
        age: 6,
        gender: "female",
        personality: "ENFP",
    },
];

/**
 * Mock Profile Fetch
 */
async function mockFetchProfile(userId: string): Promise<ChildInfo | null> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const profile = MOCK_PROFILES.find((p) => p.userId === userId);
    if (!profile) return null;
    const { userId: _, ...childInfo } = profile;
    return childInfo;
}

/**
 * Real Supabase Profile Fetch -> 'users' table
 */
async function supabaseFetchProfile(userId: string): Promise<ChildInfo | null> {
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');

    if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, using mock profile');
        return mockFetchProfile(userId);
    }

    try {
        const { data, error } = await supabase
            .from('users') // CORRECT TABLE: users
            .select('child_name, age, gender, personality') // Columns from Supabase.md
            .eq('id', userId) // Primary Key: id
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            console.error('Error fetching profile:', error);
            return null;
        }

        return data as ChildInfo;
    } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        return null;
    }
}

/**
 * Fetch user's child profile
 */
export async function fetchUserProfile(userId: string): Promise<ChildInfo | null> {
    if (IS_MOCK) {
        return mockFetchProfile(userId);
    } else {
        return supabaseFetchProfile(userId);
    }
}

/**
 * Save/Update user's child profile to Supabase -> 'users' table
 */
export async function saveUserProfile(
    userId: string,
    profile: ChildInfo
): Promise<void> {
    if (IS_MOCK) {
        console.log("Mock: Saving profile for user", userId, profile);
        return Promise.resolve();
    }

    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');

    if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, profile not saved');
        return;
    }

    try {
        // UPSERT into 'users' table
        // We use 'id' as the conflict key (Primary Key)
        const { error } = await supabase
            .from('users') // CORRECT TABLE: users
            .upsert({
                id: userId, // UUID from Auth
                child_name: profile.child_name,
                age: Number(profile.age), // Ensure integer
                gender: profile.gender,
                personality: profile.personality,
                // email is handled by Auth trigger or separate update if needed
                // created_at is handled by default
            }, {
                onConflict: 'id'
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
 * Note: Since profile is on the 'users' table, this might mean deleting the user row?
 * Or just clearing fields. For now, assuming we just clear fields or do nothing 
 * since deleting 'users' row might break Auth linkage depending on cascade settings.
 * Let's keep it as is but warn.
 */
export async function deleteUserProfile(userId: string): Promise<void> {
    // WARNING: Deleting from 'users' table might allow cascading delete of stories
    // Be careful. For now, we implemented it as delete row.

    if (IS_MOCK) {
        console.log("Mock: Deleting profile for user", userId);
        return Promise.resolve();
    }

    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');

    if (!isSupabaseConfigured()) return;

    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting profile:', error);
            throw new Error(`Failed to delete profile: ${error.message}`);
        }
    } catch (error) {
        throw error;
    }
}
