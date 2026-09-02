import { PortableText } from "@portabletext/react";

import type { SanitySection } from "@/lib/sanity";

/**
 * Bento-grid span per section size (04-DESIGN-SYSTEM.md §5). "bento-large"
 * spans the full 2-column width, medium/small share a row — matches the
 * three options editors pick from in Sanity Studio (studio/schemaTypes/page.ts).
 */
const SPAN_CLASS: Record<NonNullable<SanitySection["layout"]>, string> = {
  "bento-large": "sm:col-span-2",
  "bento-medium": "sm:col-span-1",
  "bento-small": "sm:col-span-1",
};

export function SectionGrid({ sections }: { sections: SanitySection[] }) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
      {sections.map((section) => (
        <div
          key={section._key}
          className={`rounded-xl border border-hairline bg-canvas-soft p-xl ${
            section.layout ? SPAN_CLASS[section.layout] : ""
          }`}
        >
          {section.heading && <h2 className="text-heading-lg text-ink">{section.heading}</h2>}
          {section.body && (
            <div className="mt-md text-body text-ink-secondary">
              <PortableText value={section.body} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
