import Link from "next/link";

import { ButtonPrimaryPill, ButtonSecondary, GlassPanel } from "@somos/ui";

import type { Locale } from "@/lib/locales";

const copy: Record<Locale, { title: string; body: string; primaryCta: string; secondaryCta: string }> = {
  de: {
    title: "Stark ins Leben.",
    body: "Somos United — Phase-0-Fundament. Das öffentliche Frontend folgt in Phase 1.",
    primaryCta: "Module entdecken",
    secondaryCta: "Mehr erfahren",
  },
  en: {
    title: "Strong into life.",
    body: "Somos United — Phase 0 foundation. The public frontend follows in Phase 1.",
    primaryCta: "Discover modules",
    secondaryCta: "Learn more",
  },
};

export default function LocaleHomePage({ params }: { params: { locale: Locale } }) {
  const t = copy[params.locale];
  const otherLocale: Locale = params.locale === "de" ? "en" : "de";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-lg bg-hero-gradient px-lg py-huge text-center">
      <GlassPanel className="flex max-w-lg flex-col items-center gap-md p-xl">
        <h1 className="text-display-hero text-ink">{t.title}</h1>
        <p className="text-body text-ink-secondary">{t.body}</p>
        <div className="flex items-center gap-sm">
          <ButtonPrimaryPill>{t.primaryCta}</ButtonPrimaryPill>
          <ButtonSecondary>{t.secondaryCta}</ButtonSecondary>
        </div>
        <Link href={`/${otherLocale}`} className="text-caption text-primary underline">
          {otherLocale.toUpperCase()}
        </Link>
      </GlassPanel>
    </main>
  );
}
