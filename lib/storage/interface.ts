import { Funding, Contribution } from '../types';

/**
 * Storage interface for funding and contribution data
 * This abstraction allows easy migration from localStorage to cloud databases (e.g., Supabase)
 *
 * To migrate to a different storage backend:
 * 1. Create a new implementation of this interface (e.g., supabaseStorage.ts)
 * 2. Update lib/storage/index.ts to export the new implementation
 */
export interface IStorage {
  // ID generation
  generateId(): string;

  // Funding operations
  saveFunding(funding: Funding): Promise<void> | void;
  getFunding(id: string): Promise<Funding | null> | Funding | null;
  getAllFundings(): Promise<Funding[]> | Funding[];
  getFundingsByHost(hostId: string): Promise<Funding[]> | Funding[];
  getFundingsByContributor(contributorEmail: string): Promise<{ funding: Funding; contribution: Contribution }[]> | { funding: Funding; contribution: Contribution }[];

  // Contribution operations
  addContribution(contribution: Contribution): Promise<void> | void;
  getContributions(fundingId: string): Promise<Contribution[]> | Contribution[];
}
