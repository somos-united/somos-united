import type { ModuleTeaser } from "../copy";

/**
 * The Bento grid named in 04-DESIGN-SYSTEM.md §5: one large 2×2 feature
 * field, then a mix of 2×1/1×1 tiles, gap `spacing.lg`, radius `lg`,
 * collapsing to a single column on mobile with the large field first.
 *
 * Six modules -> six cells, matching the design system's own layout example
 * exactly (large + two 2×1 + two 1×1 + one 2×1) on a 4-column desktop grid:
 *   [ 1 (2x2)      ][ 2 (2x1)     ]
 *   [ 1 (2x2)      ][3 (1x1)][4(1x1)]
 *   [ 5 (2x1)      ][ 6 (2x1)     ]
 *
 * Chip color alternates primary/coral per module (§6 category-chip spec:
 * "alternierend ... für visuelle Abwechslung zwischen Kategorien"), and the
 * large tile carries a soft gradient wash so the grid isn't six flat
 * white-on-white cards.
 */
const CELL_SPAN = [
  "md:col-span-2 md:row-span-2", // 1: Medienkompetenz, large flagship
  "md:col-span-2", // 2
  "md:col-span-1", // 3
  "md:col-span-1", // 4
  "md:col-span-2", // 5
  "md:col-span-2", // 6
];

export function ModuleBento({ heading, modules }: { heading: string; modules: ModuleTeaser[] }) {
  return (
    <section className="mx-auto max-w-6xl px-lg py-huge md:px-xl">
      <h2 className="text-display-section text-ink">{heading}</h2>

      <div className="mt-xl grid grid-cols-1 gap-lg md:grid-cols-4">
        {modules.map((module, i) => {
          const isLarge = i === 0;
          const isCoral = i % 2 === 1;

          return (
            <div
              key={module.category}
              className={`flex flex-col justify-between rounded-lg border border-hairline p-xl ${CELL_SPAN[i]} ${
                isLarge
                  ? "bg-[linear-gradient(135deg,var(--color-canvas-lavender)_0%,var(--color-canvas)_65%)]"
                  : "bg-canvas-soft"
              }`}
            >
              <div>
                <span
                  className={`inline-block rounded-pill px-md py-xxs text-caption ${
                    isCoral
                      ? "bg-accent-coral-subtle-bg text-accent-coral-deep"
                      : "bg-primary-subdued-bg text-primary"
                  }`}
                >
                  {module.title}
                </span>
                <h3
                  className={`mt-md text-ink ${isLarge ? "text-display-section" : "text-heading-lg"}`}
                >
                  {module.title}
                </h3>
                <p className="mt-sm max-w-[38ch] text-body text-ink-secondary">
                  {module.teaser}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
