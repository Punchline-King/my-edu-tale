/**
 * Authentication Service
 * 
 * Handles user authentication with Supabase Google OAuth.
 * Falls back to mock implementation if Supabase is not configured.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Mock mode for development (Supabase not required)
// Set to false once Supabase is configured
export const IS_MOCK = false;

// Mock user type (also used for Supabase users)
export interface MockUser {
    id: string;
    email: string;
    name: string;
}

/**
 * Mock Sign In - Simulates Google OAuth flow
 * Returns a mock user object after a brief delay
 */
async function mockSignIn(): Promise<MockUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return different mock users randomly to test both flows
    const mockUsers: MockUser[] = [
        {
            id: "user_001",
            email: "parent1@example.com",
            name: "김민수",
        },
        {
            id: "user_002",
            email: "parent2@example.com",
            name: "이지은",
        },
        {
            id: "user_999",
            email: "newuser@example.com",
            name: "박신영",
        },
    ];

    // Randomly select a user (or always return first for testing)
    // Change index to test different flows: 0 or 1 = existing, 2 = new user
    return mockUsers[2];
}

/**
 * Supabase Sign In with Google OAuth
 * Initiates the OAuth flow and redirects to Google
 */
async function supabaseSignIn(): Promise<MockUser> {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });

    if (error) {
        console.error('Supabase sign in error:', error);
        throw new Error(error.message);
    }

    // OAuth redirect will happen automatically
    // This function won't return in normal flow
    // User will be redirected to Google and back to /auth/callback
    throw new Error('OAuth redirect should have occurred');
}

/**
 * Sign in with Google
 * Uses Supabase if configured, otherwise uses mock implementation
 */
export async function signInWithGoogle(): Promise<MockUser> {
    if (isSupabaseConfigured()) {
        console.log('Using Supabase authentication');
        return supabaseSignIn();
    } else {
        console.warn('Supabase not configured, using mock authentication');
        return mockSignIn();
    }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<MockUser | null> {
    if (!isSupabaseConfigured()) {
        return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email ?? '',
        name: user.user_metadata?.name ?? user.email ?? '',
    };
}

/**
 * Get current session
 */
export async function getSession() {
    if (!isSupabaseConfigured()) {
        return null;
    }

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error);
        return null;
    }

    return session;
}

/**
 * Sign out
 * Clears authentication state
 */
export async function signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    } else {
        // Mock sign out - just return
        return Promise.resolve();
    }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: MockUser | null) => void) {
    if (!isSupabaseConfigured()) {
        return { unsubscribe: () => { } };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
            if (session?.user) {
                callback({
                    id: session.user.id,
                    email: session.user.email ?? '',
                    name: session.user.user_metadata?.name ?? session.user.email ?? '',
                });
            } else {
                callback(null);
            }
        }
    );

    return subscription;
}
