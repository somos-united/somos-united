// @somos/lib — shared business logic across apps/web, apps/admin,
// apps/trainer.
//
// Deliberately empty in Phase 0 (00-MASTER-PLAN.md §3: "Phase 0 — Fundament,
// keine sichtbaren Features"). This is where booking/subscription pricing
// logic (05-MODULE-BOOKING.md), payroll/deduction calculations
// (08-MODULE-FINANCE.md) and shared role/permission helpers
// (01-ARCHITECTURE.md §4) will live once those phases start — none of that
// exists yet, and per the project's "no hardcoding" principle
// (00-MASTER-PLAN.md §0) it must read its inputs (prices, rates, policy
// tiers) from Supabase/`app_settings`, never hardcode them here.

export const SOMOS_LIB_PLACEHOLDER = true as const;
