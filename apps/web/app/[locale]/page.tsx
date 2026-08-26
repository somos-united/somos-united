import Link from "next/link";

import type { Locale } from "@/lib/locales";

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
    <main className="relative flex min-h-[100dvh] flex-col justify-center bg-[linear-gradient(180deg,#C8C2F4_0%,#CBBDEC_45%,#D6B9E7_100%)] px-lg py-huge">
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <p className="text-2xl font-normal text-ink md:text-3xl">{t.lead}</p>
        <h1 className="text-6xl font-black uppercase leading-[0.95] tracking-tight text-ink md:text-8xl">
          Somos
          <br />
          United
        </h1>
        <a
          href="mailto:tech@somosunited.ch"
          className="mt-md text-xl text-ink underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 md:text-2xl"
        >
          {t.contactLabel} →
        </a>
      </div>
      <Link
        href={`/${otherLocale}`}
        className="absolute bottom-lg right-lg text-caption text-ink underline"
      >
        {otherLocale.toUpperCase()}
      </Link>
    </main>
  );
}
