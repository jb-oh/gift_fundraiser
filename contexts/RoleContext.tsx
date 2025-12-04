'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type RoleMode = 'host' | 'participant';

interface RoleContextType {
  currentMode: RoleMode;
  switchMode: (mode: RoleMode) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = 'gift_fundraiser_role_mode';

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentMode, setCurrentMode] = useState<RoleMode>('participant');

  useEffect(() => {
    // Load saved mode from localStorage
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem(STORAGE_KEY) as RoleMode | null;
      if (savedMode === 'host' || savedMode === 'participant') {
        setCurrentMode(savedMode);
      }
    }
  }, []);

  const switchMode = (mode: RoleMode) => {
    setCurrentMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  };

  return (
    <RoleContext.Provider value={{ currentMode, switchMode }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
