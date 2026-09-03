import Link from "next/link";

import { ButtonPrimaryPill, GlassPanel } from "@somos/ui";

import type { Locale } from "@/lib/locales";

/**
 * Nav height stays within the 64-80px cap (py-sm on a text-heading-md
 * wordmark lands around 64px). Sparse glass usage per
 * 04-DESIGN-SYSTEM.md §4 — nav over the hero is exactly the case it names.
 */
export function Nav({ locale, cta }: { locale: Locale; cta: string }) {
  const otherLocale: Locale = locale === "de" ? "en" : "de";

  return (
    <GlassPanel className="sticky top-0 z-20 !rounded-none !border-x-0 !border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-lg py-sm">
        <span className="text-heading-md text-ink">Somos United</span>
        <div className="flex items-center gap-lg">
          <Link
            href={`/preview/${otherLocale}`}
            className="text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            {otherLocale.toUpperCase()}
          </Link>
          <ButtonPrimaryPill>{cta}</ButtonPrimaryPill>
        </div>
      </div>
    </GlassPanel>
  );
}
