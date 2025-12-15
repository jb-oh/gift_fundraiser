/**
 * Smart Storage Adapter
 * Automatically uses Supabase when configured, falls back to localStorage otherwise
 */

import { isSupabaseConfigured } from '@/lib/supabase';
import { supabaseStorage } from './supabase';
import { localStorageImpl } from './localStorage';
import { IStorage } from './interface';

class SmartStorageAdapter implements IStorage {
  private get storage(): IStorage {
    return isSupabaseConfigured ? supabaseStorage : localStorageImpl;
  }

  generateId(): string {
    return this.storage.generateId();
  }

  async saveFunding(funding: Parameters<IStorage['saveFunding']>[0]): Promise<void> {
    return this.storage.saveFunding(funding);
  }

  async getFunding(id: string): Promise<Awaited<ReturnType<IStorage['getFunding']>>> {
    return this.storage.getFunding(id);
  }

  async getAllFundings(): Promise<Awaited<ReturnType<IStorage['getAllFundings']>>> {
    return this.storage.getAllFundings();
  }

  async addContribution(contribution: Parameters<IStorage['addContribution']>[0]): Promise<void> {
    return this.storage.addContribution(contribution);
  }

  async getContributions(fundingId: string): Promise<Awaited<ReturnType<IStorage['getContributions']>>> {
    return this.storage.getContributions(fundingId);
  }

  async getFundingsByHost(hostId: string): Promise<Awaited<ReturnType<IStorage['getFundingsByHost']>>> {
    return this.storage.getFundingsByHost(hostId);
  }

  async getFundingsByContributor(contributorEmail: string): Promise<Awaited<ReturnType<IStorage['getFundingsByContributor']>>> {
    return this.storage.getFundingsByContributor(contributorEmail);
  }
}

export const smartStorage = new SmartStorageAdapter();
