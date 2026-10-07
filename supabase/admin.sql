-- FIRST create your email/password user in Supabase Authentication > Users.
-- Confirm the correct user UUID there; replace the UUID below before running.
-- This grants admin access to exactly the chosen user, not all authenticated users.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"portfolio_admin":true}'::jsonb
where id = 'REPLACE_WITH_ADMIN_USER_UUID'::uuid;
-- Sign out and back in after changing metadata so the JWT contains this claim.
