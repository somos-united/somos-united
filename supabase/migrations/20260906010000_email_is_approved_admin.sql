-- Lets the (unauthenticated) login page check "does this email already
-- have an approved admin account" before ever calling Supabase Auth's
-- signInWithOtp — so a stranger's email never gets a real account created
-- at all, while an already-promoted admin (any email domain, e.g. Danny's
-- own danny@neonstudio.ch) always keeps working. security definer to read
-- auth.users/profiles despite the caller having no session yet, same
-- pattern as private.is_admin()/has_permission() (20260826000000).
--
-- Only service_role may call this (see 20260906010000_lock_down below,
-- applied in the same session) — Postgres grants EXECUTE to PUBLIC by
-- default on new functions, which combined with an early anon/authenticated
-- grant would have let anyone holding the public anon key probe arbitrary
-- emails and learn who has admin access. The login server action uses a
-- service-role client for this specific call, never the anon-key client.
create or replace function public.email_is_approved_admin(email_to_check text)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users u
    join public.profiles p on p.id = u.id
    where lower(u.email) = lower(email_to_check)
      and p.role in ('admin', 'superuser')
  );
$$;

revoke execute on function public.email_is_approved_admin(text) from public;
revoke execute on function public.email_is_approved_admin(text) from anon, authenticated;
grant execute on function public.email_is_approved_admin(text) to service_role;
