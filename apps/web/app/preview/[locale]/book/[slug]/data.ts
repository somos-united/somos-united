import type { ModuleCategory } from "@somos/types";

import type { Locale } from "@/lib/locales";
import { getModuleBySlug } from "@/lib/sanity";
import { getSupabaseClient } from "@/lib/supabase";

import type { BookingInstance, PlanOption, PriceTierRow } from "../copy";
import { PLAN_TYPE_CHROME } from "../copy";

export interface BookingPageData {
  courseTitle: string;
  description: string;
  moduleCategory: ModuleCategory;
  locationName: string | null;
  cadenceLabel: string | null;
  aboEnabled: boolean;
  fomoEnabled: boolean;
  scarcitySeatsThreshold: number;
  instances: BookingInstance[];
  plans: PlanOption[];
}

// Sanity's portable text is rich content, but this page only ever shows a
// short plain-text blurb -- join span text rather than pulling in a full
// portable-text renderer for one paragraph.
function plainTextFromPortableText(blocks: unknown[]): string {
  return blocks
    .map((block) => {
      if (typeof block !== "object" || block === null || !("children" in block)) return "";
      const children = (block as { children?: unknown }).children;
      if (!Array.isArray(children)) return "";
      return children
        .map((child) =>
          typeof child === "object" && child !== null && "text" in child
            ? String((child as { text?: unknown }).text ?? "")
            : "",
        )
        .join("");
    })
    .join("\n\n");
}

// Formatted server-side (this is a Server Component), so without an
// explicit timeZone this would render in whatever timezone the server
// process happens to run in (e.g. Vercel's US region), not Switzerland's -
// every visitor, everywhere, would see the wrong hour. All courses run in
// Switzerland, so pin it rather than rely on ambient server TZ.
function formatTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "de" ? "de-CH" : "en-CH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Zurich",
  }).format(new Date(iso));
}

/**
 * Wires the booking page to real content (Sanity `module` documents) and
 * real business data (Supabase course_series/course_instances/price_tiers,
 * locations via the locations_public view) instead of the hardcoded
 * placeholders this page used before. `slug` is matched against both
 * Sanity's `module.slug` and Supabase's `course_series.module_ref` --
 * the same string identifies "this course" across both systems, which is
 * what module_ref is for (03-DATA-MODEL.md).
 *
 * Returns null if either half is missing -- a course only really exists
 * once it has both real content (Sanity) and real scheduling (Supabase);
 * showing one without the other would be confusing rather than helpful.
 */
export async function getBookingPageData(
  slug: string,
  locale: Locale,
): Promise<BookingPageData | null> {
  const supabase = getSupabaseClient();

  const [sanityModule, seriesResult] = await Promise.all([
    getModuleBySlug(slug, locale),
    supabase
      .from("course_series")
      .select(
        "id, location_id, cadence_label, abo_enabled, fomo_enabled, scarcity_seats_threshold",
      )
      .eq("module_ref", slug)
      .maybeSingle(),
  ]);

  if (!sanityModule || !seriesResult.data) return null;
  const series = seriesResult.data;

  const [instancesResult, tiersResult, locationResult, scarcityDefaultResult] = await Promise.all(
    [
      supabase
        .from("course_instances")
        .select("id, start_at, end_at, capacity")
        .eq("series_id", series.id)
        .gt("start_at", new Date().toISOString())
        .order("start_at"),
      supabase
        .from("price_tiers")
        .select("plan_type, days_before_min, days_before_max, price_cents, label")
        .eq("series_id", series.id)
        .order("days_before_min"),
      series.location_id
        ? supabase
            .from("locations_public")
            .select("name")
            .eq("id", series.location_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase.rpc("get_scarcity_seats_threshold_default"),
    ],
  );

  const instances: BookingInstance[] = (instancesResult.data ?? []).map((instance) => ({
    id: instance.id,
    isoDate: instance.start_at.slice(0, 10),
    startTime: formatTime(instance.start_at, locale),
    endTime: formatTime(instance.end_at, locale),
    capacity: instance.capacity,
    // Real booking creation (Stripe checkout, magic-link accounts) isn't
    // built yet, so nobody has booked anything -- 0 is the honest current
    // count, not a placeholder. Becomes a real count once bookings exist.
    confirmedBookings: 0,
  }));

  const tiersByPlan = new Map<string, PriceTierRow[]>();
  for (const tier of tiersResult.data ?? []) {
    const rows = tiersByPlan.get(tier.plan_type) ?? [];
    rows.push({
      daysBeforeMin: tier.days_before_min,
      daysBeforeMax: tier.days_before_max,
      priceCents: tier.price_cents,
      tierLabel: tier.label ?? "",
    });
    tiersByPlan.set(tier.plan_type, rows);
  }

  const chrome = PLAN_TYPE_CHROME[locale];
  const PLAN_ORDER: PlanOption["planType"][] = ["single", "6x", "12x", "24x"];
  const plans: PlanOption[] = PLAN_ORDER.filter((planType) => tiersByPlan.has(planType)).map(
    (planType) => ({
      planType,
      label: chrome[planType].label,
      description: chrome[planType].description,
      tiers: tiersByPlan.get(planType)!,
    }),
  );

  return {
    courseTitle: sanityModule.title,
    description: plainTextFromPortableText(sanityModule.description),
    moduleCategory: sanityModule.category,
    locationName: locationResult.data?.name ?? null,
    cadenceLabel: series.cadence_label,
    aboEnabled: series.abo_enabled,
    fomoEnabled: series.fomo_enabled,
    scarcitySeatsThreshold: series.scarcity_seats_threshold ?? scarcityDefaultResult.data ?? 5,
    instances,
    plans,
  };
}
