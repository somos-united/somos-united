import type { Metadata } from "next";

import { getPublishedCourses } from "@/lib/courses";
import type { Locale } from "@/lib/locales";
import { getAllModuleTeasers } from "@/lib/sanity";

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
 * Full hand-built layout, matching the approved design direction. The 6
 * module teasers (ModuleBento below) come live from Sanity `module`
 * documents, and the course listings (CoursesTeaser) come live from real
 * Supabase course_series -- everything else here is still app-level UI
 * chrome/copy.ts text (hero, process steps, quote).
 */
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const t = HOME_COPY[params.locale];
  return { title: t.hero.headline, description: t.hero.subtext };
}

export default async function PreviewHomePage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];
  const [modules, courses] = await Promise.all([
    getAllModuleTeasers(params.locale),
    getPublishedCourses(params.locale),
  ]);

  return (
    <>
      <Nav
        locale={params.locale}
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
        <Hero
          headline={t.hero.headline}
          subtext={t.hero.subtext}
          primaryCta={t.hero.primaryCta}
          secondaryCta={t.hero.secondaryCta}
        />
        <ModuleBento heading={t.modulesHeading} modules={modules} locale={params.locale} />
        <CoursesTeaser
          heading={t.courses.heading}
          subtext={t.courses.subtext}
          courses={courses}
          cta={t.courses.cta}
          locale={params.locale}
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
        locale={params.locale}
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
