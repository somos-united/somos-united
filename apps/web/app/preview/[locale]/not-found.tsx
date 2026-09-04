import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import type { Locale } from "@/lib/locales";

import { HOME_COPY, NOT_FOUND_COPY } from "./copy";
import { Nav } from "./sections/Nav";
import { SiteFooter } from "./sections/SiteFooter";

/**
 * Catches notFound() calls from anywhere under /preview/[locale]/*
 * (module/[category], blog/[slug]) plus any unmatched path in this
 * segment - branded and locale-aware instead of Next's default blank
 * 404, matching the rest of the site's chrome.
 */
export default function PreviewNotFound({ params }: { params?: { locale: Locale } }) {
  const locale = params?.locale ?? "de";
  const t = HOME_COPY[locale];
  const copy = NOT_FOUND_COPY[locale];

  return (
    <>
      <Nav
        locale={locale}
        cta={t.nav.cta}
        ctaShort={t.nav.ctaShort}
        moduleLabel={t.nav.moduleLabel}
        aboutLabel={t.nav.aboutLabel}
        blogLabel={t.nav.blogLabel}
        menuOpenLabel={t.nav.menuOpenLabel}
        menuCloseLabel={t.nav.menuCloseLabel}
        active="home"
      />
      <main>
        <section className="mx-auto max-w-3xl px-lg py-huge text-center md:px-xl">
          <span className="text-display-hero text-primary">404</span>
          <h1 className="mt-md text-display-section text-ink">{copy.heading}</h1>
          <p className="mt-sm text-body text-ink-secondary">{copy.body}</p>
          <Link
            href={`/preview/${locale}`}
            className="mt-xl inline-flex items-center gap-xs rounded-pill bg-primary px-xl py-sm text-button text-on-primary transition-colors hover:bg-primary-press"
          >
            {copy.cta}
            <ArrowRight size={16} weight="bold" aria-hidden />
          </Link>
        </section>
      </main>
      <SiteFooter
        locale={locale}
        tagline={t.footer.tagline}
        contactLabel={t.footer.contactLabel}
        linksHeading={t.footer.linksHeading}
        legalHeading={t.footer.legalHeading}
        impressumLabel={t.footer.impressumLabel}
        datenschutzLabel={t.footer.datenschutzLabel}
      />
    </>
  );
}
