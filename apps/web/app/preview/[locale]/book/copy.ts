import type { PriceTierPlanType } from "@somos/types";

import type { Locale } from "@/lib/locales";

/**
 * App-level UI chrome for the booking flow — generic interface strings
 * that apply to every course, not course-specific content. Real
 * per-course data (title, description, dates, prices, location) is
 * fetched live from Sanity + Supabase in [slug]/data.ts, not hardcoded
 * here — see 05-MODULE-BOOKING.md for the underlying mechanics (§5
 * dynamic "airline principle" pricing, §6 FOMO pills, §7 subscriptions).
 */

export type PlanType = PriceTierPlanType;

export interface PriceTierRow {
  daysBeforeMin: number;
  daysBeforeMax: number | null;
  priceCents: number;
  tierLabel: string;
}

export interface BookingInstance {
  id: string;
  isoDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  confirmedBookings: number;
}

export interface PlanOption {
  planType: PlanType;
  label: string;
  description: string;
  tiers: PriceTierRow[];
}

export interface PlanTypeChrome {
  label: string;
  description: string;
}

export const PLAN_TYPE_CHROME: Record<Locale, Record<PlanType, PlanTypeChrome>> = {
  de: {
    single: {
      label: "Einzeltermin",
      description: "Einmal reinschnuppern, ein Termin nach Wahl.",
    },
    "6x": {
      label: "6er-Abo",
      description: "Die nächsten 6 Termine dieser Serie, automatisch gebucht.",
    },
    "12x": {
      label: "12er-Abo",
      description: "Die nächsten 12 Termine dieser Serie, automatisch gebucht.",
    },
    "24x": {
      label: "24er-Abo",
      description: "Die nächsten 24 Termine dieser Serie, automatisch gebucht.",
    },
  },
  en: {
    single: {
      label: "Single visit",
      description: "Try it once, pick any date.",
    },
    "6x": {
      label: "6-visit plan",
      description: "The next 6 dates in this series, booked automatically.",
    },
    "12x": {
      label: "12-visit plan",
      description: "The next 12 dates in this series, booked automatically.",
    },
    "24x": {
      label: "24-visit plan",
      description: "The next 24 dates in this series, booked automatically.",
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
      "Nach der Auswahl folgen Login per Magic-Link, die Zuordnung zu einem Kind und die Zahlung über Stripe — dieser Teil ist noch nicht angebunden.",
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
      "After choosing, you'd log in via a magic link, assign a child, and pay via Stripe — that part isn't wired up yet.",
  },
};
