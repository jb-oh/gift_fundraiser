-- Gift Fundraiser Database Schema
-- Version: 2.0.0 (Phase 1 Critical Fixes)
-- Last Updated: 2026-01-30

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE (User Data)
-- =============================================
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  name text,
  user_type text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );


-- =============================================
-- 2. FUNDINGS TABLE
-- =============================================
drop table if exists public.contributions cascade;
drop table if exists public.fundings cascade;

create table public.fundings (
  id text not null primary key,
  host_id uuid not null references public.profiles(id),
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

create policy "Fundings are viewable by everyone." on fundings for select using ( true );
create policy "Hosts can insert fundings." on fundings for insert with check ( auth.uid() = host_id );
create policy "Hosts can update their fundings." on fundings for update using ( auth.uid() = host_id );

-- Indexes for fundings table
create index if not exists idx_fundings_host_id on fundings(host_id);
create index if not exists idx_fundings_status on fundings(status);
create index if not exists idx_fundings_deadline on fundings(deadline);


-- =============================================
-- 3. CONTRIBUTIONS TABLE
-- =============================================
create table public.contributions (
  id text not null primary key,
  funding_id text not null references public.fundings(id) on delete cascade,
  contributor_id uuid references auth.users(id),  -- Track authenticated contributor
  contributor_name text not null,
  amount numeric not null check (amount > 0 and amount <= 10000000),  -- Max 10 million KRW
  message text,
  is_anonymous boolean default false,
  payment_method text not null check (payment_method in ('card', 'account', 'pay')),
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contributions enable row level security;

create policy "Contributions are viewable by everyone." on contributions for select using ( true );
create policy "Anyone can insert contributions." on contributions for insert with check ( true );

-- Indexes for contributions table
create index if not exists idx_contributions_funding_id on contributions(funding_id);
create index if not exists idx_contributions_contributor_id on contributions(contributor_id);


-- =============================================
-- 4. TRIGGERS & FUNCTIONS
-- =============================================

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

-- Apply updated_at trigger to fundings
drop trigger if exists fundings_updated_at on fundings;
create trigger fundings_updated_at
  before update on fundings
  for each row execute procedure update_updated_at();

-- Apply updated_at trigger to profiles
drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

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
-- Uses p_ prefix for parameters to avoid column name conflicts
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

  -- Validate amount is within bounds (max 10 million KRW per contribution)
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


-- =============================================
-- 5. BACKFILL DATA
-- =============================================
-- Insert profiles for existing users who might have signed up before the trigger was created
insert into public.profiles (id, email, name, user_type)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  coalesce(raw_user_meta_data->>'userType', 'user')
from auth.users
on conflict (id) do nothing;
