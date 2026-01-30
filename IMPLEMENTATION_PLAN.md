# Supabase Integration Rebuild Plan

**Priority Order:** Critical → High → Medium → Low

---

## PHASE 1: CRITICAL FIXES

### 1.1 Create .env.example File

**File:** `.env.example` (NEW)

```env
# Supabase Configuration (Required for cloud storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Override base URL (defaults based on NODE_ENV)
# NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

### 1.2 Fix Supabase Client Null Handling

**File:** `lib/supabase.ts`

**Current Issue:** Creates a placeholder client that silently fails.

**New Implementation:**
```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

// Only create client when properly configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

// Helper to get client with error if not configured
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }
  return supabase;
}

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '⚠️  Supabase not configured. Using localStorage fallback.\n' +
    'To enable Supabase, copy .env.example to .env.local and add your credentials.'
  );
}
```

---

### 1.3 Fix Auth Functions for Null Client

**File:** `lib/auth.ts`

**Changes:**
```typescript
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { User, UserType } from './types';
import { getBaseUrl } from './env';

function mapSupabaseUser(u: any): User | null {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email!,
    name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
    userType: u.user_metadata?.userType || 'user',
    createdAt: u.created_at,
  };
}

export async function signup(name: string, email: string, userType: UserType): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: { name, userType },
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
}

export async function login(email: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
}

export async function logout(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error logging out:', error);
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return mapSupabaseUser(user);
}
```

---

### 1.4 Create Auth Callback Handler

**File:** `app/auth/callback/page.tsx` (NEW)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) {
        setError('Supabase is not configured');
        return;
      }

      // Get the code from URL (Supabase PKCE flow)
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setError(errorDescription || errorParam);
        return;
      }

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          // Successful auth - redirect to dashboard
          router.replace('/dashboard');
        } catch (err: any) {
          setError(err.message || 'Authentication failed');
        }
      } else {
        // No code - might be hash-based callback (older flow)
        // Check if there's a session already
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/dashboard');
        } else {
          setError('No authentication code found');
        }
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">인증 오류</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg"
          >
            다시 로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
```

---

### 1.5 Update Schema with Contributor ID and Secure RPC

**File:** `supabase/schema.sql`

**Key Changes:**

```sql
-- *** CONTRIBUTIONS TABLE (Updated) ***
create table public.contributions (
  id text not null primary key,
  funding_id text not null references public.fundings(id) on delete cascade,
  contributor_id uuid references auth.users(id),  -- NEW: Track authenticated users
  contributor_name text not null,
  amount numeric not null check (amount > 0),     -- NEW: Ensure positive amounts
  message text,
  is_anonymous boolean default false,
  payment_method text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster lookups
create index idx_contributions_funding_id on contributions(funding_id);
create index idx_contributions_contributor_id on contributions(contributor_id);

-- *** SECURE RPC FUNCTION (Updated) ***
create or replace function increment_funding_amount(
  p_funding_id text,
  p_amount_to_add numeric
)
returns void
language plpgsql
security definer
as $$
begin
  -- Validate amount is positive
  if p_amount_to_add <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  -- Validate amount is reasonable (max 10 million KRW per contribution)
  if p_amount_to_add > 10000000 then
    raise exception 'Amount exceeds maximum allowed';
  end if;

  -- Update with existence check
  update public.fundings
  set current_amount = current_amount + p_amount_to_add
  where id = p_funding_id;

  if not found then
    raise exception 'Funding not found: %', p_funding_id;
  end if;
end;
$$;
```

---

### 1.6 Update Storage to Track Contributor ID

**File:** `lib/storage/supabase.ts`

**Changes to `addContribution`:**
```typescript
async addContribution(contribution: Contribution, userId?: string): Promise<void> {
  const dbPayload = {
    ...mapContributionToDB(contribution),
    contributor_id: userId || null,  // Track the authenticated user
  };

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
```

**Changes to `getFundingsByContributor`:**
```typescript
async getFundingsByContributor(userId: string): Promise<{ funding: Funding; contribution: Contribution }[]> {
  // Now search by contributor_id instead of name
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
```

---

## PHASE 2: SECURITY & RELIABILITY

### 2.1 Add Zod Validation Schemas

**File:** `lib/validation.ts` (NEW)

```typescript
import { z } from 'zod';

export const emailSchema = z.string().email('유효한 이메일을 입력하세요');

export const fundingSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(100, '제목이 너무 깁니다'),
  recipientName: z.string().min(1, '받는 분 이름을 입력하세요').max(50),
  occasion: z.enum(['birthday', 'wedding', 'graduation', 'baby', 'housewarming', 'retirement', 'other']),
  customOccasion: z.string().max(50).optional(),
  targetAmount: z.number().min(10000, '최소 금액은 10,000원입니다').max(100000000, '최대 금액을 초과했습니다'),
  deadline: z.string().refine((date) => new Date(date) > new Date(), '마감일은 미래 날짜여야 합니다'),
  coverImage: z.string().url().optional().or(z.literal('')),
  giftCandidates: z.array(z.object({
    id: z.string(),
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    link: z.string().url().optional().or(z.literal('')),
    price: z.number().min(0).optional(),
  })),
});

export const contributionSchema = z.object({
  contributorName: z.string().min(1, '이름을 입력하세요').max(50),
  amount: z.number().min(1000, '최소 금액은 1,000원입니다').max(10000000, '최대 금액을 초과했습니다'),
  message: z.string().max(500, '메시지가 너무 깁니다').optional(),
  paymentMethod: z.enum(['card', 'account', 'pay']),
  isAnonymous: z.boolean(),
});
```

---

### 2.2 Add Error Boundary Component

**File:** `components/ErrorBoundary.tsx` (NEW)

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-bold text-red-600 mb-2">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-4">페이지를 새로고침해 주세요.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

### 2.3 Add Loading Skeleton

**File:** `components/LoadingSkeleton.tsx` (NEW)

```typescript
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function FundingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <LoadingSkeleton className="h-40 w-full mb-4" />
      <LoadingSkeleton className="h-6 w-3/4 mb-2" />
      <LoadingSkeleton className="h-4 w-1/2 mb-4" />
      <LoadingSkeleton className="h-2 w-full mb-2" />
      <LoadingSkeleton className="h-4 w-1/3" />
    </div>
  );
}

export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
        <p className="text-gray-500">로딩 중...</p>
      </div>
    </div>
  );
}
```

---

## PHASE 3: FEATURES & PERFORMANCE

### 3.1 Implement Supabase Realtime Subscriptions

**File:** `hooks/useRealtimeFunding.ts` (NEW)

```typescript
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Funding, Contribution } from '@/lib/types';
import { smartStorage } from '@/lib/storage';

export function useRealtimeFunding(fundingId: string) {
  const [funding, setFunding] = useState<Funding | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const loadData = async () => {
      const [f, c] = await Promise.all([
        smartStorage.getFunding(fundingId),
        smartStorage.getContributions(fundingId),
      ]);
      setFunding(f);
      setContributions(c);
      setLoading(false);
    };
    loadData();

    // Set up realtime subscription if Supabase is configured
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel(`funding:${fundingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fundings',
          filter: `id=eq.${fundingId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            // Map and update funding
            loadData(); // Refetch for simplicity
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contributions',
          filter: `funding_id=eq.${fundingId}`,
        },
        () => {
          loadData(); // Refetch contributions
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fundingId]);

  return { funding, contributions, loading };
}
```

---

## PHASE 4: COMPLETE UPDATED SCHEMA

**File:** `supabase/schema.sql` (FULL REPLACEMENT)

```sql
-- Gift Fundraiser Database Schema
-- Version: 2.0.0
-- Last Updated: 2026-01-30

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE (User Data)
-- =============================================
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text not null,
  name text not null,
  user_type text default 'user' check (user_type in ('user', 'host')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone." on profiles;
create policy "Profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- =============================================
-- 2. FUNDINGS TABLE
-- =============================================
drop table if exists public.contributions cascade;
drop table if exists public.fundings cascade;

create table public.fundings (
  id text not null primary key,
  host_id uuid not null references public.profiles(id) on delete cascade,
  host_name text not null,
  title text not null,
  recipient_name text not null,
  occasion text not null check (occasion in ('birthday', 'wedding', 'graduation', 'baby', 'housewarming', 'retirement', 'other')),
  custom_occasion text,
  target_amount numeric not null check (target_amount > 0),
  current_amount numeric default 0 check (current_amount >= 0),
  deadline timestamp with time zone not null,
  cover_image text,
  gift_candidates jsonb default '[]'::jsonb,
  transparency_settings jsonb default '{"showAmounts": true, "showNames": true, "showGoal": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active' check (status in ('active', 'completed', 'cancelled'))
);

alter table public.fundings enable row level security;

create policy "Fundings are viewable by everyone." on fundings
  for select using (true);

create policy "Hosts can insert fundings." on fundings
  for insert with check (auth.uid() = host_id);

create policy "Hosts can update their fundings." on fundings
  for update using (auth.uid() = host_id);

-- Indexes for performance
create index idx_fundings_host_id on fundings(host_id);
create index idx_fundings_status on fundings(status);
create index idx_fundings_deadline on fundings(deadline);

-- =============================================
-- 3. CONTRIBUTIONS TABLE
-- =============================================
create table public.contributions (
  id text not null primary key,
  funding_id text not null references public.fundings(id) on delete cascade,
  contributor_id uuid references auth.users(id),
  contributor_name text not null,
  amount numeric not null check (amount > 0 and amount <= 10000000),
  message text,
  is_anonymous boolean default false,
  payment_method text not null check (payment_method in ('card', 'account', 'pay')),
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contributions enable row level security;

create policy "Contributions are viewable by everyone." on contributions
  for select using (true);

create policy "Anyone can insert contributions." on contributions
  for insert with check (true);

-- Indexes for performance
create index idx_contributions_funding_id on contributions(funding_id);
create index idx_contributions_contributor_id on contributions(contributor_id);

-- =============================================
-- 4. FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, user_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'userType', 'user')
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, profiles.name),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Secure atomic increment function for contributions
create or replace function increment_funding_amount(
  p_funding_id text,
  p_amount_to_add numeric
)
returns void
language plpgsql
security definer
as $$
declare
  v_funding_exists boolean;
begin
  -- Validate amount is positive
  if p_amount_to_add <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  -- Validate amount is within bounds
  if p_amount_to_add > 10000000 then
    raise exception 'Amount exceeds maximum allowed (10,000,000 KRW)';
  end if;

  -- Update with existence check
  update public.fundings
  set
    current_amount = current_amount + p_amount_to_add,
    updated_at = now()
  where id = p_funding_id
  returning true into v_funding_exists;

  if v_funding_exists is null then
    raise exception 'Funding not found: %', p_funding_id;
  end if;
end;
$$;

-- Auto-update timestamp function
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers
drop trigger if exists fundings_updated_at on fundings;
create trigger fundings_updated_at
  before update on fundings
  for each row execute procedure update_updated_at();

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

-- =============================================
-- 5. ENABLE REALTIME
-- =============================================
alter publication supabase_realtime add table fundings;
alter publication supabase_realtime add table contributions;

-- =============================================
-- 6. BACKFILL EXISTING USERS
-- =============================================
insert into public.profiles (id, email, name, user_type)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  coalesce(raw_user_meta_data->>'userType', 'user')
from auth.users
on conflict (id) do nothing;
```

---

## FILES TO CREATE/MODIFY SUMMARY

| File | Action | Priority |
|------|--------|----------|
| `.env.example` | CREATE | Critical |
| `lib/supabase.ts` | MODIFY | Critical |
| `lib/auth.ts` | MODIFY | Critical |
| `app/auth/callback/page.tsx` | CREATE | Critical |
| `supabase/schema.sql` | REPLACE | Critical |
| `lib/storage/supabase.ts` | MODIFY | Critical |
| `lib/storage/interface.ts` | MODIFY | High |
| `lib/validation.ts` | CREATE | High |
| `components/ErrorBoundary.tsx` | CREATE | High |
| `components/LoadingSkeleton.tsx` | CREATE | High |
| `contexts/AuthContext.tsx` | MODIFY | High |
| `hooks/useRealtimeFunding.ts` | CREATE | Medium |

---

## TESTING CHECKLIST

After implementing changes:

1. **Without Supabase (localStorage mode)**
   - [ ] App loads without errors
   - [ ] Can create fundings
   - [ ] Can contribute
   - [ ] Dashboard shows data

2. **With Supabase**
   - [ ] Environment variables load correctly
   - [ ] Magic link signup works
   - [ ] Auth callback redirects properly
   - [ ] Can create fundings (saved to DB)
   - [ ] Can contribute (contribution tracked)
   - [ ] RLS policies enforce correctly
   - [ ] Realtime updates work

3. **Edge Cases**
   - [ ] Expired magic links show error
   - [ ] Invalid amounts rejected
   - [ ] Network errors handled gracefully
