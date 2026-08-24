-- =============================================================================
-- Somos United — Initial schema (Phase 0)
-- Source of truth: md/03-DATA-MODEL.md §2 (tables) and §3 (RLS examples).
-- Local migration file only — no live Supabase project has been provisioned
-- yet (see md/02-DEPLOYMENT.md §2/§8). This runs automatically on the first
-- real Staging deploy once the project exists.
--
-- Conventions used throughout:
--   * All monetary amounts are integer *_cents columns (Swiss Rappen-genau).
--   * "Freier Text statt starrem Enum" fields (per the doc's explicit wording,
--     e.g. rent_cycle, document_type, cadence_label) are plain `text`, no CHECK.
--   * Fields the doc gives a fixed pipe-separated set for (e.g. role, status)
--     get a `text` column + CHECK constraint — easiest to extend later via a
--     plain migration, still admin-editable data everywhere else (no
--     hardcoded business values per 00-MASTER-PLAN.md §0).
--   * Every table gets `ENABLE ROW LEVEL SECURITY` — deny-by-default
--     (01-ARCHITECTURE.md §3). Only the tables with concrete example
--     policies in 03-DATA-MODEL.md §3 get policies in this migration; every
--     other table is intentionally left with RLS on and zero policies
--     (nobody using the anon/authenticated role can read or write until a
--     later phase adds the relevant policy — the backend/service-role key
--     bypasses RLS entirely for admin-side operations in the meantime).
-- =============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- =============================================================================
-- Helper functions for RLS policies (SECURITY DEFINER so they can read
-- `profiles` without recursing into that table's own RLS policies).
-- =============================================================================

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
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

-- superuser = "technisch wie admin, aber alle Permissions fix vergeben"
-- (01-ARCHITECTURE.md §4.1) — always passes a permission check.
create or replace function public.has_permission(perm text)
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

-- =============================================================================
-- 2.1 Identität & Zugriff
-- =============================================================================

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  lat double precision,
  lng double precision,
  capacity integer,
  notes text,
  rent_amount_cents integer,
  rent_cycle text,
  rent_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- profiles: 1:1 zu auth.users. Auto-created via trigger below with role
-- 'client' as default (01-ARCHITECTURE.md §3).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'client'
    check (role in ('admin', 'superuser', 'trainer', 'client')),
  permissions text[] not null default '{}',
  location_id uuid references public.locations (id) on delete set null,
  is_kiosk boolean not null default false,
  locale_pref text,
  created_at timestamptz not null default now()
);

create table public.kiosk_devices (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  device_label text not null,
  last_seen_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 2.2 Familien & Kinder (Client-DB)
-- =============================================================================

create table public.families (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references auth.users (id) on delete set null,
  contact_name text not null,
  email text not null,
  phone text,
  address text,
  sms_opt_in boolean not null default false,
  newsletter_opt_in boolean not null default false,
  source text,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  anonymized_at timestamptz
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  first_name text not null,
  birth_year integer not null,
  allergies_notes text,
  general_notes text,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 2.3 Kurse, Serien, Preise & Buchungen
-- =============================================================================

create table public.course_series (
  id uuid primary key default gen_random_uuid(),
  module_ref text not null, -- Sanity `_id`
  location_id uuid references public.locations (id) on delete set null,
  cadence_label text,
  abo_enabled boolean not null default false,
  fomo_enabled boolean not null default true,
  scarcity_seats_threshold integer,
  renewal_upsell_label text,
  renewal_upsell_discount_pct numeric(5, 2),
  renewal_reminder_days_before integer,
  created_at timestamptz not null default now()
);

create table public.course_instances (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references public.course_series (id) on delete set null,
  sequence_index integer,
  module_ref text not null, -- Sanity `_id`
  location_id uuid references public.locations (id) on delete set null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  capacity integer not null,
  price_override_cents integer,
  created_at timestamptz not null default now()
);

create table public.price_tiers (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.course_series (id) on delete cascade,
  plan_type text not null check (plan_type in ('single', '6x', '12x', '24x')),
  days_before_min integer not null,
  days_before_max integer, -- nullable = open end ("Early Bird")
  price_cents integer not null,
  label text,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  child_id uuid references public.children (id) on delete set null,
  series_id uuid not null references public.course_series (id),
  plan_type text not null check (plan_type in ('6x', '12x', '24x')),
  purchase_date timestamptz not null default now(),
  price_paid_cents integer,
  stripe_payment_intent_id text,
  auto_renew boolean not null default true,
  renewal_reminder_sent_at timestamptz,
  cancelled_at timestamptz,
  renewed_into_subscription_id uuid references public.subscriptions (id),
  stripe_payment_method_id text,
  upsell_reward_label text,
  upsell_reward_fulfilled_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  course_instance_id uuid not null references public.course_instances (id),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'waitlist', 'cancelled')),
  subscription_id uuid references public.subscriptions (id) on delete set null,
  price_paid_cents integer,
  payment_status text,
  stripe_payment_intent_id text,
  legal_document_version text,
  cancellation_refund_pct numeric(5, 2),
  checkin_token text unique, -- random string, never the raw booking id (QR content)
  checked_in_at timestamptz,
  checked_in_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.trainer_assignments (
  id uuid primary key default gen_random_uuid(),
  course_instance_id uuid not null references public.course_instances (id) on delete cascade,
  trainer_id uuid not null references public.profiles (id) on delete cascade,
  role text, -- Haupt-/Co-Trainer
  reminder_sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (course_instance_id, trainer_id)
);

create table public.cancellation_policy_tiers (
  id uuid primary key default gen_random_uuid(),
  days_before_min integer not null,
  days_before_max integer, -- nullable = open end
  refund_percentage numeric(5, 2) not null,
  requires_doctor_note boolean not null default false,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.reminders_log (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete cascade,
  type text not null
    check (type in ('confirmation', 'reminder_10d', 'reminder_1d', 'abo_renewal_upsell')),
  sent_at timestamptz not null default now(),
  channel text not null check (channel in ('email', 'sms')),
  constraint reminders_log_exactly_one_target check (
    (booking_id is not null and subscription_id is null)
    or (booking_id is null and subscription_id is not null)
  )
);

-- =============================================================================
-- 2.4 Trainer-Dossier & Personaldossier (HR)
-- =============================================================================

create table public.trainers (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  emergency_contact text,
  -- IBAN access restricted at the RLS/application layer (see §3 policies on
  -- trainer_pay_rates for the sibling pay-rate data's access pattern);
  -- column-level encryption is an infra decision left to a later phase.
  iban text,
  created_at timestamptz not null default now()
);

create table public.trainer_pay_rates (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainers (profile_id) on delete cascade,
  pay_model text not null check (pay_model in ('hourly', 'monthly', 'per_course')),
  rate_cents integer not null,
  amount_type text not null check (amount_type in ('gross', 'net')),
  valid_from date not null,
  valid_to date, -- nullable = currently valid
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.payroll_deduction_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- e.g. AHV_IV_EO
  label text not null,
  amount_type text not null check (amount_type in ('percentage', 'fixed_amount')),
  percentage numeric(6, 4),
  amount_cents integer,
  valid_from date not null,
  valid_to date,
  active boolean not null default true,
  constraint payroll_deduction_types_exactly_one_amount check (
    (amount_type = 'percentage' and percentage is not null and amount_cents is null)
    or (amount_type = 'fixed_amount' and amount_cents is not null and percentage is null)
  )
);

create table public.trainer_documents (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainers (profile_id) on delete cascade,
  document_type text not null, -- free text, admin-definable (e.g. "Strafregisterauszug")
  file_url text,
  requested_at timestamptz not null default now(),
  received_at timestamptz,
  expires_at timestamptz,
  uploaded_by uuid references public.profiles (id) on delete set null
);

create table public.annual_tax_statements (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainers (profile_id) on delete cascade,
  year integer not null,
  pdf_url text,
  generated_at timestamptz,
  sent_at timestamptz
);

create table public.trainer_notes (
  id uuid primary key default gen_random_uuid(),
  author_trainer_id uuid not null references public.profiles (id) on delete cascade,
  child_id uuid references public.children (id) on delete cascade,
  course_instance_id uuid references public.course_instances (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),
  constraint trainer_notes_has_target check (child_id is not null or course_instance_id is not null)
);

create table public.timesheets (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainers (profile_id) on delete cascade,
  course_instance_id uuid references public.course_instances (id) on delete set null,
  date date not null,
  hours numeric(5, 2) not null,
  approved_by uuid references public.profiles (id) on delete set null,
  approved_at timestamptz
);

-- =============================================================================
-- 2.5 Finance (Admin-App)
-- =============================================================================

create table public.cost_centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  related_type text not null check (related_type in ('family', 'trainer', 'vendor')),
  related_id uuid not null,
  amount_cents integer not null,
  status text not null default 'draft',
  pdf_url text,
  due_date date,
  cost_center_id uuid references public.cost_centers (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references public.profiles (id) on delete set null,
  amount_cents integer not null,
  category text,
  receipt_url text,
  approved_by uuid references public.profiles (id) on delete set null,
  approved_at timestamptz,
  cost_center_id uuid references public.cost_centers (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.venue_rents (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  period text not null, -- e.g. YYYY-MM
  amount_cents integer not null,
  status text not null default 'pending',
  cost_center_id uuid references public.cost_centers (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.payroll_statements (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainers (profile_id) on delete cascade,
  period text not null, -- format YYYY-MM
  gross_amount_cents integer not null,
  deductions_json jsonb not null default '{}'::jsonb,
  net_amount_cents integer not null,
  pdf_url text,
  status text not null default 'draft' check (status in ('draft', 'released')),
  released_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payroll_line_items (
  id uuid primary key default gen_random_uuid(),
  payroll_statement_id uuid not null references public.payroll_statements (id) on delete cascade,
  description text not null,
  amount_cents integer not null,
  source_type text check (source_type in ('timesheet', 'course', 'manual')),
  source_id uuid
);

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  amount_cents integer not null,
  outcome text not null check (outcome in ('refunded', 'donated')),
  reason text,
  processed_by text, -- 'system' (self-service) or admin initials
  processed_at timestamptz not null default now()
);

-- =============================================================================
-- 2.6 CRM & Kommunikation
-- =============================================================================

create table public.sms_log (
  id uuid primary key default gen_random_uuid(),
  recipient_family_id uuid references public.families (id) on delete set null,
  campaign_id text,
  sent_at timestamptz not null default now(),
  status text
);

create table public.newsletter_log (
  id uuid primary key default gen_random_uuid(),
  recipient_family_id uuid references public.families (id) on delete set null,
  campaign_id text,
  sent_at timestamptz not null default now(),
  status text
);

create table public.crm_saved_filters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  filter_json jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.crm_notes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  author_admin_id uuid not null references public.profiles (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create table public.dashboard_metrics_cache (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('ga4', 'search_console')),
  metric_key text not null,
  metric_date date not null,
  value numeric,
  fetched_at timestamptz not null default now()
);

-- Generic key/value platform settings — deliberately schemaless (`value
-- jsonb`) so new settings never require a migration (03-DATA-MODEL.md §2.6).
create table public.app_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.email_messages (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families (id) on delete set null,
  direction text not null check (direction in ('inbound', 'outbound')),
  from_address text not null,
  to_address text not null,
  subject text,
  body_text text,
  body_html text,
  resend_id text,
  attachments_json jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  sent_at timestamptz,
  received_at timestamptz
);

-- =============================================================================
-- 2.7 Notion-Sync & Audit
-- =============================================================================

create table public.notion_sync_log (
  id uuid primary key default gen_random_uuid(),
  notion_page_id text not null,
  sanity_draft_id text,
  synced_at timestamptz not null default now(),
  status text,
  error_message text
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_table text not null,
  target_id text,
  accessed_at timestamptz not null default now()
);

-- =============================================================================
-- Indexes for the most common lookups (foreign keys used in RLS policies and
-- obvious hot paths). Not exhaustive — Phase 0 keeps this to what's clearly
-- needed already.
-- =============================================================================

create index families_profile_id_idx on public.families (profile_id);
create index children_family_id_idx on public.children (family_id);
create index bookings_family_id_idx on public.bookings (family_id);
create index bookings_course_instance_id_idx on public.bookings (course_instance_id);
create index course_instances_series_id_idx on public.course_instances (series_id);
create index trainer_assignments_trainer_id_idx on public.trainer_assignments (trainer_id);
create index trainer_assignments_course_instance_id_idx on public.trainer_assignments (course_instance_id);
create index payroll_statements_trainer_id_idx on public.payroll_statements (trainer_id);
create index trainer_notes_child_id_idx on public.trainer_notes (child_id);
create index trainer_notes_course_instance_id_idx on public.trainer_notes (course_instance_id);
create index email_messages_family_id_idx on public.email_messages (family_id);
create index audit_log_actor_id_idx on public.audit_log (actor_id);

-- =============================================================================
-- Trigger: auto-create a `profiles` row on `auth.users` insert, default
-- role 'client' (01-ARCHITECTURE.md §3).
-- =============================================================================

create or replace function public.handle_new_user()
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
  for each row execute procedure public.handle_new_user();

-- =============================================================================
-- Row Level Security — deny-by-default on every table.
-- =============================================================================

alter table public.locations enable row level security;
alter table public.profiles enable row level security;
alter table public.kiosk_devices enable row level security;
alter table public.families enable row level security;
alter table public.children enable row level security;
alter table public.course_series enable row level security;
alter table public.course_instances enable row level security;
alter table public.price_tiers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.bookings enable row level security;
alter table public.trainer_assignments enable row level security;
alter table public.cancellation_policy_tiers enable row level security;
alter table public.reminders_log enable row level security;
alter table public.trainers enable row level security;
alter table public.trainer_pay_rates enable row level security;
alter table public.payroll_deduction_types enable row level security;
alter table public.trainer_documents enable row level security;
alter table public.annual_tax_statements enable row level security;
alter table public.trainer_notes enable row level security;
alter table public.timesheets enable row level security;
alter table public.cost_centers enable row level security;
alter table public.invoices enable row level security;
alter table public.expenses enable row level security;
alter table public.venue_rents enable row level security;
alter table public.payroll_statements enable row level security;
alter table public.payroll_line_items enable row level security;
alter table public.refunds enable row level security;
alter table public.sms_log enable row level security;
alter table public.newsletter_log enable row level security;
alter table public.crm_saved_filters enable row level security;
alter table public.crm_notes enable row level security;
alter table public.dashboard_metrics_cache enable row level security;
alter table public.app_settings enable row level security;
alter table public.email_messages enable row level security;
alter table public.notion_sync_log enable row level security;
alter table public.audit_log enable row level security;

-- -----------------------------------------------------------------------------
-- profiles — baseline access (not one of the 03-DATA-MODEL.md §3 example
-- policies, but required for the system to be usable at all: everyone needs
-- to be able to read their own row, and 'users'-permission admins need to
-- manage the roster to create trainer/admin accounts per 00-MASTER-PLAN.md
-- §9). Role/permissions are never self-editable — no self-UPDATE policy.
-- -----------------------------------------------------------------------------

create policy profiles_select_self on public.profiles
  for select
  using (id = auth.uid());

create policy profiles_all_admin_users on public.profiles
  for all
  using (public.has_permission('users'))
  with check (public.has_permission('users'));

-- -----------------------------------------------------------------------------
-- children (03-DATA-MODEL.md §3): client sees only own family's children;
-- trainer sees children in own course_instances; admin with `crm` sees all.
--
-- Note: RLS is row-level only. The doc also restricts *which columns* a
-- trainer may see (first_name + allergies_notes, never a surname/contact —
-- though none is stored on this table anyway). Enforcing that at the column
-- level requires a dedicated view/RPC; deferred to the phase that builds the
-- trainer roster UI. This migration implements the row-level scope only.
-- -----------------------------------------------------------------------------

create policy children_select_client on public.children
  for select
  using (
    exists (
      select 1 from public.families f
      where f.id = children.family_id and f.profile_id = auth.uid()
    )
  );

create policy children_write_client on public.children
  for insert
  with check (
    exists (
      select 1 from public.families f
      where f.id = children.family_id and f.profile_id = auth.uid()
    )
  );

create policy children_update_client on public.children
  for update
  using (
    exists (
      select 1 from public.families f
      where f.id = children.family_id and f.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.families f
      where f.id = children.family_id and f.profile_id = auth.uid()
    )
  );

create policy children_select_trainer on public.children
  for select
  using (
    public.current_role() = 'trainer'
    and exists (
      select 1
      from public.bookings b
      join public.trainer_assignments ta on ta.course_instance_id = b.course_instance_id
      where b.child_id = children.id and ta.trainer_id = auth.uid()
    )
  );

create policy children_all_admin_crm on public.children
  for all
  using (public.has_permission('crm'))
  with check (public.has_permission('crm'));

-- -----------------------------------------------------------------------------
-- payroll_statements (03-DATA-MODEL.md §3): trainer sees only own rows with
-- status = 'released'; only admin with `finance` may write (incl. releasing).
-- -----------------------------------------------------------------------------

create policy payroll_statements_select_trainer on public.payroll_statements
  for select
  using (trainer_id = auth.uid() and status = 'released');

create policy payroll_statements_all_finance on public.payroll_statements
  for all
  using (public.has_permission('finance'))
  with check (public.has_permission('finance'));

-- -----------------------------------------------------------------------------
-- trainer_notes (03-DATA-MODEL.md §3): readable by all trainer profiles
-- (shared knowledge, as requested), writable only by the author.
-- -----------------------------------------------------------------------------

create policy trainer_notes_select_trainer on public.trainer_notes
  for select
  using (public.current_role() = 'trainer');

create policy trainer_notes_insert_author on public.trainer_notes
  for insert
  with check (author_trainer_id = auth.uid());

create policy trainer_notes_update_author on public.trainer_notes
  for update
  using (author_trainer_id = auth.uid())
  with check (author_trainer_id = auth.uid());

create policy trainer_notes_delete_author on public.trainer_notes
  for delete
  using (author_trainer_id = auth.uid());

-- -----------------------------------------------------------------------------
-- trainer_pay_rates (03-DATA-MODEL.md §3): writable only by admin with
-- `users`; readable additionally by admin with `finance`; never by the
-- trainer themselves (sensitive pay data, no self-service).
-- -----------------------------------------------------------------------------

create policy trainer_pay_rates_all_users on public.trainer_pay_rates
  for all
  using (public.has_permission('users'))
  with check (public.has_permission('users'));

create policy trainer_pay_rates_select_finance on public.trainer_pay_rates
  for select
  using (public.has_permission('finance'));

-- -----------------------------------------------------------------------------
-- trainer_documents (03-DATA-MODEL.md §3): writable/readable by admin with
-- `users`; the affected trainer may read own rows and upload requested
-- documents (self-service), but never update/delete an uploaded document.
-- -----------------------------------------------------------------------------

create policy trainer_documents_all_users on public.trainer_documents
  for all
  using (public.has_permission('users'))
  with check (public.has_permission('users'));

create policy trainer_documents_select_self on public.trainer_documents
  for select
  using (trainer_id = auth.uid());

create policy trainer_documents_insert_self on public.trainer_documents
  for insert
  with check (trainer_id = auth.uid());

-- -----------------------------------------------------------------------------
-- bookings (03-DATA-MODEL.md §3): client sees only own family_id rows; admin
-- with `crm` sees all; admin with `finance` additionally sees payment
-- fields. Column-level split (payment fields only) again needs a view —
-- deferred, same caveat as `children` above; `finance` gets full-row access
-- for now.
-- -----------------------------------------------------------------------------

create policy bookings_select_client on public.bookings
  for select
  using (
    exists (
      select 1 from public.families f
      where f.id = bookings.family_id and f.profile_id = auth.uid()
    )
  );

create policy bookings_all_crm on public.bookings
  for all
  using (public.has_permission('crm'))
  with check (public.has_permission('crm'));

create policy bookings_select_finance on public.bookings
  for select
  using (public.has_permission('finance'));

-- -----------------------------------------------------------------------------
-- email_messages (03-DATA-MODEL.md §3): only admin with `crm`, never the
-- client. Per-access audit logging happens at the application/API layer
-- (Postgres has no native per-row SELECT trigger) — every read must insert
-- into `audit_log` there.
-- -----------------------------------------------------------------------------

create policy email_messages_all_crm on public.email_messages
  for all
  using (public.has_permission('crm'))
  with check (public.has_permission('crm'));

-- -----------------------------------------------------------------------------
-- app_settings (03-DATA-MODEL.md §3): writable only by admin with `finance`
-- (same level as price_tiers/cancellation_policy_tiers); readable by any
-- admin/superuser (read by multiple modules).
-- -----------------------------------------------------------------------------

create policy app_settings_select_admin on public.app_settings
  for select
  using (public.is_admin());

create policy app_settings_insert_finance on public.app_settings
  for insert
  with check (public.has_permission('finance'));

create policy app_settings_update_finance on public.app_settings
  for update
  using (public.has_permission('finance'))
  with check (public.has_permission('finance'));

create policy app_settings_delete_finance on public.app_settings
  for delete
  using (public.has_permission('finance'));
