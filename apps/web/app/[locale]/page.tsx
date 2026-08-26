import Link from "next/link";

import type { Locale } from "@/lib/locales";

import { HoldingPageContent } from "./HoldingPageContent";

const copy: Record<Locale, { lead: string; contactLabel: string }> = {
  de: {
    lead: "Das ist",
    contactLabel: "Schreib uns",
  },
  en: {
    lead: "This is",
    contactLabel: "Drop us a line",
  },
};

export default function LocaleHomePage({ params }: { params: { locale: Locale } }) {
  const t = copy[params.locale];
  const otherLocale: Locale = params.locale === "de" ? "en" : "de";

  return (
    <div className="relative">
      <HoldingPageContent lead={t.lead} contactLabel={t.contactLabel} />
      <Link
        href={`/${otherLocale}`}
        className="absolute bottom-lg right-lg z-10 text-caption text-ink underline"
      >
        {otherLocale.toUpperCase()}
      </Link>
    </div>
  );
}
