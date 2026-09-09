import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublishedCourses } from "@/lib/courses";
import type { Locale } from "@/lib/locales";
import { getAllModuleTeasers, getHomePage, type HomePageSection } from "@/lib/sanity";

import { HOME_COPY } from "./copy";
import { ClosingCta } from "./sections/ClosingCta";
import { CoursesTeaser } from "./sections/CoursesTeaser";
import { Hero } from "./sections/Hero";
import { ImageTextCta } from "./sections/ImageTextCta";
import { ModuleBento } from "./sections/ModuleBento";
import { Nav } from "./sections/Nav";
import { ProcessStrip } from "./sections/ProcessStrip";
import { QuoteBlock } from "./sections/QuoteBlock";
import { SiteFooter } from "./sections/SiteFooter";

/**
 * The homepage's body is a flexible, editor-ordered list of Sanity
 * `homePage.sections` blocks (2026-09-09 rework -- Danny: "Homepage
 * needs to be FLEXIBLE!!!! ... guide them sideways to our topics"), each
 * mapped to a real design-system section component below. Module
 * teasers (ModuleBento) come live from Sanity `module` documents;
 * course listings (CoursesTeaser) come live from real Supabase
 * course_series -- both independent of the sections order/config.
 * nav/footer chrome (site-wide, not homepage-specific) is still
 * app-level copy.ts text.
 */
export const dynamic = "force-dynamic";

function findSection<T extends HomePageSection["_type"]>(
  sections: HomePageSection[],
  type: T,
): Extract<HomePageSection, { _type: T }> | undefined {
  return sections.find((s): s is Extract<HomePageSection, { _type: T }> => s._type === type);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const home = await getHomePage(params.locale);
  const hero = home && findSection(home.sections, "heroBlock");
  if (!hero) return {};
  return { title: hero.headline, description: hero.subtext };
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
        {home.sections.map((section, i) => {
          switch (section._type) {
            case "heroBlock":
              return (
                <Hero
                  key={i}
                  headline={section.headline}
                  subtext={section.subtext ?? ""}
                  imageUrl={section.imageUrl}
                  primaryCta={section.primaryCta}
                  secondaryCta={section.secondaryCta}
                />
              );
            case "moduleGridBlock":
              return (
                <ModuleBento
                  key={i}
                  heading={section.heading ?? ""}
                  modules={modules}
                  locale={params.locale}
                />
              );
            case "courseGridBlock":
              return (
                <CoursesTeaser
                  key={i}
                  heading={section.heading ?? ""}
                  subtext={section.subtext ?? ""}
                  courses={courses}
                  cta={section.ctaLabel}
                  locale={params.locale}
                />
              );
            case "imageTextCtaBlock":
              return (
                <ImageTextCta
                  key={i}
                  imageUrl={section.imageUrl}
                  heading={section.heading}
                  body={section.body}
                  cta={section.cta}
                  imageOnRight={i % 2 === 1}
                />
              );
            case "processStepsBlock":
              return (
                <ProcessStrip
                  key={i}
                  heading={section.heading ?? ""}
                  steps={section.steps.map((step) => ({ verb: step.verb, body: step.body ?? "" }))}
                />
              );
            case "quoteBlock":
              return (
                <QuoteBlock
                  key={i}
                  label={section.label ?? ""}
                  body={section.body ?? ""}
                  attribution={section.attribution ?? ""}
                />
              );
            case "ctaBannerBlock":
              return <ClosingCta key={i} headline={section.headline} cta={section.cta} />;
            default:
              return null;
          }
        })}
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
