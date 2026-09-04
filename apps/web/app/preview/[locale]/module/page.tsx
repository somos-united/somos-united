import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import type { Locale } from "@/lib/locales";

import { HOME_COPY, MODULE_PAGE_COPY, type ModuleTeaser } from "../copy";
import { Nav } from "../sections/Nav";
import { SiteFooter } from "../sections/SiteFooter";

/**
 * Module index: a real directory page (uniform grid, one card per
 * category) rather than the homepage's asymmetric Bento teaser -
 * scannable and consistent is the right call here since finding a
 * specific module is the job, not making a strong first visual
 * impression (that's the homepage's job). Links from the homepage's
 * ModuleBento tiles land here or skip straight to a detail page.
 */
export default function ModuleIndexPage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];
  const copy = MODULE_PAGE_COPY[params.locale];

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
        <section className="mx-auto max-w-6xl px-lg py-huge md:px-xl">
          <h1 className="text-display-section text-ink">{copy.indexHeading}</h1>
          <p className="mt-sm max-w-[60ch] text-body text-ink-secondary">{copy.indexSubtext}</p>

          <div className="mt-xl grid grid-cols-1 gap-lg md:grid-cols-2">
            {t.modules.map((module, i) => (
              <ModuleIndexCard
                key={module.category}
                module={module}
                locale={params.locale}
                ageLabel={copy.ageLabel}
                isCoral={i % 2 === 1}
              />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter
        tagline={t.footer.tagline}
        contactLabel={t.footer.contactLabel}
        linksHeading={t.footer.linksHeading}
      />
    </>
  );
}

function ModuleIndexCard({
  module,
  locale,
  ageLabel,
  isCoral,
}: {
  module: ModuleTeaser;
  locale: Locale;
  ageLabel: string;
  isCoral: boolean;
}) {
  return (
    <Link
      href={`/preview/${locale}/module/${module.category}`}
      className="flex flex-col overflow-hidden rounded-lg border border-hairline transition-colors hover:border-primary"
    >
      <div className="flex aspect-[3/1] items-center justify-center bg-[linear-gradient(135deg,var(--color-canvas-lavender)_0%,var(--color-canvas-mint)_100%)]">
        <span className="text-caption text-ink-mute">[Illustration folgt]</span>
      </div>
      <div className="flex flex-1 flex-col p-xl">
        <span
          className={`inline-block w-fit rounded-pill px-md py-xxs text-caption ${
            isCoral
              ? "bg-accent-coral-subtle-bg text-accent-coral-deep"
              : "bg-primary-subdued-bg text-primary"
          }`}
        >
          {ageLabel}: {module.ageRange}
        </span>
        <h2 className="mt-md text-heading-lg text-ink">{module.title}</h2>
        <p className="mt-sm text-body text-ink-secondary">{module.teaser}</p>
        <span className="mt-lg inline-flex items-center gap-xs text-button text-primary">
          <ArrowRight size={16} weight="bold" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
