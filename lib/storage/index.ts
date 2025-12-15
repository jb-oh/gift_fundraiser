/**
 * Storage abstraction layer
 *
 * Smart storage automatically selects the best storage backend:
 * - Uses Supabase when configured with environment variables
 * - Falls back to localStorage when Supabase is not configured
 *
 * This allows the app to work seamlessly in both environments without code changes.
 */

import { smartStorage } from './smartStorage';

// Export the smart storage implementation
export const storage = smartStorage;

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
