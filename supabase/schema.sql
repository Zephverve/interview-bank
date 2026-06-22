-- 在 Supabase SQL Editor 中执行此脚本

create table if not exists public.user_banks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_banks enable row level security;

create policy "user_banks_select_own"
  on public.user_banks for select
  using (auth.uid() = user_id);

create policy "user_banks_insert_own"
  on public.user_banks for insert
  with check (auth.uid() = user_id);

create policy "user_banks_update_own"
  on public.user_banks for update
  using (auth.uid() = user_id);

create policy "user_banks_delete_own"
  on public.user_banks for delete
  using (auth.uid() = user_id);
