import { Funding, Contribution } from '../types';
import { IStorage } from './interface';

const STORAGE_KEY_FUNDINGS = 'gift_fundraiser_fundings';
const STORAGE_KEY_CONTRIBUTIONS = 'gift_fundraiser_contributions';

/**
 * localStorage implementation of the storage interface
 * This is suitable for prototypes and client-side only applications
 *
 * Limitations:
 * - Data is stored only in the browser (not shared across devices)
 * - Data can be lost if the user clears browser data
 * - No real-time synchronization across tabs/devices
 */
class LocalStorage implements IStorage {
  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  saveFunding(funding: Funding): void {
    try {
      const fundings = this.getAllFundings();
      const existingIndex = fundings.findIndex(f => f.id === funding.id);

      if (existingIndex >= 0) {
        fundings[existingIndex] = funding;
      } else {
        fundings.push(funding);
      }

      localStorage.setItem(STORAGE_KEY_FUNDINGS, JSON.stringify(fundings));
    } catch (error) {
      console.error('Error saving funding:', error);
      throw new Error('Failed to save funding');
    }
  }

  getFunding(id: string): Funding | null {
    try {
      const fundings = this.getAllFundings();
      return fundings.find(f => f.id === id) || null;
    } catch (error) {
      console.error('Error getting funding:', error);
      return null;
    }
  }

  getAllFundings(): Funding[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FUNDINGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all fundings:', error);
      return [];
    }
  }

  addContribution(contribution: Contribution): void {
    try {
      const contributions = this.getAllContributions();
      contributions.push(contribution);
      localStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(contributions));

      // Update funding current amount
      const funding = this.getFunding(contribution.fundingId);
      if (funding) {
        funding.currentAmount += contribution.amount;
        this.saveFunding(funding);
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
      throw new Error('Failed to add contribution');
    }
  }

  getContributions(fundingId: string): Contribution[] {
    try {
      const contributions = this.getAllContributions();
      return contributions.filter(c => c.fundingId === fundingId);
    } catch (error) {
      console.error('Error getting contributions:', error);
      return [];
    }
  }

  getFundingsByHost(hostId: string): Funding[] {
    try {
      const fundings = this.getAllFundings();
      return fundings.filter(f => f.hostId === hostId);
    } catch (error) {
      console.error('Error getting fundings by host:', error);
      return [];
    }
  }

  getFundingsByContributor(contributorEmail: string): { funding: Funding; contribution: Contribution }[] {
    try {
      const allContributions = this.getAllContributions();
      const userContributions = allContributions.filter(c =>
        c.contributorName.toLowerCase().includes(contributorEmail.toLowerCase()) ||
        !c.isAnonymous
      );

      const fundings = this.getAllFundings();
      const result: { funding: Funding; contribution: Contribution }[] = [];

      for (const contribution of userContributions) {
        const funding = fundings.find(f => f.id === contribution.fundingId);
        if (funding) {
          result.push({ funding, contribution });
        }
      }

      return result;
    } catch (error) {
      console.error('Error getting fundings by contributor:', error);
      return [];
    }
  }

  private getAllContributions(): Contribution[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CONTRIBUTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all contributions:', error);
      return [];
    }
  }
}

export const localStorageImpl = new LocalStorage();
