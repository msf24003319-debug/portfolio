-- Run in the Supabase SQL editor. Includes the image column for existing databases.
begin;
alter table public.projects add column if not exists image_url text
  check (image_url is null or (length(image_url) <= 2048 and image_url ~* '^https?://'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists project_images_admin_insert on storage.objects;
create policy project_images_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'project-images' and (select auth.uid()) is not null
    and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');

drop policy if exists project_images_admin_select on storage.objects;
create policy project_images_admin_select on storage.objects for select to authenticated
  using (bucket_id = 'project-images' and (select auth.uid()) is not null
    and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');

drop policy if exists project_images_admin_delete on storage.objects;
create policy project_images_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'project-images' and (select auth.uid()) is not null
    and (select auth.jwt())->'app_metadata'->>'portfolio_admin' = 'true');
commit;
