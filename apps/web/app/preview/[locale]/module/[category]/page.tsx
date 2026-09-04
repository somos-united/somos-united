import type { ModuleCategory } from "@somos/types";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/locales";

import { HOME_COPY, MODULE_PAGE_COPY } from "../../copy";
import { CoursesTeaser } from "../../sections/CoursesTeaser";
import type { CourseCardData } from "../../sections/CoursesTeaser";
import { Nav } from "../../sections/Nav";
import { SiteFooter } from "../../sections/SiteFooter";

/**
 * Rendered per-request, not statically pre-rendered like the rest of
 * this site - deliberately no generateStaticParams here. Next.js
 * prerenders every param generateStaticParams enumerates regardless of
 * `dynamic = "force-dynamic"`, so the two can't coexist for what this
 * page actually needs: the "mixed" fallback below has to be genuinely
 * random per visit, not frozen at build time (Danny: "refresh with
 * every load"). Invalid category values still 404 via the notFound()
 * check below.
 */
export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; category: string };
}): Metadata {
  const t = HOME_COPY[params.locale];
  const module_ = t.modules.find((m) => m.category === params.category);
  if (!module_) return {};
  return { title: module_.title, description: module_.teaser };
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/**
 * Danny 2026-09-04: a module with only 1-2 courses of its own looks
 * broken as a sparse single-card grid - and that's the real current
 * state of every module today, not a hypothetical. Below a threshold,
 * mix in the whole catalog at random instead of spotlighting the
 * thinness of one topic; once a topic has enough of its own courses,
 * stay focused and don't dilute it with unrelated ones. Capped at 6
 * regardless of total catalog size ("prepare for a full roster").
 */
const MIN_TOPIC_COURSES_TO_STAY_FOCUSED = 4;
const MAX_COURSES_SHOWN = 6;

function selectModuleCourses(
  allCourses: CourseCardData[],
  category: ModuleCategory,
): { courses: CourseCardData[]; isMixed: boolean } {
  const topicCourses = allCourses.filter((c) => c.moduleCategory === category);
  if (topicCourses.length > MIN_TOPIC_COURSES_TO_STAY_FOCUSED) {
    return { courses: topicCourses.slice(0, MAX_COURSES_SHOWN), isMixed: false };
  }
  return { courses: shuffle(allCourses).slice(0, MAX_COURSES_SHOWN), isMixed: true };
}

export default function ModuleDetailPage({
  params,
}: {
  params: { locale: Locale; category: string };
}) {
  const t = HOME_COPY[params.locale];
  const copy = MODULE_PAGE_COPY[params.locale];

  const module_ = t.modules.find((m) => m.category === params.category);
  if (!module_) {
    notFound();
  }

  const { courses: displayedCourses, isMixed } = selectModuleCourses(
    t.courses.items,
    module_.category,
  );
  const otherModules = t.modules.filter((m) => m.category !== module_.category);

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
        active="module"
      />
      <main>
        <section className="mx-auto max-w-6xl px-lg pt-xl md:px-xl">
          <Link
            href={`/preview/${params.locale}/module`}
            className="inline-flex items-center gap-xs text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            {copy.backToModules}
          </Link>

          <div className="mt-lg grid grid-cols-1 items-center gap-xl md:grid-cols-2">
            <div>
              <span className="inline-block w-fit rounded-pill bg-primary-subdued-bg px-md py-xxs text-caption text-primary">
                {copy.ageLabel}: {module_.ageRange}
              </span>
              <h1 className="mt-md text-display-hero text-ink">{module_.title}</h1>
              {module_.description.map((paragraph) => (
                <p key={paragraph} className="mt-md max-w-[60ch] text-body text-ink-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--color-canvas-lavender)_0%,var(--color-canvas-mint)_100%)]">
              <span className="text-caption text-ink-mute">[Illustration folgt]</span>
            </div>
          </div>
        </section>

        {displayedCourses.length > 0 ? (
          <CoursesTeaser
            heading={isMixed ? copy.detailCoursesMixedHeading : copy.detailCoursesHeading(module_.title)}
            subtext={isMixed ? copy.detailCoursesMixedSubtext : copy.detailCoursesSubtext}
            courses={displayedCourses}
            cta={t.courses.cta}
          />
        ) : (
          <section className="mx-auto max-w-6xl px-lg py-huge md:px-xl">
            <p className="text-body text-ink-secondary">{copy.detailCoursesEmpty}</p>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-lg pb-huge md:px-xl">
          <h2 className="text-heading-lg text-ink">{copy.otherModulesHeading}</h2>
          <div className="mt-lg grid grid-cols-2 gap-md md:grid-cols-5">
            {otherModules.map((other) => (
              <Link
                key={other.category}
                href={`/preview/${params.locale}/module/${other.category}`}
                className="rounded-lg border border-hairline p-lg transition-colors hover:border-primary"
              >
                <span className="text-body font-semibold text-ink">{other.title}</span>
              </Link>
            ))}
          </div>
        </section>
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
