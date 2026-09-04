import type { Locale } from "@/lib/locales";

const INTL_LOCALE: Record<Locale, string> = {
  de: "de-CH",
  en: "en-CH",
};

export function formatPostDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}
