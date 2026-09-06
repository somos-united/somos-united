-- Backs the new /team admin page. profiles has no email column (it lives
-- only in auth.users, not exposed via PostgREST), so listing/updating team
-- members needs security-definer RPCs the same way email_is_approved_admin
-- does. Unlike that function, these are safe to grant to `authenticated`
-- broadly because the authorization check happens INSIDE the function body
-- on every call (via private.has_permission('users'), the same granular
-- permission profiles_all_admin_users already requires — "users" is
-- deliberately separate from base admin/superuser role per
-- 00-MASTER-PLAN.md's Rollenmodell, so plain admins can't manage other
-- users' roles unless explicitly granted that permission too).
create or replace function public.list_team_members()
returns table (id uuid, email text, role text, permissions text[], created_at timestamptz)
language plpgsql
stable
security definer
set search_path = public, auth
as $$
begin
  if not private.has_permission('users') then
    raise exception 'insufficient_privilege' using errcode = '42501';
  end if;

  return query
    select p.id, u.email, p.role, p.permissions, p.created_at
    from public.profiles p
    join auth.users u on u.id = p.id
    order by u.email;
end;
$$;

revoke execute on function public.list_team_members() from public;
grant execute on function public.list_team_members() to authenticated;

create or replace function public.update_team_member_role(target_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not private.has_permission('users') then
    raise exception 'insufficient_privilege' using errcode = '42501';
  end if;

  if new_role not in ('client', 'trainer', 'admin', 'superuser') then
    raise exception 'invalid_role: %', new_role;
  end if;

  update public.profiles set role = new_role where id = target_id;
end;
$$;

revoke execute on function public.update_team_member_role(uuid, text) from public;
grant execute on function public.update_team_member_role(uuid, text) to authenticated;
