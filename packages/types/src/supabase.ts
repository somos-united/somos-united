/**
 * Hand-authored Supabase `Database` type — mirrors
 * `supabase/migrations/20260824000000_init_schema.sql` exactly (which in
 * turn implements md/03-DATA-MODEL.md §2). No live Supabase project exists
 * yet, so this cannot be CLI-generated (`supabase gen types typescript`);
 * regenerate/replace this file once a real project exists so it never
 * silently drifts from the actual schema.
 *
 * Convention: every table gets a `Row` (exact column shape), an `Insert`
 * (columns with a DB default become optional) and an `Update` (everything
 * optional except nothing is required). This mirrors the shape the
 * Supabase CLI itself generates so swapping this file for a generated one
 * later is a drop-in replacement.
 */

/** JSON-compatible value — used for every `jsonb` column. */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

/** Marks the given keys as optional (columns with a DB default/generated value). */
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ---------------------------------------------------------------------------
// 2.1 Identität & Zugriff
// ---------------------------------------------------------------------------

export interface LocationsRow {
  id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  capacity: number | null;
  notes: string | null;
  rent_amount_cents: number | null;
  rent_cycle: string | null;
  rent_active: boolean;
  created_at: string;
}
export type LocationsInsert = WithOptional<LocationsRow, "id" | "rent_active" | "created_at">;
export type LocationsUpdate = Partial<LocationsRow>;

export type ProfileRole = "admin" | "superuser" | "trainer" | "client";

export interface ProfilesRow {
  id: string;
  role: ProfileRole;
  permissions: string[];
  location_id: string | null;
  is_kiosk: boolean;
  locale_pref: string | null;
  created_at: string;
}
export type ProfilesInsert = WithOptional<
  ProfilesRow,
  "role" | "permissions" | "is_kiosk" | "created_at"
>;
export type ProfilesUpdate = Partial<ProfilesRow>;

export interface KioskDevicesRow {
  id: string;
  location_id: string;
  device_label: string;
  last_seen_at: string | null;
  revoked_at: string | null;
  created_at: string;
}
export type KioskDevicesInsert = WithOptional<KioskDevicesRow, "id" | "created_at">;
export type KioskDevicesUpdate = Partial<KioskDevicesRow>;

// ---------------------------------------------------------------------------
// 2.2 Familien & Kinder
// ---------------------------------------------------------------------------

export interface FamiliesRow {
  id: string;
  profile_id: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  sms_opt_in: boolean;
  newsletter_opt_in: boolean;
  source: string | null;
  last_login_at: string | null;
  created_at: string;
  anonymized_at: string | null;
}
export type FamiliesInsert = WithOptional<
  FamiliesRow,
  "id" | "sms_opt_in" | "newsletter_opt_in" | "created_at"
>;
export type FamiliesUpdate = Partial<FamiliesRow>;

export interface ChildrenRow {
  id: string;
  family_id: string;
  first_name: string;
  birth_year: number;
  allergies_notes: string | null;
  general_notes: string | null;
  created_at: string;
}
export type ChildrenInsert = WithOptional<ChildrenRow, "id" | "created_at">;
export type ChildrenUpdate = Partial<ChildrenRow>;

// ---------------------------------------------------------------------------
// 2.3 Kurse, Serien, Preise & Buchungen
// ---------------------------------------------------------------------------

export interface CourseSeriesRow {
  id: string;
  module_ref: string;
  location_id: string | null;
  cadence_label: string | null;
  abo_enabled: boolean;
  fomo_enabled: boolean;
  scarcity_seats_threshold: number | null;
  renewal_upsell_label: string | null;
  renewal_upsell_discount_pct: number | null;
  renewal_reminder_days_before: number | null;
  created_at: string;
}
export type CourseSeriesInsert = WithOptional<
  CourseSeriesRow,
  "id" | "abo_enabled" | "fomo_enabled" | "created_at"
>;
export type CourseSeriesUpdate = Partial<CourseSeriesRow>;

export interface CourseInstancesRow {
  id: string;
  series_id: string | null;
  sequence_index: number | null;
  module_ref: string;
  location_id: string | null;
  start_at: string;
  end_at: string;
  capacity: number;
  price_override_cents: number | null;
  created_at: string;
}
export type CourseInstancesInsert = WithOptional<CourseInstancesRow, "id" | "created_at">;
export type CourseInstancesUpdate = Partial<CourseInstancesRow>;

export type PriceTierPlanType = "single" | "6x" | "12x" | "24x";

export interface PriceTiersRow {
  id: string;
  series_id: string;
  plan_type: PriceTierPlanType;
  days_before_min: number;
  days_before_max: number | null;
  price_cents: number;
  label: string | null;
  updated_by: string | null;
  updated_at: string;
}
export type PriceTiersInsert = WithOptional<PriceTiersRow, "id" | "updated_at">;
export type PriceTiersUpdate = Partial<PriceTiersRow>;

export type SubscriptionPlanType = "6x" | "12x" | "24x";

export interface SubscriptionsRow {
  id: string;
  family_id: string;
  child_id: string | null;
  series_id: string;
  plan_type: SubscriptionPlanType;
  purchase_date: string;
  price_paid_cents: number | null;
  stripe_payment_intent_id: string | null;
  auto_renew: boolean;
  renewal_reminder_sent_at: string | null;
  cancelled_at: string | null;
  renewed_into_subscription_id: string | null;
  stripe_payment_method_id: string | null;
  upsell_reward_label: string | null;
  upsell_reward_fulfilled_at: string | null;
  created_at: string;
}
export type SubscriptionsInsert = WithOptional<
  SubscriptionsRow,
  "id" | "purchase_date" | "auto_renew" | "created_at"
>;
export type SubscriptionsUpdate = Partial<SubscriptionsRow>;

export type BookingStatus = "pending" | "confirmed" | "waitlist" | "cancelled";

export interface BookingsRow {
  id: string;
  family_id: string;
  child_id: string;
  course_instance_id: string;
  status: BookingStatus;
  subscription_id: string | null;
  price_paid_cents: number | null;
  payment_status: string | null;
  stripe_payment_intent_id: string | null;
  legal_document_version: string | null;
  cancellation_refund_pct: number | null;
  checkin_token: string | null;
  checked_in_at: string | null;
  checked_in_by: string | null;
  created_at: string;
}
export type BookingsInsert = WithOptional<BookingsRow, "id" | "status" | "created_at">;
export type BookingsUpdate = Partial<BookingsRow>;

export interface TrainerAssignmentsRow {
  id: string;
  course_instance_id: string;
  trainer_id: string;
  role: string | null;
  reminder_sent_at: string | null;
  created_at: string;
}
export type TrainerAssignmentsInsert = WithOptional<TrainerAssignmentsRow, "id" | "created_at">;
export type TrainerAssignmentsUpdate = Partial<TrainerAssignmentsRow>;

export interface CancellationPolicyTiersRow {
  id: string;
  days_before_min: number;
  days_before_max: number | null;
  refund_percentage: number;
  requires_doctor_note: boolean;
  updated_by: string | null;
  updated_at: string;
}
export type CancellationPolicyTiersInsert = WithOptional<
  CancellationPolicyTiersRow,
  "id" | "requires_doctor_note" | "updated_at"
>;
export type CancellationPolicyTiersUpdate = Partial<CancellationPolicyTiersRow>;

export type ReminderType = "confirmation" | "reminder_10d" | "reminder_1d" | "abo_renewal_upsell";
export type ReminderChannel = "email" | "sms";

export interface RemindersLogRow {
  id: string;
  booking_id: string | null;
  subscription_id: string | null;
  type: ReminderType;
  sent_at: string;
  channel: ReminderChannel;
}
export type RemindersLogInsert = WithOptional<RemindersLogRow, "id" | "sent_at">;
export type RemindersLogUpdate = Partial<RemindersLogRow>;

// ---------------------------------------------------------------------------
// 2.4 Trainer-Dossier & Personaldossier (HR)
// ---------------------------------------------------------------------------

export interface TrainersRow {
  profile_id: string;
  emergency_contact: string | null;
  iban: string | null;
  created_at: string;
}
export type TrainersInsert = WithOptional<TrainersRow, "created_at">;
export type TrainersUpdate = Partial<TrainersRow>;

export type PayModel = "hourly" | "monthly" | "per_course";
export type PayAmountType = "gross" | "net";

export interface TrainerPayRatesRow {
  id: string;
  trainer_id: string;
  pay_model: PayModel;
  rate_cents: number;
  amount_type: PayAmountType;
  valid_from: string;
  valid_to: string | null;
  created_by: string | null;
  created_at: string;
}
export type TrainerPayRatesInsert = WithOptional<TrainerPayRatesRow, "id" | "created_at">;
export type TrainerPayRatesUpdate = Partial<TrainerPayRatesRow>;

export type DeductionAmountType = "percentage" | "fixed_amount";

export interface PayrollDeductionTypesRow {
  id: string;
  code: string;
  label: string;
  amount_type: DeductionAmountType;
  percentage: number | null;
  amount_cents: number | null;
  valid_from: string;
  valid_to: string | null;
  active: boolean;
}
export type PayrollDeductionTypesInsert = WithOptional<
  PayrollDeductionTypesRow,
  "id" | "active"
>;
export type PayrollDeductionTypesUpdate = Partial<PayrollDeductionTypesRow>;

export interface TrainerDocumentsRow {
  id: string;
  trainer_id: string;
  document_type: string;
  file_url: string | null;
  requested_at: string;
  received_at: string | null;
  expires_at: string | null;
  uploaded_by: string | null;
}
export type TrainerDocumentsInsert = WithOptional<TrainerDocumentsRow, "id" | "requested_at">;
export type TrainerDocumentsUpdate = Partial<TrainerDocumentsRow>;

export interface AnnualTaxStatementsRow {
  id: string;
  trainer_id: string;
  year: number;
  pdf_url: string | null;
  generated_at: string | null;
  sent_at: string | null;
}
export type AnnualTaxStatementsInsert = WithOptional<AnnualTaxStatementsRow, "id">;
export type AnnualTaxStatementsUpdate = Partial<AnnualTaxStatementsRow>;

export interface TrainerNotesRow {
  id: string;
  author_trainer_id: string;
  child_id: string | null;
  course_instance_id: string | null;
  note: string;
  created_at: string;
}
export type TrainerNotesInsert = WithOptional<TrainerNotesRow, "id" | "created_at">;
export type TrainerNotesUpdate = Partial<TrainerNotesRow>;

export interface TimesheetsRow {
  id: string;
  trainer_id: string;
  course_instance_id: string | null;
  date: string;
  hours: number;
  approved_by: string | null;
  approved_at: string | null;
}
export type TimesheetsInsert = WithOptional<TimesheetsRow, "id">;
export type TimesheetsUpdate = Partial<TimesheetsRow>;

// ---------------------------------------------------------------------------
// 2.5 Finance (Admin-App)
// ---------------------------------------------------------------------------

export interface CostCentersRow {
  id: string;
  name: string;
  code: string;
}
export type CostCentersInsert = WithOptional<CostCentersRow, "id">;
export type CostCentersUpdate = Partial<CostCentersRow>;

export type InvoiceRelatedType = "family" | "trainer" | "vendor";

export interface InvoicesRow {
  id: string;
  related_type: InvoiceRelatedType;
  related_id: string;
  amount_cents: number;
  status: string;
  pdf_url: string | null;
  due_date: string | null;
  cost_center_id: string | null;
  created_at: string;
}
export type InvoicesInsert = WithOptional<InvoicesRow, "id" | "status" | "created_at">;
export type InvoicesUpdate = Partial<InvoicesRow>;

export interface ExpensesRow {
  id: string;
  submitted_by: string | null;
  amount_cents: number;
  category: string | null;
  receipt_url: string | null;
  approved_by: string | null;
  approved_at: string | null;
  cost_center_id: string | null;
  created_at: string;
}
export type ExpensesInsert = WithOptional<ExpensesRow, "id" | "created_at">;
export type ExpensesUpdate = Partial<ExpensesRow>;

export interface VenueRentsRow {
  id: string;
  location_id: string;
  period: string;
  amount_cents: number;
  status: string;
  cost_center_id: string | null;
  created_at: string;
}
export type VenueRentsInsert = WithOptional<VenueRentsRow, "id" | "status" | "created_at">;
export type VenueRentsUpdate = Partial<VenueRentsRow>;

export type PayrollStatementStatus = "draft" | "released";

export interface PayrollStatementsRow {
  id: string;
  trainer_id: string;
  period: string;
  gross_amount_cents: number;
  deductions_json: Json;
  net_amount_cents: number;
  pdf_url: string | null;
  status: PayrollStatementStatus;
  released_at: string | null;
  created_at: string;
}
export type PayrollStatementsInsert = WithOptional<
  PayrollStatementsRow,
  "id" | "deductions_json" | "status" | "created_at"
>;
export type PayrollStatementsUpdate = Partial<PayrollStatementsRow>;

export type PayrollLineItemSourceType = "timesheet" | "course" | "manual";

export interface PayrollLineItemsRow {
  id: string;
  payroll_statement_id: string;
  description: string;
  amount_cents: number;
  source_type: PayrollLineItemSourceType | null;
  source_id: string | null;
}
export type PayrollLineItemsInsert = WithOptional<PayrollLineItemsRow, "id">;
export type PayrollLineItemsUpdate = Partial<PayrollLineItemsRow>;

export type RefundOutcome = "refunded" | "donated";

export interface RefundsRow {
  id: string;
  booking_id: string;
  amount_cents: number;
  outcome: RefundOutcome;
  reason: string | null;
  processed_by: string | null;
  processed_at: string;
}
export type RefundsInsert = WithOptional<RefundsRow, "id" | "processed_at">;
export type RefundsUpdate = Partial<RefundsRow>;

// ---------------------------------------------------------------------------
// 2.6 CRM & Kommunikation
// ---------------------------------------------------------------------------

export interface SmsLogRow {
  id: string;
  recipient_family_id: string | null;
  campaign_id: string | null;
  sent_at: string;
  status: string | null;
}
export type SmsLogInsert = WithOptional<SmsLogRow, "id" | "sent_at">;
export type SmsLogUpdate = Partial<SmsLogRow>;

export interface NewsletterLogRow {
  id: string;
  recipient_family_id: string | null;
  campaign_id: string | null;
  sent_at: string;
  status: string | null;
}
export type NewsletterLogInsert = WithOptional<NewsletterLogRow, "id" | "sent_at">;
export type NewsletterLogUpdate = Partial<NewsletterLogRow>;

export interface CrmSavedFiltersRow {
  id: string;
  name: string;
  filter_json: Json;
  created_by: string | null;
  created_at: string;
}
export type CrmSavedFiltersInsert = WithOptional<
  CrmSavedFiltersRow,
  "id" | "filter_json" | "created_at"
>;
export type CrmSavedFiltersUpdate = Partial<CrmSavedFiltersRow>;

export interface CrmNotesRow {
  id: string;
  family_id: string;
  author_admin_id: string;
  note: string;
  created_at: string;
}
export type CrmNotesInsert = WithOptional<CrmNotesRow, "id" | "created_at">;
export type CrmNotesUpdate = Partial<CrmNotesRow>;

export type DashboardMetricsSource = "ga4" | "search_console";

export interface DashboardMetricsCacheRow {
  id: string;
  source: DashboardMetricsSource;
  metric_key: string;
  metric_date: string;
  value: number | null;
  fetched_at: string;
}
export type DashboardMetricsCacheInsert = WithOptional<
  DashboardMetricsCacheRow,
  "id" | "fetched_at"
>;
export type DashboardMetricsCacheUpdate = Partial<DashboardMetricsCacheRow>;

export interface AppSettingsRow {
  key: string;
  value: Json;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}
export type AppSettingsInsert = WithOptional<AppSettingsRow, "updated_at">;
export type AppSettingsUpdate = Partial<AppSettingsRow>;

export type EmailDirection = "inbound" | "outbound";

export interface EmailMessagesRow {
  id: string;
  family_id: string | null;
  direction: EmailDirection;
  from_address: string;
  to_address: string;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  resend_id: string | null;
  attachments_json: Json | null;
  created_by: string | null;
  sent_at: string | null;
  received_at: string | null;
}
export type EmailMessagesInsert = WithOptional<EmailMessagesRow, "id">;
export type EmailMessagesUpdate = Partial<EmailMessagesRow>;

// ---------------------------------------------------------------------------
// 2.7 Notion-Sync & Audit
// ---------------------------------------------------------------------------

export interface NotionSyncLogRow {
  id: string;
  notion_page_id: string;
  sanity_draft_id: string | null;
  synced_at: string;
  status: string | null;
  error_message: string | null;
}
export type NotionSyncLogInsert = WithOptional<NotionSyncLogRow, "id" | "synced_at">;
export type NotionSyncLogUpdate = Partial<NotionSyncLogRow>;

export interface AuditLogRow {
  id: string;
  actor_id: string | null;
  action: string;
  target_table: string;
  target_id: string | null;
  accessed_at: string;
}
export type AuditLogInsert = WithOptional<AuditLogRow, "id" | "accessed_at">;
export type AuditLogUpdate = Partial<AuditLogRow>;

// ---------------------------------------------------------------------------
// Database — the Supabase-client-shaped aggregate type.
// ---------------------------------------------------------------------------

interface TableDef<Row, Insert, Update> {
  Row: Row;
  Insert: Insert;
  Update: Update;
}

export interface Database {
  public: {
    Tables: {
      locations: TableDef<LocationsRow, LocationsInsert, LocationsUpdate>;
      profiles: TableDef<ProfilesRow, ProfilesInsert, ProfilesUpdate>;
      kiosk_devices: TableDef<KioskDevicesRow, KioskDevicesInsert, KioskDevicesUpdate>;
      families: TableDef<FamiliesRow, FamiliesInsert, FamiliesUpdate>;
      children: TableDef<ChildrenRow, ChildrenInsert, ChildrenUpdate>;
      course_series: TableDef<CourseSeriesRow, CourseSeriesInsert, CourseSeriesUpdate>;
      course_instances: TableDef<
        CourseInstancesRow,
        CourseInstancesInsert,
        CourseInstancesUpdate
      >;
      price_tiers: TableDef<PriceTiersRow, PriceTiersInsert, PriceTiersUpdate>;
      subscriptions: TableDef<SubscriptionsRow, SubscriptionsInsert, SubscriptionsUpdate>;
      bookings: TableDef<BookingsRow, BookingsInsert, BookingsUpdate>;
      trainer_assignments: TableDef<
        TrainerAssignmentsRow,
        TrainerAssignmentsInsert,
        TrainerAssignmentsUpdate
      >;
      cancellation_policy_tiers: TableDef<
        CancellationPolicyTiersRow,
        CancellationPolicyTiersInsert,
        CancellationPolicyTiersUpdate
      >;
      reminders_log: TableDef<RemindersLogRow, RemindersLogInsert, RemindersLogUpdate>;
      trainers: TableDef<TrainersRow, TrainersInsert, TrainersUpdate>;
      trainer_pay_rates: TableDef<
        TrainerPayRatesRow,
        TrainerPayRatesInsert,
        TrainerPayRatesUpdate
      >;
      payroll_deduction_types: TableDef<
        PayrollDeductionTypesRow,
        PayrollDeductionTypesInsert,
        PayrollDeductionTypesUpdate
      >;
      trainer_documents: TableDef<
        TrainerDocumentsRow,
        TrainerDocumentsInsert,
        TrainerDocumentsUpdate
      >;
      annual_tax_statements: TableDef<
        AnnualTaxStatementsRow,
        AnnualTaxStatementsInsert,
        AnnualTaxStatementsUpdate
      >;
      trainer_notes: TableDef<TrainerNotesRow, TrainerNotesInsert, TrainerNotesUpdate>;
      timesheets: TableDef<TimesheetsRow, TimesheetsInsert, TimesheetsUpdate>;
      cost_centers: TableDef<CostCentersRow, CostCentersInsert, CostCentersUpdate>;
      invoices: TableDef<InvoicesRow, InvoicesInsert, InvoicesUpdate>;
      expenses: TableDef<ExpensesRow, ExpensesInsert, ExpensesUpdate>;
      venue_rents: TableDef<VenueRentsRow, VenueRentsInsert, VenueRentsUpdate>;
      payroll_statements: TableDef<
        PayrollStatementsRow,
        PayrollStatementsInsert,
        PayrollStatementsUpdate
      >;
      payroll_line_items: TableDef<
        PayrollLineItemsRow,
        PayrollLineItemsInsert,
        PayrollLineItemsUpdate
      >;
      refunds: TableDef<RefundsRow, RefundsInsert, RefundsUpdate>;
      sms_log: TableDef<SmsLogRow, SmsLogInsert, SmsLogUpdate>;
      newsletter_log: TableDef<NewsletterLogRow, NewsletterLogInsert, NewsletterLogUpdate>;
      crm_saved_filters: TableDef<
        CrmSavedFiltersRow,
        CrmSavedFiltersInsert,
        CrmSavedFiltersUpdate
      >;
      crm_notes: TableDef<CrmNotesRow, CrmNotesInsert, CrmNotesUpdate>;
      dashboard_metrics_cache: TableDef<
        DashboardMetricsCacheRow,
        DashboardMetricsCacheInsert,
        DashboardMetricsCacheUpdate
      >;
      app_settings: TableDef<AppSettingsRow, AppSettingsInsert, AppSettingsUpdate>;
      email_messages: TableDef<EmailMessagesRow, EmailMessagesInsert, EmailMessagesUpdate>;
      notion_sync_log: TableDef<NotionSyncLogRow, NotionSyncLogInsert, NotionSyncLogUpdate>;
      audit_log: TableDef<AuditLogRow, AuditLogInsert, AuditLogUpdate>;
    };
    Views: Record<string, never>;
    Functions: {
      current_role: {
        Args: Record<string, never>;
        Returns: ProfileRole | null;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      has_permission: {
        Args: { perm: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
