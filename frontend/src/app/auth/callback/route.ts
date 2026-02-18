import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * OAuth Callback Handler using @supabase/ssr
 * Handles the redirect from Google OAuth and establishes the session using cookies.
 */
export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') ?? '/';
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');

    // 1. Handle OAuth errors from Supabase
    if (error) {
        console.error('OAuth error:', error, errorDescription);
        return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
        );
    }

    // 2. Handle successful code exchange
    if (code) {
        const { createClient } = await import('@/utils/supabase/server');
        const supabase = await createClient();

        try {
            // Exchange the code for a session (This will store tokens in cookies)
            const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

            if (sessionError) {
                console.error('Session exchange error:', sessionError);
                return NextResponse.redirect(new URL('/login?error=session_exchange_failed', requestUrl.origin));
            }

            if (session?.user) {
                // Check if a child profile already exists in the 'users' table
                const { data: profile, error: profileError } = await supabase
                    .from('users')
                    .select('child_name')
                    .eq('id', session.user.id)
                    .single();

                if (profile && !profileError) {
                    // Profile found -> Send to stage selection
                    console.log('Existing user profile found. Redirecting to stage-select.');
                    return NextResponse.redirect(new URL('/stage-select', requestUrl.origin));
                }
            }
        } catch (err) {
            console.error('Unexpected error during auth callback:', err);
        }

        // No profile found or error during check -> Send to profile creation
        return NextResponse.redirect(new URL('/child-info', requestUrl.origin));
    }

    // 3. Fallback: No code or error provided
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
}
