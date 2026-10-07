-- Run in the Supabase SQL editor. Safe to rerun for this fresh project's schema.
begin;
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 120),
  description text not null check (length(trim(description)) between 1 and 3000),
  tech_stack text[] not null default '{}' check (cardinality(tech_stack) between 1 and 20),
  link text check (link is null or (length(link) <= 2048 and link ~* '^https?://')),
  created_at timestamptz not null default now()
);
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null check (length(trim(role)) between 1 and 120),
  company text not null check (length(trim(company)) between 1 and 120),
  duration text not null check (length(trim(duration)) between 1 and 100),
  description text not null check (length(trim(description)) between 1 and 3000),
  order_id integer not null default 0 check (order_id between 0 and 10000)
);
create index if not exists projects_created_at_idx on public.projects(created_at desc, id);
create index if not exists experience_order_idx on public.experience(order_id, id);
alter table public.projects enable row level security;
alter table public.experience enable row level security;

-- Authenticated is necessary, but only the designated admin can mutate data.
-- app_metadata is controlled by the Auth administrator, never by user sign-up data.
grant usage on schema public to anon, authenticated;
revoke all on public.projects, public.experience from anon, authenticated;
grant select on public.projects, public.experience to anon, authenticated;
grant insert, update, delete on public.projects, public.experience to authenticated;

drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects for select to anon, authenticated using (true);
drop policy if exists projects_admin_insert on public.projects;
create policy projects_admin_insert on public.projects for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
drop policy if exists projects_admin_update on public.projects;
create policy projects_admin_update on public.projects for update to authenticated
  using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true')
  with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
drop policy if exists projects_admin_delete on public.projects;
create policy projects_admin_delete on public.projects for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');

drop policy if exists experience_public_read on public.experience;
create policy experience_public_read on public.experience for select to anon, authenticated using (true);
drop policy if exists experience_admin_insert on public.experience;
create policy experience_admin_insert on public.experience for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
drop policy if exists experience_admin_update on public.experience;
create policy experience_admin_update on public.experience for update to authenticated
  using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true')
  with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
drop policy if exists experience_admin_delete on public.experience;
create policy experience_admin_delete on public.experience for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
commit;
