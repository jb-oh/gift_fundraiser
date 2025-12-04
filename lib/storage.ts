import { Funding, Contribution } from './types';

const STORAGE_KEY_FUNDINGS = 'gift_fundraiser_fundings';
const STORAGE_KEY_CONTRIBUTIONS = 'gift_fundraiser_contributions';

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Funding operations
export function saveFunding(funding: Funding): void {
  try {
    const fundings = getAllFundings();
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

export function getFunding(id: string): Funding | null {
  try {
    const fundings = getAllFundings();
    return fundings.find(f => f.id === id) || null;
  } catch (error) {
    console.error('Error getting funding:', error);
    return null;
  }
}

export function getAllFundings(): Funding[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_FUNDINGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting all fundings:', error);
    return [];
  }
}

// Contribution operations
export function addContribution(contribution: Contribution): void {
  try {
    const contributions = getAllContributions();
    contributions.push(contribution);
    localStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(contributions));
    
    // Update funding current amount
    const funding = getFunding(contribution.fundingId);
    if (funding) {
      funding.currentAmount += contribution.amount;
      saveFunding(funding);
    }
  } catch (error) {
    console.error('Error adding contribution:', error);
    throw new Error('Failed to add contribution');
  }
}

export function getContributions(fundingId: string): Contribution[] {
  try {
    const contributions = getAllContributions();
    return contributions.filter(c => c.fundingId === fundingId);
  } catch (error) {
    console.error('Error getting contributions:', error);
    return [];
  }
}

function getAllContributions(): Contribution[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CONTRIBUTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting all contributions:', error);
    return [];
  }
}

// Get fundings created by a specific host
export function getFundingsByHost(hostId: string): Funding[] {
  try {
    const fundings = getAllFundings();
    return fundings.filter(f => f.hostId === hostId);
  } catch (error) {
    console.error('Error getting fundings by host:', error);
    return [];
  }
}

// Get fundings a user has contributed to
export function getFundingsByContributor(contributorEmail: string): { funding: Funding; contribution: Contribution }[] {
  try {
    const allContributions = getAllContributions();
    const userContributions = allContributions.filter(c =>
      c.contributorName.toLowerCase().includes(contributorEmail.toLowerCase()) ||
      !c.isAnonymous
    );

    const fundings = getAllFundings();
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



