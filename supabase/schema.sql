-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- *** 1. PROFILES Table (User Data) ***
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  name text,
  user_type text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );


-- *** 2. FUNDINGS Table ***
-- We drop to ensure schema correctness (fixing potential host_id type mismatch)
drop table if exists public.contributions cascade;
drop table if exists public.fundings cascade;

create table public.fundings (
  id text not null primary key,
  host_id uuid not null references public.profiles(id),
  host_name text not null,
  title text not null,
  recipient_name text not null,
  occasion text not null,
  custom_occasion text,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline timestamp with time zone not null,
  cover_image text,
  gift_candidates jsonb default '[]'::jsonb,
  transparency_settings jsonb default '{"showAmounts": true, "showNames": true, "showGoal": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active'
);

alter table public.fundings enable row level security;

create policy "Fundings are viewable by everyone." on fundings for select using ( true );
create policy "Hosts can insert fundings." on fundings for insert with check ( auth.uid() = host_id );
create policy "Hosts can update their fundings." on fundings for update using ( auth.uid() = host_id );


-- *** 3. CONTRIBUTIONS Table ***
create table public.contributions (
  id text not null primary key,
  funding_id text not null references public.fundings(id) on delete cascade,
  contributor_name text not null,
  amount numeric not null,
  message text,
  is_anonymous boolean default false,
  payment_method text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contributions enable row level security;

create policy "Contributions are viewable by everyone." on contributions for select using ( true );
create policy "Anyone can insert contributions." on contributions for insert with check ( true );


-- *** 4. TRIGGERS & FUNCTIONS ***

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
    new.raw_user_meta_data->>'name',
    coalesce(new.raw_user_meta_data->>'userType', 'user')
  )
  on conflict (id) do nothing; -- Prevent error if profile exists
  return new;
end;
$$;

-- Trigger: safely drop (if exists) before creating to avoid errors or duplication issues if not handled by OR REPLACE
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atomic increment function for contributions
create or replace function increment_funding_amount(funding_id text, amount_to_add numeric)
returns void
language plpgsql
security definer
as $$
begin
  update public.fundings
  set current_amount = current_amount + amount_to_add
  where id = funding_id;
end;
$$;

-- *** 5. BACKFILL DATA ***
-- Insert profiles for existing users who might have signed up before the trigger was created
insert into public.profiles (id, email, name, user_type)
select 
  id, 
  email, 
  raw_user_meta_data->>'name',
  coalesce(raw_user_meta_data->>'userType', 'user')
from auth.users
on conflict (id) do nothing;

