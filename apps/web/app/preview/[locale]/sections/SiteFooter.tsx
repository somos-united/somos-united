import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import type { Locale } from "@/lib/locales";

/**
 * `footer-light` per 04-DESIGN-SYSTEM.md §6: canvas fill, ink-mute text,
 * caption type, generous top/bottom padding.
 */
export function SiteFooter({
  locale,
  tagline,
  contactLabel,
  linksHeading,
  legalHeading,
  impressumLabel,
  datenschutzLabel,
}: {
  locale: Locale;
  tagline: string;
  contactLabel: string;
  linksHeading: string;
  legalHeading: string;
  impressumLabel: string;
  datenschutzLabel: string;
}) {
  return (
    <footer className="border-t border-hairline bg-canvas py-huge">
      <div className="mx-auto flex max-w-6xl flex-col gap-xl px-lg md:flex-row md:items-start md:justify-between md:px-xl">
        <div>
          <span className="text-heading-md text-ink">Somos United</span>
          <p className="mt-xs max-w-[32ch] text-caption text-ink-mute">{tagline}</p>
        </div>

        <div className="flex flex-col gap-xl sm:flex-row sm:gap-xxl">
          <div>
            <p className="text-caption font-semibold text-ink">{linksHeading}</p>
            <a
              href="mailto:tech@somosunited.ch"
              className="mt-sm inline-flex items-center gap-xxs text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
            >
              {contactLabel}
              <ArrowRight size={14} weight="bold" aria-hidden />
            </a>
          </div>

          <div>
            <p className="text-caption font-semibold text-ink">{legalHeading}</p>
            <div className="mt-sm flex flex-col gap-xxs">
              <Link
                href={`/preview/${locale}/legal/impressum`}
                className="text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
              >
                {impressumLabel}
              </Link>
              <Link
                href={`/preview/${locale}/legal/datenschutz`}
                className="text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
              >
                {datenschutzLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
