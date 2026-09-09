import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublishedCourses } from "@/lib/courses";
import type { Locale } from "@/lib/locales";
import { getAllModuleTeasers, getHomePage } from "@/lib/sanity";

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
 * module teasers (ModuleBento) come live from Sanity `module` documents,
 * course listings (CoursesTeaser) come live from real Supabase
 * course_series, and the rest of the page's text (hero, process steps,
 * quote, closing CTA) comes from the single Sanity `homePage` document --
 * nav/footer chrome (site-wide, not homepage-specific) is still
 * app-level copy.ts text.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const home = await getHomePage(params.locale);
  if (!home) return {};
  return { title: home.heroHeadline, description: home.heroSubtext };
}

export default async function PreviewHomePage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];
  const [home, modules, courses] = await Promise.all([
    getHomePage(params.locale),
    getAllModuleTeasers(params.locale),
    getPublishedCourses(params.locale),
  ]);
  if (!home) {
    notFound();
  }

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
          headline={home.heroHeadline}
          subtext={home.heroSubtext ?? ""}
          primaryCta={home.heroPrimaryCta ?? ""}
          secondaryCta={home.heroSecondaryCta ?? ""}
        />
        <ModuleBento heading={home.modulesHeading ?? ""} modules={modules} locale={params.locale} />
        <CoursesTeaser
          heading={home.coursesHeading ?? ""}
          subtext={home.coursesSubtext ?? ""}
          courses={courses}
          cta={home.coursesCta ?? ""}
          locale={params.locale}
        />
        <ProcessStrip
          heading={home.processHeading ?? ""}
          steps={home.processSteps.map((step) => ({ verb: step.verb, body: step.body ?? "" }))}
        />
        <QuoteBlock
          label={home.quoteLabel ?? ""}
          body={home.quoteBody ?? ""}
          attribution={home.quoteAttribution ?? ""}
        />
        <ClosingCta headline={home.closingHeadline ?? ""} cta={home.closingCta ?? ""} />
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
