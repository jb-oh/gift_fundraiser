import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const hasSupabaseConfig = !!(supabaseUrl && supabaseKey);

if (!hasSupabaseConfig) {
    console.warn(
        '⚠️  Supabase is not configured. The app will use localStorage for data storage.\n' +
        'To enable Supabase:\n' +
        '1. Copy .env.example to .env.local\n' +
        '2. Add your Supabase URL and anon key\n' +
        '3. Restart the dev server'
    );
}

// Create a client even if not configured (will use localStorage fallback)
export const supabase = hasSupabaseConfig
    ? createClient(supabaseUrl, supabaseKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key');

export const isSupabaseConfigured = hasSupabaseConfig;
