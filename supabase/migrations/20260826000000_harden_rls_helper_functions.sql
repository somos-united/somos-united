-- =============================================================================
-- Harden RLS helper functions: move current_role/is_admin/has_permission and
-- the signup trigger handle_new_user out of `public` into a `private` schema.
--
-- Why: Supabase/PostgREST auto-exposes every function in the `public` schema
-- as a callable REST endpoint (`/rest/v1/rpc/<fn>`). These four were only
-- ever meant to be called from inside RLS policy expressions, not directly
-- by clients. Not actually exploitable as written (they all key off
-- auth.uid(), so an anonymous caller gets nothing back), but Supabase's own
-- security advisor flags the exposure and the private schema is the correct
-- fix per Supabase's docs — RLS policies still work identically (EXECUTE
-- stays granted to PUBLIC by default; PostgREST just doesn't expose schemas
-- outside its "exposed schemas" list, which is `public` only by default).
-- =============================================================================

create schema if not exists private;

-- Drop the trigger and every RLS policy that references the functions being
-- moved, so the functions can be dropped without a dependency error.

drop trigger on_auth_user_created on auth.users;

drop policy profiles_all_admin_users on public.profiles;
drop policy children_select_trainer on public.children;
drop policy children_all_admin_crm on public.children;
drop policy payroll_statements_all_finance on public.payroll_statements;
drop policy trainer_notes_select_trainer on public.trainer_notes;
drop policy trainer_pay_rates_all_users on public.trainer_pay_rates;
drop policy trainer_pay_rates_select_finance on public.trainer_pay_rates;
drop policy trainer_documents_all_users on public.trainer_documents;
drop policy bookings_all_crm on public.bookings;
drop policy bookings_select_finance on public.bookings;
drop policy email_messages_all_crm on public.email_messages;
drop policy app_settings_select_admin on public.app_settings;
drop policy app_settings_insert_finance on public.app_settings;
drop policy app_settings_update_finance on public.app_settings;
drop policy app_settings_delete_finance on public.app_settings;

drop function public.handle_new_user();
drop function public.current_role();
drop function public.is_admin();
drop function public.has_permission(text);

-- Recreate in `private` — identical bodies, new location.

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'client')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();

create function private.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'superuser')
  );
$$;

create function private.has_permission(perm text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (
        role = 'superuser'
        or (role = 'admin' and perm = any(permissions))
      )
  );
$$;

-- Recreate the policies, now calling private.* instead of public.*.

create policy profiles_all_admin_users on public.profiles
  for all
  using (private.has_permission('users'))
  with check (private.has_permission('users'));

create policy children_select_trainer on public.children
  for select
  using (
    private.current_role() = 'trainer'
    and exists (
      select 1
      from public.bookings b
      join public.trainer_assignments ta on ta.course_instance_id = b.course_instance_id
      where b.child_id = children.id and ta.trainer_id = auth.uid()
    )
  );

create policy children_all_admin_crm on public.children
  for all
  using (private.has_permission('crm'))
  with check (private.has_permission('crm'));

create policy payroll_statements_all_finance on public.payroll_statements
  for all
  using (private.has_permission('finance'))
  with check (private.has_permission('finance'));

create policy trainer_notes_select_trainer on public.trainer_notes
  for select
  using (private.current_role() = 'trainer');

create policy trainer_pay_rates_all_users on public.trainer_pay_rates
  for all
  using (private.has_permission('users'))
  with check (private.has_permission('users'));

create policy trainer_pay_rates_select_finance on public.trainer_pay_rates
  for select
  using (private.has_permission('finance'));

create policy trainer_documents_all_users on public.trainer_documents
  for all
  using (private.has_permission('users'))
  with check (private.has_permission('users'));

create policy bookings_all_crm on public.bookings
  for all
  using (private.has_permission('crm'))
  with check (private.has_permission('crm'));

create policy bookings_select_finance on public.bookings
  for select
  using (private.has_permission('finance'));

create policy email_messages_all_crm on public.email_messages
  for all
  using (private.has_permission('crm'))
  with check (private.has_permission('crm'));

create policy app_settings_select_admin on public.app_settings
  for select
  using (private.is_admin());

create policy app_settings_insert_finance on public.app_settings
  for insert
  with check (private.has_permission('finance'));

create policy app_settings_update_finance on public.app_settings
  for update
  using (private.has_permission('finance'))
  with check (private.has_permission('finance'));

create policy app_settings_delete_finance on public.app_settings
  for delete
  using (private.has_permission('finance'));
