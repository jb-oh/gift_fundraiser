import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { User, UserType } from './types';
import { getBaseUrl } from './env';

// Map Supabase user to our User type
function mapSupabaseUser(u: any): User | null {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email!,
    name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
    userType: u.user_metadata?.userType || 'user',
    createdAt: u.created_at,
  };
}

/**
 * Signup with Magic Link
 * Throws if Supabase is not configured
 */
export async function signup(name: string, email: string, userType: UserType): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        name,
        userType,
      },
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Login with Magic Link
 * Throws if Supabase is not configured
 */
export async function login(email: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Logout current user
 * Throws if Supabase is not configured
 */
export async function logout(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
  }
}

/**
 * Get current authenticated user
 * Returns null if not authenticated OR if Supabase is not configured
 */
export async function getCurrentUser(): Promise<User | null> {
  // Gracefully return null if Supabase isn't configured
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return mapSupabaseUser(user);
}
