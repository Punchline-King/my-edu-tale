import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * OAuth Callback Handler
 * Handles the redirect from Google OAuth and establishes the session
 */
export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
        console.error('OAuth error:', error, errorDescription);
        return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
        );
    }

    // For code exchange, we'll handle it on the client side
    // since we're using the supabase-js client directly
    if (code) {
        // Import here to avoid circular dependencies
        const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');

        if (isSupabaseConfigured()) {
            try {
                // Exchange code for session
                const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

                if (sessionError) {
                    console.error('Session exchange error:', sessionError);
                    return NextResponse.redirect(new URL('/child-info', requestUrl.origin));
                }

                if (session?.user) {
                    // Check if profile exists
                    const { data: profile, error: profileError } = await supabase
                        .from('user_profiles')
                        .select('child_name')
                        .eq('user_id', session.user.id)
                        .single();

                    if (profile && !profileError) {
                        // Existing user - has profile
                        console.log('Returning user detected, redirecting to stage-select');
                        return NextResponse.redirect(new URL('/stage-select', requestUrl.origin));
                    }
                }
            } catch (error) {
                console.error('Error during profile check:', error);
            }
        }

        // New user or error - redirect to child-info
        return NextResponse.redirect(new URL('/child-info', requestUrl.origin));
    }

    // No code or error, redirect to login
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
}
