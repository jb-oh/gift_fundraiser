'use client';

// ... imports
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserType } from '@/lib/types';
import { getCurrentUser, login as loginSupabase, logout as logoutSupabase, signup as signupSupabase } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  signup: (name: string, email: string, userType: UserType) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isHost: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // We need to map the user again or fetch it
        // Re-using getCurrentUser logic roughly
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          userType: session.user.user_metadata?.userType || 'user',
          createdAt: session.user.created_at,
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string) => {
    await loginSupabase(email);
    // Do NOT set user here; waiting for email link click
  };

  const signup = async (name: string, email: string, userType: UserType) => {
    await signupSupabase(name, email, userType);
    // Do NOT set user here; waiting for email link click
  };

  const logout = async () => {
    await logoutSupabase();
    setUser(null); // Optimistic update
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: user !== null,
    isHost: user?.userType === 'host',
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
