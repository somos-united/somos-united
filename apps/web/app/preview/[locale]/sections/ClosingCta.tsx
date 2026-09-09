import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import type { ResolvedCta } from "@/lib/sanity";

const INVERTED_PILL_CLASSNAME =
  "inline-flex items-center justify-center gap-xs rounded-pill bg-on-primary px-xl py-sm text-button text-primary transition-colors hover:bg-canvas-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary";

/**
 * Full-width solid band - a distinct layout family from the hero's
 * asymmetric split, so the page doesn't repeat the same composition at
 * open and close.
 *
 * Not reusing ButtonPrimaryPill/its shared classname here: on a
 * `bg-primary` section the CTA needs to invert (white fill, primary
 * text) to stay visible - overriding via a trailing className would
 * depend on Tailwind's internal utility ordering rather than source
 * order, which isn't reliable. A local inverted style avoids that.
 *
 * Real `<Link>` now, not an inert button -- `cta.href` comes from the
 * Sanity ctaBannerBlock's own configurable link target (lib/sanity.ts).
 * With no resolvable href, renders as plain text rather than a dead link.
 */
export function ClosingCta({ headline, cta }: { headline: string; cta: ResolvedCta }) {
  return (
    <section className="bg-primary py-huge text-center">
      <div className="mx-auto max-w-2xl px-lg md:px-xl">
        <h2 className="text-display-section text-on-primary">{headline}</h2>
        <div className="mt-lg">
          {cta.href ? (
            <Link href={cta.href} className={INVERTED_PILL_CLASSNAME}>
              {cta.label}
              <ArrowRight size={18} weight="bold" aria-hidden />
            </Link>
          ) : (
            <span className={`${INVERTED_PILL_CLASSNAME} opacity-50`}>{cta.label}</span>
          )}
        </div>
      </div>
    </section>
  );
}
