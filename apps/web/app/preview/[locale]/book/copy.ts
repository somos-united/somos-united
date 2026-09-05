import type { ModuleCategory } from "@somos/types";

import type { Locale } from "@/lib/locales";

/**
 * Placeholder booking-flow data, grounded in the real documented
 * mechanics in 05-MODULE-BOOKING.md - not invented from scratch:
 * - §5 dynamic "airline principle" pricing (days-before-instance tiers,
 *   the doc's own illustrative single-visit numbers CHF 25/30/35).
 * - §6 FOMO pills (scarcity from capacity vs threshold, urgency from
 *   the active tier's end date) - same mechanics already used in
 *   CoursesTeaser, applied here per-instance instead of per-card.
 * - §7 subscription purchase (6x/12x/24x books N future instances of
 *   the same series in one payment; pricing follows the *first*
 *   instance in the cycle, same tier logic as a single booking).
 *
 * Only ONE course (Medienkompetenz Basiskurs) is built out here as a
 * full template - one thing built well first, per this session's
 * established pattern, before replicating to the other 5 courses.
 *
 * Deliberately stops short of the parts of the real flow that need a
 * working Supabase (magic-link login, child assignment) and Stripe
 * (payment) - see the page's own "what happens next" section for how
 * that's represented honestly rather than faked.
 */

export type PlanType = "single" | "6x" | "12x" | "24x";

export interface PriceTierRow {
  daysBeforeMin: number;
  daysBeforeMax: number | null;
  priceCents: number;
  tierLabel: string;
}

export interface PlanOption {
  planType: PlanType;
  label: string;
  description: string;
  tiers: PriceTierRow[];
}

export interface BookingInstance {
  isoDate: string;
  dateLabel: string;
  time: string;
  capacity: number;
  confirmedBookings: number;
}

export interface BookingPageData {
  slug: string;
  courseTitle: string;
  category: string;
  moduleCategory: ModuleCategory;
  location: string;
  cadenceLabel: string;
  aboEnabled: boolean;
  fomoEnabled: boolean;
  scarcitySeatsThreshold: number;
  instances: BookingInstance[];
  plans: PlanOption[];
}

const SINGLE_TIERS: PriceTierRow[] = [
  { daysBeforeMin: 31, daysBeforeMax: null, priceCents: 2500, tierLabel: "Early Bird" },
  { daysBeforeMin: 10, daysBeforeMax: 30, priceCents: 3000, tierLabel: "Standard" },
  { daysBeforeMin: 0, daysBeforeMax: 9, priceCents: 3500, tierLabel: "Last Minute" },
];

const SIX_TIERS: PriceTierRow[] = [
  { daysBeforeMin: 31, daysBeforeMax: null, priceCents: 13500, tierLabel: "Early Bird" },
  { daysBeforeMin: 10, daysBeforeMax: 30, priceCents: 16200, tierLabel: "Standard" },
  { daysBeforeMin: 0, daysBeforeMax: 9, priceCents: 18900, tierLabel: "Last Minute" },
];

const TWELVE_TIERS: PriceTierRow[] = [
  { daysBeforeMin: 31, daysBeforeMax: null, priceCents: 25500, tierLabel: "Early Bird" },
  { daysBeforeMin: 10, daysBeforeMax: 30, priceCents: 30600, tierLabel: "Standard" },
  { daysBeforeMin: 0, daysBeforeMax: 9, priceCents: 35700, tierLabel: "Last Minute" },
];

const TWENTYFOUR_TIERS: PriceTierRow[] = [
  { daysBeforeMin: 31, daysBeforeMax: null, priceCents: 48000, tierLabel: "Early Bird" },
  { daysBeforeMin: 10, daysBeforeMax: 30, priceCents: 57600, tierLabel: "Standard" },
  { daysBeforeMin: 0, daysBeforeMax: 9, priceCents: 67200, tierLabel: "Last Minute" },
];

const INSTANCES: BookingInstance[] = [
  { isoDate: "2026-09-10", dateLabel: "", time: "16:00–17:30", capacity: 12, confirmedBookings: 9 },
  { isoDate: "2026-09-17", dateLabel: "", time: "16:00–17:30", capacity: 12, confirmedBookings: 6 },
  { isoDate: "2026-09-24", dateLabel: "", time: "16:00–17:30", capacity: 12, confirmedBookings: 3 },
  { isoDate: "2026-10-01", dateLabel: "", time: "16:00–17:30", capacity: 12, confirmedBookings: 1 },
  { isoDate: "2026-10-08", dateLabel: "", time: "16:00–17:30", capacity: 12, confirmedBookings: 0 },
];

export const BOOKING_PAGES: Record<Locale, Record<string, BookingPageData>> = {
  de: {
    "medienkompetenz-basiskurs": {
      slug: "medienkompetenz-basiskurs",
      courseTitle: "Medienkompetenz Basiskurs",
      category: "Medienkompetenz",
      moduleCategory: "medienkompetenz",
      location: "Zürich",
      cadenceLabel: "Wöchentlich",
      aboEnabled: true,
      fomoEnabled: true,
      scarcitySeatsThreshold: 5,
      instances: INSTANCES,
      plans: [
        {
          planType: "single",
          label: "Einzeltermin",
          description: "Einmal reinschnuppern, ein Termin nach Wahl.",
          tiers: SINGLE_TIERS,
        },
        {
          planType: "6x",
          label: "6er-Abo",
          description: "Die nächsten 6 Termine dieser Serie, automatisch gebucht.",
          tiers: SIX_TIERS,
        },
        {
          planType: "12x",
          label: "12er-Abo",
          description: "Die nächsten 12 Termine dieser Serie, automatisch gebucht.",
          tiers: TWELVE_TIERS,
        },
        {
          planType: "24x",
          label: "24er-Abo",
          description: "Die nächsten 24 Termine dieser Serie, automatisch gebucht.",
          tiers: TWENTYFOUR_TIERS,
        },
      ],
    },
  },
  en: {
    "medienkompetenz-basiskurs": {
      slug: "medienkompetenz-basiskurs",
      courseTitle: "Media Literacy Basics",
      category: "Media literacy",
      moduleCategory: "medienkompetenz",
      location: "Zurich",
      cadenceLabel: "Weekly",
      aboEnabled: true,
      fomoEnabled: true,
      scarcitySeatsThreshold: 5,
      instances: INSTANCES,
      plans: [
        {
          planType: "single",
          label: "Single visit",
          description: "Try it once, pick any date.",
          tiers: SINGLE_TIERS,
        },
        {
          planType: "6x",
          label: "6-visit plan",
          description: "The next 6 dates in this series, booked automatically.",
          tiers: SIX_TIERS,
        },
        {
          planType: "12x",
          label: "12-visit plan",
          description: "The next 12 dates in this series, booked automatically.",
          tiers: TWELVE_TIERS,
        },
        {
          planType: "24x",
          label: "24-visit plan",
          description: "The next 24 dates in this series, booked automatically.",
          tiers: TWENTYFOUR_TIERS,
        },
      ],
    },
  },
};

export interface BookingPageChrome {
  backToModule: string;
  instancesHeading: string;
  plansHeading: string;
  spotsLeftLabel: (n: number) => string;
  priceValidUntilLabel: (date: string) => string;
  ctaLabel: string;
  whatsNextHeading: string;
  whatsNextBody: string;
}

export const BOOKING_PAGE_CHROME: Record<Locale, BookingPageChrome> = {
  de: {
    backToModule: "Zurück zum Modul",
    instancesHeading: "Nächste Termine",
    plansHeading: "Wähle deine Buchungsart",
    spotsLeftLabel: (n) => `Nur noch ${n} Plätze`,
    priceValidUntilLabel: (date) => `Preis gültig bis ${date}`,
    ctaLabel: "Weiter zur Anmeldung",
    whatsNextHeading: "Wie geht es weiter?",
    whatsNextBody:
      "Nach der Auswahl folgen Login per Magic-Link, die Zuordnung zu einem Kind und die Zahlung über Stripe — dieser Teil ist noch nicht angebunden, da Supabase und Stripe gerade eingerichtet werden.",
  },
  en: {
    backToModule: "Back to module",
    instancesHeading: "Upcoming dates",
    plansHeading: "Choose how you'd like to book",
    spotsLeftLabel: (n) => `Only ${n} spots left`,
    priceValidUntilLabel: (date) => `Price valid until ${date}`,
    ctaLabel: "Continue to sign-up",
    whatsNextHeading: "What happens next?",
    whatsNextBody:
      "After choosing, you'd log in via a magic link, assign a child, and pay via Stripe — that part isn't wired up yet, since Supabase and Stripe are still being set up.",
  },
};
