import type { Icon } from "@phosphor-icons/react";
import { HandHeart, ShieldCheck, Sparkle, Target, UsersThree } from "@phosphor-icons/react/ssr";

import type { Locale } from "@/lib/locales";

import { ABOUT_PAGE_COPY, HOME_COPY, type AboutValue } from "../copy";
import { ClosingCta } from "../sections/ClosingCta";
import { Nav } from "../sections/Nav";
import { SiteFooter } from "../sections/SiteFooter";

const VALUE_ICONS: Record<AboutValue["icon"], Icon> = {
  shield: ShieldCheck,
  heart: HandHeart,
  users: UsersThree,
  target: Target,
};

/**
 * Content-heavy page, deliberately less UI-pattern-heavy than the
 * homepage/module work - a compact intro (not the homepage's full
 * 100svh Hero, which would feel repetitive as a second full-viewport
 * open), a story section, a values grid, and an honest placeholder for
 * team bios (no fabricated names/photos - same honesty rule as the
 * "[Illustration folgt]" placeholders elsewhere, see copy.ts).
 */
export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];
  const copy = ABOUT_PAGE_COPY[params.locale];

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
        active="about"
      />
      <main>
        <section className="mx-auto max-w-3xl px-lg py-huge text-center md:px-xl">
          <h1 className="text-display-hero text-ink">{copy.heading}</h1>
          <p className="mx-auto mt-lg max-w-[52ch] text-body-lg text-ink-secondary">
            {copy.subtext}
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-lg pb-huge md:px-xl">
          <h2 className="text-display-section text-ink">{copy.storyHeading}</h2>
          {copy.story.map((paragraph) => (
            <p key={paragraph} className="mt-md text-body text-ink-secondary">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-lg pb-huge md:px-xl">
          <h2 className="text-display-section text-ink">{copy.valuesHeading}</h2>
          <div className="mt-xl grid grid-cols-1 gap-lg sm:grid-cols-2 md:grid-cols-4">
            {copy.values.map((value) => {
              const Icon = VALUE_ICONS[value.icon];
              return (
                <div
                  key={value.title}
                  className="rounded-lg border border-hairline bg-canvas-soft p-xl"
                >
                  <Icon size={28} weight="duotone" />
                  <h3 className="mt-md text-heading-md text-ink">{value.title}</h3>
                  <p className="mt-xs text-body text-ink-secondary">{value.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-lg pb-huge md:px-xl">
          <h2 className="text-display-section text-ink">{copy.team.heading}</h2>
          <div className="mt-lg flex aspect-[3/1] items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--color-canvas-lavender)_0%,var(--color-canvas-mint)_100%)]">
            <div className="flex items-center gap-xs text-caption text-ink-mute">
              <Sparkle size={16} weight="bold" aria-hidden />
              {copy.team.placeholder}
            </div>
          </div>
        </section>

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
