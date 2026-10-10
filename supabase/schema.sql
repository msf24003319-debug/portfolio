-- Run in the Supabase SQL editor. Safe to rerun for this fresh project's schema.
-- Customer feedback: visitors can submit and read; only the admin can delete.
begin;
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 80),
  message text not null check (length(trim(message)) between 10 and 1500),
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);
create index if not exists feedback_created_at_idx on public.feedback(created_at desc, id);
alter table public.feedback enable row level security;
grant usage on schema public to anon, authenticated;
revoke all on public.feedback from anon, authenticated;
grant select on public.feedback to anon, authenticated;
grant insert (name, message, rating) on public.feedback to anon, authenticated;
grant delete on public.feedback to authenticated;
drop policy if exists feedback_public_read on public.feedback;
create policy feedback_public_read on public.feedback for select to anon, authenticated using (true);
drop policy if exists feedback_public_insert on public.feedback;
create policy feedback_public_insert on public.feedback for insert to anon, authenticated with check (true);
drop policy if exists feedback_admin_delete on public.feedback;
create policy feedback_admin_delete on public.feedback for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
commit;

begin;
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 120),
  description text not null check (length(trim(description)) between 1 and 3000),
  tech_stack text[] not null default '{}' check (cardinality(tech_stack) between 1 and 20),
  link text check (link is null or (length(link) <= 2048 and link ~* '^https?://')),
  created_at timestamptz not null default now()
);
-- Also upgrades existing projects tables when this schema is rerun.
alter table public.projects add column if not exists image_url text
  check (image_url is null or (length(image_url) <= 2048 and image_url ~* '^https?://'));
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

-- Education and certificates are also installed for fresh databases.
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
