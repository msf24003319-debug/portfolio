-- Run in the Supabase SQL editor for both new and existing installations.
begin;
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null check (length(trim(degree)) between 1 and 120),
  institution text not null check (length(trim(institution)) between 1 and 120),
  duration text not null check (length(trim(duration)) between 1 and 100),
  description text not null default '' check (length(description) <= 3000),
  order_id integer not null default 0 check (order_id between 0 and 10000)
);
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 120),
  issuer text not null check (length(trim(issuer)) between 1 and 120),
  duration text not null check (length(trim(duration)) between 1 and 100),
  description text not null default '' check (length(description) <= 3000),
  link text check (link is null or (length(link) <= 2048 and link ~* '^https?://')),
  order_id integer not null default 0 check (order_id between 0 and 10000)
);
create index if not exists education_order_idx on public.education(order_id, id);
alter table public.education enable row level security;
revoke all on public.education from anon, authenticated;
grant select on public.education to anon, authenticated;
grant insert, update, delete on public.education to authenticated;
drop policy if exists education_public_read on public.education;
create policy education_public_read on public.education for select to anon, authenticated using (true);
drop policy if exists education_admin_insert on public.education;
create policy education_admin_insert on public.education for insert to authenticated with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
drop policy if exists education_admin_update on public.education;
create policy education_admin_update on public.education for update to authenticated using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true') with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
drop policy if exists education_admin_delete on public.education;
create policy education_admin_delete on public.education for delete to authenticated using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
create index if not exists certificates_order_idx on public.certificates(order_id, id);
alter table public.certificates enable row level security;
revoke all on public.certificates from anon, authenticated;
grant select on public.certificates to anon, authenticated;
grant insert, update, delete on public.certificates to authenticated;
drop policy if exists certificates_public_read on public.certificates;
create policy certificates_public_read on public.certificates for select to anon, authenticated using (true);
drop policy if exists certificates_admin_insert on public.certificates;
create policy certificates_admin_insert on public.certificates for insert to authenticated with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
drop policy if exists certificates_admin_update on public.certificates;
create policy certificates_admin_update on public.certificates for update to authenticated using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true') with check ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
drop policy if exists certificates_admin_delete on public.certificates;
create policy certificates_admin_delete on public.certificates for delete to authenticated using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
-- Preserve the education already displayed on the site; reruns keep admin edits.
insert into public.education (id, degree, institution, duration, order_id) values
('30000000-0000-4000-8000-000000000001', 'Master of Computer Science', 'University of Education', '2026', 0),
('30000000-0000-4000-8000-000000000002', 'BS Computer Science', 'COMSATS', '2024', 1)
on conflict (id) do nothing;
commit;
