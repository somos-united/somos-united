import type { Locale } from "@/lib/locales";

import { HOME_COPY } from "./copy";
import { ClosingCta } from "./sections/ClosingCta";
import { CoursesTeaser } from "./sections/CoursesTeaser";
import { Hero } from "./sections/Hero";
import { ModuleBento } from "./sections/ModuleBento";
import { Nav } from "./sections/Nav";
import { ProcessStrip } from "./sections/ProcessStrip";
import { QuoteBlock } from "./sections/QuoteBlock";
import { SiteFooter } from "./sections/SiteFooter";

/**
 * Design-direction preview: full hand-built layout with placeholder copy
 * (see copy.ts), not the generic Sanity section-builder that lived here
 * before. That fetch pipeline (lib/sanity.ts, proven working end-to-end
 * against the live project) is intentionally paused, not deleted - once
 * this direction is approved, each section's text moves into Sanity
 * `page`/`module` documents instead of copy.ts.
 */
export default function PreviewHomePage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];

  return (
    <>
      <Nav locale={params.locale} cta={t.nav.cta} />
      <main>
        <Hero
          headline={t.hero.headline}
          subtext={t.hero.subtext}
          primaryCta={t.hero.primaryCta}
          secondaryCta={t.hero.secondaryCta}
        />
        <ModuleBento heading={t.modulesHeading} modules={t.modules} />
        <CoursesTeaser
          heading={t.courses.heading}
          subtext={t.courses.subtext}
          courses={t.courses.items}
          cta={t.courses.cta}
        />
        <ProcessStrip heading={t.process.heading} steps={t.process.steps} />
        <QuoteBlock
          label={t.quote.label}
          body={t.quote.body}
          attribution={t.quote.attribution}
        />
        <ClosingCta headline={t.closing.headline} cta={t.closing.cta} />
      </main>
      <SiteFooter
        tagline={t.footer.tagline}
        contactLabel={t.footer.contactLabel}
        linksHeading={t.footer.linksHeading}
      />
    </>
  );
}
