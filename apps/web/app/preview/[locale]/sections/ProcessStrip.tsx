/**
 * A different layout family from the Bento grid above and the quote/CTA
 * below (Section-Layout-Repetition rule) - a connected horizontal flow
 * instead of another card grid, so three sections in a row don't all read
 * as "boxes in a grid." Large numerals carry the sequence instead of
 * "Stage 1/2/3" labels.
 */
export function ProcessStrip({
  heading,
  steps,
}: {
  heading: string;
  steps: { verb: string; body: string }[];
}) {
  return (
    <section className="bg-canvas-soft py-huge">
      <div className="mx-auto max-w-6xl px-lg md:px-xl">
        <h2 className="text-display-section text-ink">{heading}</h2>

        <div className="mt-xl grid grid-cols-1 gap-xl md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.verb} className="relative border-t border-hairline pt-lg">
              <span className="text-display-section text-primary-subdued-bg">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-sm text-heading-lg text-ink">{step.verb}</h3>
              <p className="mt-xs max-w-[32ch] text-body text-ink-secondary">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
