-- Run once in the Supabase SQL editor for an existing portfolio database.
alter table public.projects
  add column if not exists image_url text
  check (image_url is null or (length(image_url) <= 2048 and image_url ~* '^https?://'));
