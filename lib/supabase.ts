import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

// Return null when not configured - no more silent failures with placeholder client
export const supabase: SupabaseClient | null = isSupabaseConfigured
    ? createClient(supabaseUrl!, supabaseKey!)
    : null;

/**
 * Get the Supabase client with error handling.
 * Throws if Supabase is not configured.
 * Use this in code paths that REQUIRE Supabase (auth, storage).
 */
export function getSupabaseClient(): SupabaseClient {
    if (!supabase) {
        throw new Error(
            'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
        );
    }
    return supabase;
}

// Console warning only in browser (not during SSR/build)
if (!isSupabaseConfigured && typeof window !== 'undefined') {
    console.warn(
        '⚠️  Supabase not configured. Using localStorage fallback.\n' +
        'To enable Supabase:\n' +
        '1. Copy .env.example to .env.local\n' +
        '2. Add your Supabase URL and anon key\n' +
        '3. Restart the dev server'
    );
}
