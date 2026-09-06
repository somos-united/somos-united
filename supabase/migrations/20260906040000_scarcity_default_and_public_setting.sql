-- Per 03-DATA-MODEL.md, course_series.scarcity_seats_threshold being null
-- means "use the global default from app_settings" -- that default was
-- never actually seeded until now (the booking page's placeholder copy
-- hardcoded 5 directly, which is exactly what this table exists to avoid).
insert into public.app_settings (key, value, description)
values (
  'scarcity_seats_threshold_default',
  '5'::jsonb,
  'Default "only X spots left" scarcity-pill threshold (05-MODULE-BOOKING.md §6) used when a course_series does not set its own scarcity_seats_threshold.'
)
on conflict (key) do nothing;

-- app_settings is otherwise admin/finance-only (payroll rates, etc. live
-- here too) -- rather than a blanket public SELECT policy on the whole
-- table, expose just this one already-public-facing value via a narrow
-- security-definer function, same reasoning as locations_public.
create or replace function public.get_scarcity_seats_threshold_default()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((value)::integer, 5)
  from public.app_settings
  where key = 'scarcity_seats_threshold_default';
$$;

revoke execute on function public.get_scarcity_seats_threshold_default() from public;
grant execute on function public.get_scarcity_seats_threshold_default() to anon, authenticated;
