-- Public site needs to read course_series/course_instances/price_tiers to
-- render the booking page for anonymous visitors -- these tables only had
-- admin-only RLS policies (private.is_admin()) until now, so the public
-- site could never see anything an admin created. Browsing course dates
-- and prices is meant to be public, so a straightforward permissive
-- `using (true)` SELECT policy is correct here (Postgres OR's this with
-- the existing admin ALL policy, doesn't weaken it).
create policy "course_series_select_public"
  on public.course_series
  for select
  using (true);

create policy "course_instances_select_public"
  on public.course_instances
  for select
  using (true);

create policy "price_tiers_select_public"
  on public.price_tiers
  for select
  using (true);

-- locations is different: rent_amount_cents/rent_active/notes are
-- financial/internal fields that shouldn't be publicly queryable just
-- because the booking page needs to show a location's name/address. A
-- security_invoker=false view (Postgres default) runs with its owner's
-- privileges, so selecting from this view works for anon regardless of
-- the underlying table's admin-only RLS -- exposing only the columns
-- listed here, nothing else.
create view public.locations_public
with (security_invoker = false) as
  select id, name, address, lat, lng, capacity
  from public.locations;

grant select on public.locations_public to anon, authenticated;
