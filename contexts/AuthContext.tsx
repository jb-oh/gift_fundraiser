'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserType } from '@/lib/types';
import { getCurrentUser, login as loginUser, logout as logoutUser, signup as signupUser } from '@/lib/auth';

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
    // Load current user from localStorage on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    try {
      const loggedInUser = loginUser(email);
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, userType: UserType) => {
    try {
      const newUser = signupUser(name, email, userType);
      setUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
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
