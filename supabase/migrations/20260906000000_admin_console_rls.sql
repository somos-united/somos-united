-- Admin console RLS: locations/course_series/course_instances/price_tiers
-- had RLS enabled since init_schema but no policies at all, so nobody
-- (not even an admin) could read or write them via the API. These four
-- tables are core operational data, not one of the granular admin:crm/
-- admin:finance/admin:users buckets (00-MASTER-PLAN.md §"Rollenmodell"),
-- so gate on private.is_admin() (role admin|superuser) rather than a new
-- has_permission() scope.

create policy "locations_all_admin"
  on public.locations
  for all
  using (private.is_admin())
  with check (private.is_admin());

create policy "course_series_all_admin"
  on public.course_series
  for all
  using (private.is_admin())
  with check (private.is_admin());

create policy "course_instances_all_admin"
  on public.course_instances
  for all
  using (private.is_admin())
  with check (private.is_admin());

create policy "price_tiers_all_admin"
  on public.price_tiers
  for all
  using (private.is_admin())
  with check (private.is_admin());
