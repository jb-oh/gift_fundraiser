'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Funding, Contribution } from '@/lib/types';
import { getFunding, getContributions } from '@/lib/storage';

interface FundingContextType {
  funding: Funding | null;
  contributions: Contribution[];
  loading: boolean;
  refreshFunding: () => void;
}

const FundingContext = createContext<FundingContextType | undefined>(undefined);

export function FundingProvider({
  children,
  fundingId,
}: {
  children: React.ReactNode;
  fundingId: string;
}) {
  const [funding, setFunding] = useState<Funding | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshFunding = useCallback(() => {
    const fundingData = getFunding(fundingId);
    const contributionsData = getContributions(fundingId);
    
    setFunding(fundingData);
    setContributions(contributionsData);
    setLoading(false);
  }, [fundingId]);

  useEffect(() => {
    refreshFunding();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(refreshFunding, 2000);
    
    return () => clearInterval(interval);
  }, [refreshFunding]);

  return (
    <FundingContext.Provider value={{ funding, contributions, loading, refreshFunding }}>
      {children}
    </FundingContext.Provider>
  );
}

export function useFunding() {
  const context = useContext(FundingContext);
  if (context === undefined) {
    throw new Error('useFunding must be used within a FundingProvider');
  }
  return context;
}



