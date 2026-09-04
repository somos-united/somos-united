import Link from "next/link";

import { ButtonPrimaryPill, GlassPanel } from "@somos/ui";

import type { Locale } from "@/lib/locales";

export type NavActive = "home" | "module";

/**
 * Nav height stays within the 64-80px cap (py-sm on a text-heading-md
 * wordmark lands around 64px). Sparse glass usage per
 * 04-DESIGN-SYSTEM.md §4 — nav over the hero is exactly the case it names.
 *
 * `active` is passed in by each page rather than detected client-side
 * (e.g. usePathname) so Nav can stay a Server Component - every call
 * site already knows what page it is. Extend the type + NAV_LINKS below
 * together as more Phase 1 pages (About, Blog) land.
 */
export function Nav({
  locale,
  cta,
  ctaShort,
  moduleLabel,
  active,
}: {
  locale: Locale;
  cta: string;
  ctaShort: string;
  moduleLabel: string;
  active: NavActive;
}) {
  const otherLocale: Locale = locale === "de" ? "en" : "de";

  return (
    <GlassPanel className="sticky top-0 z-20 !rounded-none !border-x-0 !border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-lg py-sm">
        <Link
          href={`/preview/${locale}`}
          className="shrink-0 whitespace-nowrap text-heading-md text-ink"
        >
          Somos United
        </Link>
        <div className="flex items-center gap-xs sm:gap-lg">
          <Link
            href={`/preview/${locale}/module`}
            aria-current={active === "module" ? "page" : undefined}
            className={`whitespace-nowrap text-caption transition-colors hover:text-ink ${
              active === "module" ? "font-semibold text-ink" : "text-ink-mute"
            }`}
          >
            {moduleLabel}
          </Link>
          <Link
            href={`/preview/${otherLocale}`}
            className="whitespace-nowrap text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            {otherLocale.toUpperCase()}
          </Link>
          <ButtonPrimaryPill className="whitespace-nowrap">
            <span className="hidden sm:inline">{cta}</span>
            <span className="sm:hidden">{ctaShort}</span>
          </ButtonPrimaryPill>
        </div>
      </div>
    </GlassPanel>
  );
}
