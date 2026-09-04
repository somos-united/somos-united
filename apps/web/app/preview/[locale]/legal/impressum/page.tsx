import type { Locale } from "@/lib/locales";

import { HOME_COPY, LEGAL_PAGE_COPY } from "../../copy";
import { Nav } from "../../sections/Nav";
import { SiteFooter } from "../../sections/SiteFooter";

/**
 * Unlike every other page in /preview, this one is not placeholder
 * marketing copy waiting to be swapped for real content later - it's a
 * legal identification requirement. The address/UID/responsible-person
 * fields are deliberately rendered as an honest "pending" state (see
 * copy.ts's LEGAL_PAGE_COPY doc comment) rather than invented, since a
 * fabricated address here would be a real problem, not just an
 * inaccuracy to fix in a later pass.
 */
export default function ImpressumPage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];
  const copy = LEGAL_PAGE_COPY[params.locale].impressum;

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

          <div className="mt-lg text-body text-ink-secondary">
            <p className="font-semibold text-ink">Verein Somos United</p>
            <p className="mt-xs italic text-ink-mute">{copy.addressPending}</p>
            <p className="mt-xs">Schweiz</p>
            <p className="mt-md">
              {copy.contactLabel}:{" "}
              <a href="mailto:tech@somosunited.ch" className="underline decoration-1 underline-offset-4">
                tech@somosunited.ch
              </a>
            </p>
            <p className="mt-xs italic text-ink-mute">{copy.uidPending}</p>
            <p className="mt-xs italic text-ink-mute">{copy.responsiblePending}</p>
          </div>

          <h2 className="mt-xl text-heading-lg text-ink">{copy.liabilityHeading}</h2>
          <p className="mt-sm max-w-[65ch] text-body text-ink-secondary">{copy.liabilityBody}</p>

          <h2 className="mt-xl text-heading-lg text-ink">{copy.linksHeading}</h2>
          <p className="mt-sm max-w-[65ch] text-body text-ink-secondary">{copy.linksBody}</p>
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
