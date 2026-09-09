import { BOOKING_PAGE_CHROME } from "@/app/preview/[locale]/book/copy";
import type { PriceTierRow } from "@/app/preview/[locale]/book/copy";
import { activeTier, daysUntil, formatPrice, formatShortDate, tierEndDate } from "@/app/preview/[locale]/book/pricing";
import type { CourseCardData } from "@/app/preview/[locale]/sections/CoursesTeaser";

import type { Locale } from "./locales";
import { getAllModuleTeasers, getModuleByModuleRef } from "./sanity";
import { getSupabaseClient } from "./supabase";

/**
 * Real course listings for the homepage and module-detail teaser sections,
 * replacing the hand-written placeholder catalog in copy.ts's
 * HOME_COPY.courses.items -- same "no hardcoding" migration the module
 * content already went through. Only course_series that actually exist in
 * Supabase show up here; today that's exactly one
 * ("medienkompetenz-basiskurs"), so both teaser sections will legitimately
 * look sparse until more real courses are scheduled. That's the honest
 * current state, not a bug -- copy.ts's fictional 6-course catalog is
 * still used by grid-test/page.tsx (a design-review sandbox, not real
 * content), which is why it wasn't deleted outright.
 */
export async function getPublishedCourses(locale: Locale): Promise<CourseCardData[]> {
  const supabase = getSupabaseClient();

  const [seriesResult, topicModules, scarcityDefaultResult] = await Promise.all([
    supabase
      .from("course_series")
      .select("id, module_ref, location_id, cadence_label, fomo_enabled, scarcity_seats_threshold"),
    getAllModuleTeasers(locale),
    supabase.rpc("get_scarcity_seats_threshold_default"),
  ]);

  const seriesRows = seriesResult.data ?? [];
  if (seriesRows.length === 0) return [];

  const seriesIds = seriesRows.map((series) => series.id);
  const locationIds = [
    ...new Set(
      seriesRows
        .map((series) => series.location_id)
        .filter((id): id is string => id !== null),
    ),
  ];

  const [instancesResult, tiersResult, locationsResult] = await Promise.all([
    supabase
      .from("course_instances")
      .select("id, series_id, start_at, capacity")
      .in("series_id", seriesIds)
      .gt("start_at", new Date().toISOString())
      .order("start_at"),
    supabase
      .from("price_tiers")
      .select("series_id, days_before_min, days_before_max, price_cents, label")
      .in("series_id", seriesIds)
      .eq("plan_type", "single"),
    locationIds.length > 0
      ? supabase.from("locations_public").select("id, name").in("id", locationIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
  ]);

  const categoryTitle = new Map(topicModules.map((module_) => [module_.category, module_.title]));
  const locationNameById = new Map(
    (locationsResult.data ?? []).map((location) => [location.id, location.name]),
  );
  const chrome = BOOKING_PAGE_CHROME[locale];
  const scarcityDefault = scarcityDefaultResult.data ?? 5;

  const cards = await Promise.all(
    seriesRows.map(async (series): Promise<CourseCardData | null> => {
      const module_ = await getModuleByModuleRef(series.module_ref, locale);
      if (!module_) return null;

      const nextInstance = (instancesResult.data ?? []).find(
        (instance) => instance.series_id === series.id,
      );

      const tiers: PriceTierRow[] = (tiersResult.data ?? [])
        .filter((tier) => tier.series_id === series.id)
        .map((tier) => ({
          daysBeforeMin: tier.days_before_min,
          daysBeforeMax: tier.days_before_max,
          priceCents: tier.price_cents,
          tierLabel: tier.label ?? "",
        }));

      let price = "";
      let fomo: CourseCardData["fomo"];

      if (nextInstance && tiers.length > 0) {
        const isoDate = nextInstance.start_at.slice(0, 10);
        const daysBefore = daysUntil(isoDate, new Date());
        const tier = activeTier(tiers, daysBefore);
        price = formatPrice(tier.priceCents);

        const threshold = series.scarcity_seats_threshold ?? scarcityDefault;
        // No real booking flow yet (Stripe checkout, magic-link accounts
        // aren't built), so nobody has booked anything -- capacity itself
        // is the honest remaining-seats count, same reasoning as
        // book/[slug]/data.ts's confirmedBookings: 0.
        const remaining = nextInstance.capacity;

        if (series.fomo_enabled && remaining <= threshold) {
          fomo = { kind: "scarcity", label: chrome.spotsLeftLabel(remaining) };
        } else {
          const end = tierEndDate(tier, isoDate);
          if (series.fomo_enabled && end) {
            fomo = {
              kind: "urgency",
              label: chrome.priceValidUntilLabel(formatShortDate(end.toISOString().slice(0, 10), locale)),
            };
          }
        }
      }

      const locationName = series.location_id ? (locationNameById.get(series.location_id) ?? null) : null;

      return {
        category: categoryTitle.get(module_.category) ?? module_.category,
        moduleCategory: module_.category,
        title: module_.title,
        dateLabel: [series.cadence_label, locationName].filter(Boolean).join(", "),
        price,
        // No Sanity field for short marketing bullets per course yet --
        // showing none is honest; inventing filler text is exactly what
        // this whole migration exists to stop doing.
        advantages: [],
        fomo,
        bookingSlug: series.module_ref,
      };
    }),
  );

  return cards.filter((card): card is CourseCardData => card !== null);
}
