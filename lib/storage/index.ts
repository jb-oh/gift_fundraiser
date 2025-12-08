/**
 * Storage abstraction layer
 *
 * Current implementation: localStorage (client-side only)
 *
 * To migrate to Supabase or another cloud database:
 * 1. Create a new file: lib/storage/supabase.ts
 * 2. Implement the IStorage interface
 * 3. Update the import below to use the new implementation
 * 4. Update any synchronous calls to handle async/await if needed
 *
 * Example migration:
 *   import { supabaseStorage } from './supabase';
 *   export const storage = supabaseStorage;
 */

import { localStorageImpl } from './localStorage';

// Export the current storage implementation
export const storage = localStorageImpl;

// Re-export the interface for type checking
export type { IStorage } from './interface';

// Convenience exports for backwards compatibility
export const generateId = () => storage.generateId();
export const saveFunding = (funding: Parameters<typeof storage.saveFunding>[0]) => storage.saveFunding(funding);
export const getFunding = (id: string) => storage.getFunding(id);
export const getAllFundings = () => storage.getAllFundings();
export const addContribution = (contribution: Parameters<typeof storage.addContribution>[0]) => storage.addContribution(contribution);
export const getContributions = (fundingId: string) => storage.getContributions(fundingId);
export const getFundingsByHost = (hostId: string) => storage.getFundingsByHost(hostId);
export const getFundingsByContributor = (contributorEmail: string) => storage.getFundingsByContributor(contributorEmail);
