import { ArrowRight } from "@phosphor-icons/react/ssr";

/**
 * Full-width solid band - a distinct layout family from the hero's
 * asymmetric split, so the page doesn't repeat the same composition at
 * open and close. Same CTA label as the hero's primary button
 * deliberately (reinforcement of one intent, not a second competing one -
 * see the no-duplicate-CTA-intent rule, which is about different wording
 * for the same intent, not reusing one label twice).
 *
 * Not reusing ButtonPrimaryPill here: it hardcodes `bg-primary`, and on a
 * `bg-primary` section that CTA needs to invert (white fill, primary
 * text) to stay visible - overriding via a trailing className would
 * depend on Tailwind's internal utility ordering rather than source
 * order, which isn't reliable. A local inverted button avoids that.
 */
export function ClosingCta({ headline, cta }: { headline: string; cta: string }) {
  return (
    <section className="bg-primary py-huge text-center">
      <div className="mx-auto max-w-2xl px-lg md:px-xl">
        <h2 className="text-display-section text-on-primary">{headline}</h2>
        <div className="mt-lg">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-xs rounded-pill bg-on-primary px-xl py-sm text-button text-primary transition-colors hover:bg-canvas-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary"
          >
            {cta}
            <ArrowRight size={18} weight="bold" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
