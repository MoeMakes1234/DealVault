-- ============================================================
-- DealVault database schema
-- Paste this whole file into Supabase → SQL Editor → New query → Run
-- Safe to run once. It creates tables + row-level security so each
-- user only ever sees their own data.
-- ============================================================

-- DEALS
create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  address text not null,
  acquisition_price numeric default 0,
  budget numeric default 0,
  spent numeric default 0,
  status text default 'planning',
  pipeline_stage text default 'prospecting',
  expected_profit numeric default 0,
  sale_target numeric,
  start_date text,
  target_completion_date text,
  notes text,
  project_type text default 'flip',
  photos jsonb default '[]',
  units jsonb default '[]',
  created_at timestamptz default now()
);

-- CONTRACTORS
create table if not exists contractors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  trade text,
  phone text,
  email text,
  rating numeric default 5,
  deal_id uuid,
  total_paid numeric default 0,
  status text default 'active',
  created_at timestamptz default now()
);

-- DOCUMENTS
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text default 'other',
  deal_id uuid,
  date_added text,
  notes text,
  created_at timestamptz default now()
);

-- TASKS
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null,
  title text not null,
  status text default 'pending',
  due_date text,
  created_at timestamptz default now()
);

-- BUDGET ITEMS
create table if not exists budget_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null,
  category text default 'other',
  label text,
  budgeted numeric default 0,
  spent numeric default 0,
  created_at timestamptz default now()
);

-- INVESTORS (capital stack)
create table if not exists investors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null,
  name text not null,
  type text default 'equity',
  amount numeric default 0,
  ownership_pct numeric,
  preferred_return numeric,
  interest_rate numeric,
  lender_type text,
  created_at timestamptz default now()
);

-- SAVED ANALYSES
create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  address text not null,
  type text default 'flip',
  purchase_price numeric default 0,
  rehab_budget numeric default 0,
  arv numeric default 0,
  monthly_rent numeric,
  monthly_expenses numeric,
  down_payment numeric,
  date_added text,
  converted boolean default false,
  created_at timestamptz default now()
);

-- SETTINGS (one row per user)
create table if not exists settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  company_name text default '',
  full_name text default '',
  email text default '',
  currency text default 'USD',
  default_rehab_buffer numeric default 15,
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security: each user sees only their own rows
-- ============================================================
alter table deals enable row level security;
alter table contractors enable row level security;
alter table documents enable row level security;
alter table tasks enable row level security;
alter table budget_items enable row level security;
alter table investors enable row level security;
alter table analyses enable row level security;
alter table settings enable row level security;

-- Policy helper: create the same 4 policies for each table
do $$
declare t text;
begin
  foreach t in array array['deals','contractors','documents','tasks','budget_items','investors','analyses']
  loop
    execute format('drop policy if exists "own_select" on %I;', t);
    execute format('drop policy if exists "own_insert" on %I;', t);
    execute format('drop policy if exists "own_update" on %I;', t);
    execute format('drop policy if exists "own_delete" on %I;', t);
    execute format('create policy "own_select" on %I for select using (auth.uid() = user_id);', t);
    execute format('create policy "own_insert" on %I for insert with check (auth.uid() = user_id);', t);
    execute format('create policy "own_update" on %I for update using (auth.uid() = user_id);', t);
    execute format('create policy "own_delete" on %I for delete using (auth.uid() = user_id);', t);
  end loop;
end $$;

-- settings uses user_id as PK (same policies)
drop policy if exists "own_select" on settings;
drop policy if exists "own_insert" on settings;
drop policy if exists "own_update" on settings;
create policy "own_select" on settings for select using (auth.uid() = user_id);
create policy "own_insert" on settings for insert with check (auth.uid() = user_id);
create policy "own_update" on settings for update using (auth.uid() = user_id);
