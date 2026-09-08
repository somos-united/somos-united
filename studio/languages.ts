/**
 * Central i18n locale list (01-ARCHITECTURE.md §6): de-CH is default/first,
 * en is the second supported locale for Phase 0/1. fr-CH/it-CH can be added
 * here later as a pure content/config addition once timing is decided
 * (00-MASTER-PLAN.md §9) — no schema change required elsewhere, every
 * schema that needs a language list (module/page/blogPost/legalDocument via
 * the documentInternationalization plugin config, siteSettings.defaultLocale)
 * reads from this one array.
 */
export const LANGUAGES = [
  { id: "de-CH", title: "Deutsch (Schweiz)" },
  { id: "en", title: "English" },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];

export const DEFAULT_LANGUAGE: LanguageId = LANGUAGES[0].id;

/**
 * Sanity object-field names must be valid identifiers (no hyphens), so a
 * per-language field inside a single localized document — e.g.
 * `title: { de: "...", en: "..." }` in module.ts — can't key directly off
 * LANGUAGES[].id ("de-CH"). This is the one place that maps a language id to
 * its safe field name.
 */
export const LOCALE_FIELD_NAMES: Record<LanguageId, string> = {
  "de-CH": "de",
  en: "en",
};
