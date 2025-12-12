import { supabase } from './supabase';
import { User, UserType } from './types';

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

// Signup with Magic Link (same as login in Supabase, but adding metadata)
export async function signup(name: string, email: string, userType: UserType): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        name,
        userType,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

// Login with Magic Link
export async function login(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {
    throw new Error(error.message);
  }
}

// Logout
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
  }
}

// Get current user (async)
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return mapSupabaseUser(user);
}

// Helper to get session user synchronously? No, Supabase is async.
// We remove the synchronous exports and strict dependency on localStorage.
