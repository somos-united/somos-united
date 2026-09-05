import type { BookingInstance, PriceTierRow } from "./copy";

/**
 * The actual "airline principle" from 05-MODULE-BOOKING.md §5: the
 * active tier is whichever one's [daysBeforeMin, daysBeforeMax] range
 * contains the number of days between today and the relevant instance.
 * For a subscription purchase, that's the *first* instance in the
 * cycle (§7) - same rule as a single booking, just referencing a
 * different date.
 */
export function daysUntil(isoDate: string, today: Date): number {
  const target = new Date(`${isoDate}T00:00:00`);
  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function activeTier(tiers: PriceTierRow[], daysBefore: number): PriceTierRow {
  const match = tiers.find(
    (tier) => daysBefore >= tier.daysBeforeMin && (tier.daysBeforeMax === null || daysBefore <= tier.daysBeforeMax),
  );
  // Falls outside every defined range (e.g. the instance already passed) -
  // fall back to the most expensive tier rather than crashing; a real
  // instance list wouldn't include past dates in the first place.
  return match ?? tiers[tiers.length - 1]!;
}

/**
 * Scarcity pill logic, §6: capacity minus confirmed bookings at or
 * below the threshold. Mirrors CoursesTeaser's existing scarcity rule,
 * applied per-instance here instead of per-card.
 */
export function spotsLeft(instance: BookingInstance): number {
  return instance.capacity - instance.confirmedBookings;
}

export function formatDateLabel(isoDate: string, locale: "de" | "en"): string {
  return new Intl.DateTimeFormat(locale === "de" ? "de-CH" : "en-CH", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));
}

export function formatShortDate(isoDate: string, locale: "de" | "en"): string {
  return new Intl.DateTimeFormat(locale === "de" ? "de-CH" : "en-CH", {
    day: "numeric",
    month: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));
}

export function formatPrice(cents: number): string {
  return `CHF ${(cents / 100).toFixed(2).replace(".00", ".–")}`;
}

/**
 * The last calendar date the active tier's price still applies, for the
 * urgency pill ("Preis gültig bis X"). A tier is active while
 * `daysBefore >= tier.daysBeforeMin` (up to its own daysBeforeMax, if
 * any) - so it stops applying, and price steps up to the next pricier
 * tier, the moment daysBefore drops below daysBeforeMin. That crossover
 * happens on referenceDate (the instance date) minus daysBeforeMin
 * days - true for the open-ended Early Bird tier too (its daysBeforeMax
 * is null because nothing bounds it further out, but its daysBeforeMin
 * is exactly where it ends as the instance approaches).
 *
 * Returns null only for the tier with no next, pricier tier to warn
 * about - the one already covering daysBeforeMin === 0 (Last Minute).
 */
export function tierEndDate(tier: PriceTierRow, referenceIsoDate: string): Date | null {
  if (tier.daysBeforeMin === 0) return null;
  const reference = new Date(`${referenceIsoDate}T00:00:00`);
  const end = new Date(reference);
  end.setDate(end.getDate() - tier.daysBeforeMin);
  return end;
}
