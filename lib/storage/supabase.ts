import { getSupabaseClient } from '@/lib/supabase';
import { Funding, Contribution } from '../types';
import { IStorage } from './interface';

// --- Mappers ---

function mapFundingFromDB(db: any): Funding {
  return {
    id: db.id,
    hostId: db.host_id,
    hostName: db.host_name,
    title: db.title,
    recipientName: db.recipient_name,
    occasion: db.occasion,
    customOccasion: db.custom_occasion,
    targetAmount: Number(db.target_amount),
    currentAmount: Number(db.current_amount),
    deadline: db.deadline,
    coverImage: db.cover_image,
    giftCandidates: db.gift_candidates || [],
    transparencySettings: db.transparency_settings || { showAmounts: true, showNames: true, showGoal: true },
    createdAt: db.created_at,
    status: db.status,
  };
}

function mapFundingToDB(funding: Funding) {
  return {
    id: funding.id,
    host_id: funding.hostId,
    host_name: funding.hostName,
    title: funding.title,
    recipient_name: funding.recipientName,
    occasion: funding.occasion,
    custom_occasion: funding.customOccasion,
    target_amount: funding.targetAmount,
    current_amount: funding.currentAmount,
    deadline: funding.deadline,
    cover_image: funding.coverImage,
    gift_candidates: funding.giftCandidates, // JSONB
    transparency_settings: funding.transparencySettings, // JSONB
    created_at: funding.createdAt,
    status: funding.status,
  };
}

function mapContributionFromDB(db: any): Contribution {
  return {
    id: db.id,
    fundingId: db.funding_id,
    contributorId: db.contributor_id || undefined,
    contributorName: db.contributor_name,
    amount: Number(db.amount),
    message: db.message,
    isAnonymous: db.is_anonymous,
    timestamp: db.timestamp,
    paymentMethod: db.payment_method,
  };
}

function mapContributionToDB(contribution: Contribution, contributorId?: string) {
  return {
    id: contribution.id,
    funding_id: contribution.fundingId,
    contributor_id: contributorId || null,
    contributor_name: contribution.contributorName,
    amount: contribution.amount,
    message: contribution.message,
    is_anonymous: contribution.isAnonymous,
    payment_method: contribution.paymentMethod,
    timestamp: contribution.timestamp,
  };
}

// --- Storage Class ---

class SupabaseStorage implements IStorage {
  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async saveFunding(funding: Funding): Promise<void> {
    const dbPayload = mapFundingToDB(funding);
    const { error } = await getSupabaseClient()
      .from('fundings')
      .upsert(dbPayload);

    if (error) throw new Error(`Failed to save funding: ${error.message}`);
  }

  async getFunding(id: string): Promise<Funding | null> {
    const { data, error } = await getSupabaseClient()
      .from('fundings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapFundingFromDB(data);
  }

  async getAllFundings(): Promise<Funding[]> {
    const { data, error } = await getSupabaseClient()
      .from('fundings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []).map(mapFundingFromDB);
  }

  async addContribution(contribution: Contribution, userId?: string): Promise<void> {
    const dbPayload = mapContributionToDB(contribution, userId);
    const { error } = await getSupabaseClient()
      .from('contributions')
      .insert(dbPayload);

    if (error) throw new Error(`Failed to add contribution: ${error.message}`);

    // Update funding current amount via secure RPC
    const { error: updateError } = await getSupabaseClient().rpc('increment_funding_amount', {
      p_funding_id: contribution.fundingId,
      p_amount_to_add: contribution.amount
    });

    if (updateError) throw new Error(`Failed to update funding: ${updateError.message}`);
  }

  async getContributions(fundingId: string): Promise<Contribution[]> {
    const { data, error } = await getSupabaseClient()
      .from('contributions')
      .select('*')
      .eq('funding_id', fundingId)
      .order('timestamp', { ascending: false });

    if (error) return [];
    return (data || []).map(mapContributionFromDB);
  }

  async getFundingsByHost(hostId: string): Promise<Funding[]> {
    const { data, error } = await getSupabaseClient()
      .from('fundings')
      .select('*')
      .eq('host_id', hostId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []).map(mapFundingFromDB);
  }

  async getFundingsByContributor(userId: string): Promise<{ funding: Funding; contribution: Contribution }[]> {
    // Search by contributor_id for reliable lookups
    const { data: contributions, error } = await getSupabaseClient()
      .from('contributions')
      .select(`
        *,
        funding:fundings(*)
      `)
      .eq('contributor_id', userId);

    if (error) return [];

    return (contributions || []).map((c: any) => ({
      contribution: mapContributionFromDB(c),
      funding: mapFundingFromDB(c.funding)
    }));
  }
}

export const supabaseStorage = new SupabaseStorage();
