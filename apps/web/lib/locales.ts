// Only de-CH (default) and en ship in Phase 0. fr-CH/it-CH can be added
// later as a pure content addition, no schema/code change needed
// (01-ARCHITECTURE.md §6) — just extend this list once real content exists.
//
// Kept outside app/[locale]/layout.tsx on purpose: Next.js only allows a
// fixed set of named exports from a layout/page file (default,
// generateStaticParams, metadata, ...) and errors on anything else.
export const SUPPORTED_LOCALES = ["de", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
