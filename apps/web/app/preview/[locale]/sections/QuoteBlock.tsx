/**
 * Deliberately labeled as a placeholder in the copy itself (both the
 * "Platzhalter" tag and the attribution) rather than a fabricated but
 * convincing family testimonial — inventing a specific named person's
 * quote and presenting it as real would be misleading for a real
 * nonprofit, even as a design mockup that might get mistaken for final
 * copy later. Real quotes replace this once gathered.
 */
export function QuoteBlock({
  label,
  body,
  attribution,
}: {
  label: string;
  body: string;
  attribution: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-lg py-huge text-center md:px-xl">
      <span className="inline-block rounded-pill bg-accent-teal-deep/10 px-md py-xxs text-caption text-accent-teal-deep">
        {label}
      </span>
      <p className="mt-lg text-heading-lg text-ink">&ldquo;{body}&rdquo;</p>
      <p className="mt-md text-caption text-ink-mute">{attribution}</p>
    </section>
  );
}
