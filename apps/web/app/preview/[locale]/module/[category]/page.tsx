import type { ModuleCategory } from "@somos/types";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/locales";
import { SUPPORTED_LOCALES } from "@/lib/locales";

import { HOME_COPY, MODULE_PAGE_COPY } from "../../copy";
import { CoursesTeaser } from "../../sections/CoursesTeaser";
import { Nav } from "../../sections/Nav";
import { SiteFooter } from "../../sections/SiteFooter";

const MODULE_CATEGORIES: ModuleCategory[] = [
  "medienkompetenz",
  "respekt",
  "gewaltpraevention",
  "psychische_belastung",
  "orientierung",
  "social_media",
];

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    MODULE_CATEGORIES.map((category) => ({ locale, category })),
  );
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

  const relatedCourses = t.courses.items.filter((c) => c.moduleCategory === module_.category);

  return (
    <>
      <Nav
        locale={params.locale}
        cta={t.nav.cta}
        ctaShort={t.nav.ctaShort}
        moduleLabel={t.nav.moduleLabel}
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

        {relatedCourses.length > 0 ? (
          <CoursesTeaser
            heading={copy.detailCoursesHeading(module_.title)}
            subtext={copy.detailCoursesSubtext}
            courses={relatedCourses}
            cta={t.courses.cta}
          />
        ) : (
          <section className="mx-auto max-w-6xl px-lg py-huge md:px-xl">
            <p className="text-body text-ink-secondary">{copy.detailCoursesEmpty}</p>
          </section>
        )}
      </main>
      <SiteFooter
        tagline={t.footer.tagline}
        contactLabel={t.footer.contactLabel}
        linksHeading={t.footer.linksHeading}
      />
    </>
  );
}
