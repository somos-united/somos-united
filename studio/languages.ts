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
