import { SUPPORTED_LOCALES, type Locale } from "./locales";

/**
 * Picks the best-matching supported locale from a raw `Accept-Language`
 * header (e.g. "de-CH,de;q=0.9,en;q=0.8,*;q=0.5"), honoring q-values.
 * Falls back to "de" (the site default) when nothing matches or the header
 * is absent.
 */
export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "de";

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", qPart] = part.trim().split(";q=");
      const quality = qPart ? parseFloat(qPart) : 1;
      return { tag: (tag.trim().split("-")[0] ?? "").toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    if ((SUPPORTED_LOCALES as readonly string[]).includes(tag)) {
      return tag as Locale;
    }
  }

  return "de";
}
