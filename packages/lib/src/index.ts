// @somos/lib — shared business logic across apps/web, apps/admin,
// apps/trainer.
//
// Booking/subscription pricing logic (05-MODULE-BOOKING.md) and
// payroll/deduction calculations (08-MODULE-FINANCE.md) land here once
// those phases start — per the project's "no hardcoding" principle
// (00-MASTER-PLAN.md §0) they must read prices/rates/policy tiers from
// Supabase/`app_settings`, never hardcode them here.

export { sendSms, sendWhatsAppTemplate } from "./bird";
export type {
  BirdSmsCategory,
  SendSmsParams,
  SendWhatsAppTemplateParams,
  WhatsAppTemplateParam,
} from "./bird";
