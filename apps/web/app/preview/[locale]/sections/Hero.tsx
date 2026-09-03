import { ArrowRight } from "@phosphor-icons/react/ssr";

import { ButtonPrimaryPill, ButtonSecondary } from "@somos/ui";

/**
 * Asymmetric split hero, not centered (04-DESIGN-SYSTEM.md's Bento/asymmetric
 * direction). Right side is a CSS gradient-mesh blob per §4 (peach → lavender
 * → mint) — the doc's own documented stand-in for real illustration/photography,
 * which doesn't exist yet (§8: "kein eigenes Fotomaterial vorhanden").
 *
 * Motion is CSS-only (`gradient-drift`, already defined in globals.css,
 * wrapped in `motion-safe:`) — no JS animation library. A prior iOS Safari
 * bug came from a JS-driven entrance holding above-the-fold content at
 * opacity:0 until hydration finished; CSS keyframes start at first paint
 * regardless of JS/network conditions.
 */
export function Hero({
  headline,
  subtext,
  primaryCta,
  secondaryCta,
}: {
  headline: string;
  subtext: string;
  primaryCta: string;
  secondaryCta: string;
}) {
  return (
    <section className="flex min-h-[100svh] items-center pt-16 md:pt-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-xxl px-lg md:grid-cols-2 md:px-xl">
        <div>
          <h1 className="text-display-hero text-ink md:text-display-hero-lg">{headline}</h1>
          <p className="mt-lg max-w-[42ch] text-body-lg text-ink-secondary">{subtext}</p>
          <div className="mt-xl flex flex-wrap gap-md">
            <ButtonPrimaryPill className="gap-xs">
              {primaryCta}
              <ArrowRight size={18} weight="bold" aria-hidden />
            </ButtonPrimaryPill>
            <ButtonSecondary>{secondaryCta}</ButtonSecondary>
          </div>
        </div>

        <div
          aria-hidden
          className="relative isolate aspect-square overflow-hidden rounded-xl bg-canvas-soft motion-safe:animate-[gradient-drift_16s_ease-in-out_infinite] bg-[length:160%_160%] bg-[radial-gradient(circle_at_20%_25%,var(--color-canvas-peach)_0%,transparent_45%),radial-gradient(circle_at_75%_30%,var(--color-canvas-lavender)_0%,transparent_50%),radial-gradient(circle_at_50%_80%,var(--color-canvas-mint)_0%,transparent_55%)]"
        >
          <div className="absolute inset-0 rounded-xl border border-hairline" />
        </div>
      </div>
    </section>
  );
}
