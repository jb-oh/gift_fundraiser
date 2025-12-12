# Storage Migration Guide

This guide explains how to migrate from localStorage to a cloud database like Supabase.

## Current Setup

The app currently uses **localStorage** for data persistence:
- ✅ Works great for prototypes and demos
- ✅ No backend or database setup required
- ✅ Fully client-side, works on GitHub Pages
- ❌ Data is browser-specific (not shared across devices)
- ❌ Data can be lost if browser data is cleared
- ❌ No real-time synchronization

## Migration to Supabase

### Step 1: Set up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Note your project URL and anon key

### Step 2: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 3: Create Supabase Tables

Run this SQL in the Supabase SQL editor:

```sql
-- Fundings table
CREATE TABLE fundings (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,
  host_name TEXT NOT NULL,
  title TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  custom_occasion TEXT,
  target_amount INTEGER NOT NULL,
  current_amount INTEGER NOT NULL DEFAULT 0,
  deadline TIMESTAMP NOT NULL,
  cover_image TEXT,
  gift_candidates JSONB NOT NULL DEFAULT '[]',
  transparency_settings JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Contributions table
CREATE TABLE contributions (
  id TEXT PRIMARY KEY,
  funding_id TEXT NOT NULL REFERENCES fundings(id),
  contributor_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  timestamp TIMESTAMP DEFAULT NOW(),
  payment_method TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE fundings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON fundings FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON contributions FOR SELECT USING (true);

-- Allow inserts (you can make this more restrictive based on auth)
CREATE POLICY "Allow public insert" ON fundings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON contributions FOR INSERT WITH CHECK (true);

-- Allow updates only for the host
CREATE POLICY "Allow host update" ON fundings FOR UPDATE
  USING (host_id = current_setting('request.jwt.claims', true)::json->>'sub');
```

### Step 4: Create Supabase Storage Implementation

Create `lib/storage/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { Funding, Contribution } from '../types';
import { IStorage } from './interface';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

class SupabaseStorage implements IStorage {
  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async saveFunding(funding: Funding): Promise<void> {
    const { error } = await supabase
      .from('fundings')
      .upsert(funding);

    if (error) throw new Error(`Failed to save funding: ${error.message}`);
  }

  async getFunding(id: string): Promise<Funding | null> {
    const { data, error } = await supabase
      .from('fundings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async getAllFundings(): Promise<Funding[]> {
    const { data, error } = await supabase
      .from('fundings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  }

  async addContribution(contribution: Contribution): Promise<void> {
    const { error } = await supabase
      .from('contributions')
      .insert(contribution);

    if (error) throw new Error(`Failed to add contribution: ${error.message}`);

    // Update funding current amount
    const { error: updateError } = await supabase.rpc('increment_funding_amount', {
      funding_id: contribution.fundingId,
      amount_to_add: contribution.amount
    });

    if (updateError) throw new Error(`Failed to update funding: ${updateError.message}`);
  }

  async getContributions(fundingId: string): Promise<Contribution[]> {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('funding_id', fundingId)
      .order('timestamp', { ascending: false });

    if (error) return [];
    return data || [];
  }

  async getFundingsByHost(hostId: string): Promise<Funding[]> {
    const { data, error } = await supabase
      .from('fundings')
      .select('*')
      .eq('host_id', hostId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  }

  async getFundingsByContributor(contributorEmail: string): Promise<{ funding: Funding; contribution: Contribution }[]> {
    const { data: contributions, error } = await supabase
      .from('contributions')
      .select(\`
        *,
        funding:fundings(*)
      \`)
      .ilike('contributor_name', `%${contributorEmail}%`);

    if (error) return [];

    return (contributions || []).map(c => ({
      contribution: c,
      funding: c.funding
    }));
  }
}

export const supabaseStorage = new SupabaseStorage();
```

You'll also need to create a database function for updating the funding amount:

```sql
CREATE OR REPLACE FUNCTION increment_funding_amount(funding_id TEXT, amount_to_add INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE fundings
  SET current_amount = current_amount + amount_to_add
  WHERE id = funding_id;
END;
$$ LANGUAGE plpgsql;
```

### Step 5: Update Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 6: Switch Storage Implementation

In `lib/storage/index.ts`, change:

```typescript
// Old:
import { localStorageImpl } from './localStorage';
export const storage = localStorageImpl;

// New:
import { supabaseStorage } from './supabase';
export const storage = supabaseStorage;
```

### Step 7: Handle Async Operations

Since Supabase operations are async, update any synchronous calls to use async/await:

```typescript
// Before:
const funding = getFunding(id);

// After:
const funding = await getFunding(id);
```

Most of your components already use `useEffect` hooks, so this should be straightforward.

### Step 8: Update Next.js Config for Dynamic Rendering

If you want real-time data from Supabase, you might want to remove `output: 'export'` and deploy to Vercel instead of GitHub Pages. Alternatively, keep static export and fetch data client-side (which is what's currently happening with localStorage).

## Other Cloud Database Options

The same pattern works for other databases:

1. **Firebase Firestore**: Create `lib/storage/firebase.ts` implementing `IStorage`
2. **PocketBase**: Create `lib/storage/pocketbase.ts` implementing `IStorage`
3. **Your own API**: Create `lib/storage/api.ts` implementing `IStorage`

The `IStorage` interface ensures a consistent API regardless of the backend!
