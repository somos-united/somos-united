import type { Metadata } from "next";

import type { Locale } from "@/lib/locales";

import { HOME_COPY, LEGAL_PAGE_COPY } from "../../copy";
import { Nav } from "../../sections/Nav";
import { SiteFooter } from "../../sections/SiteFooter";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return { title: LEGAL_PAGE_COPY[params.locale].datenschutz.heading };
}

/**
 * Grounded in this project's actual documented data practices
 * (child-data minimization, Supabase Zürich region, Bird/Resend as
 * real processors, EDÖB breach-notification duty) rather than generic
 * boilerplate - but still a draft pending real legal review before
 * treating it as final, same caveat as the Impressum page.
 */
export default function DatenschutzPage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];
  const copy = LEGAL_PAGE_COPY[params.locale].datenschutz;

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
        active="legal"
      />
      <main>
        <article className="mx-auto max-w-3xl px-lg py-huge md:px-xl">
          <h1 className="text-display-section text-ink">{copy.heading}</h1>
          <p className="mt-md max-w-[65ch] text-body text-ink-secondary">{copy.intro}</p>

          <h2 className="mt-xl text-heading-lg text-ink">{copy.controllerHeading}</h2>
          <p className="mt-sm text-body text-ink-secondary">
            Verein Somos United
            <br />
            {copy.contactLabel}:{" "}
            <a href="mailto:tech@somosunited.ch" className="underline decoration-1 underline-offset-4">
              tech@somosunited.ch
            </a>
          </p>

          <h2 className="mt-xl text-heading-lg text-ink">{copy.dataHeading}</h2>
          <ul className="mt-sm flex max-w-[65ch] flex-col gap-xs text-body text-ink-secondary">
            {copy.dataItems.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>

          <h2 className="mt-xl text-heading-lg text-ink">{copy.purposeHeading}</h2>
          <p className="mt-sm max-w-[65ch] text-body text-ink-secondary">{copy.purposeBody}</p>

          <h2 className="mt-xl text-heading-lg text-ink">{copy.thirdPartiesHeading}</h2>
          <p className="mt-sm max-w-[65ch] text-body text-ink-secondary">{copy.thirdPartiesIntro}</p>
          <ul className="mt-sm flex max-w-[65ch] flex-col gap-xs text-body text-ink-secondary">
            {copy.thirdParties.map((party) => (
              <li key={party.name}>
                · <span className="font-semibold text-ink">{party.name}</span> — {party.role}
              </li>
            ))}
          </ul>

          <h2 className="mt-xl text-heading-lg text-ink">{copy.rightsHeading}</h2>
          <p className="mt-sm max-w-[65ch] text-body text-ink-secondary">{copy.rightsBody}</p>

          <h2 className="mt-xl text-heading-lg text-ink">{copy.breachHeading}</h2>
          <p className="mt-sm max-w-[65ch] text-body text-ink-secondary">{copy.breachBody}</p>
        </article>
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
