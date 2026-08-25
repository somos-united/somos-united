import Link from "next/link";

import { GlassPanel } from "@somos/ui";

import type { Locale } from "@/lib/locales";

const copy: Record<
  Locale,
  { eyebrow: string; title: string; body: string; footer: string }
> = {
  de: {
    eyebrow: "In Vorbereitung",
    title: "Stark ins Leben.",
    body: "Somos United baut eine neue Plattform für Kurse und Begleitung, die junge Menschen stärker machen. Bald online.",
    footer: "Verein Somos United, Schweiz",
  },
  en: {
    eyebrow: "Coming soon",
    title: "Strong into life.",
    body: "Somos United is building a new platform for courses and support that help young people grow stronger. Live soon.",
    footer: "Verein Somos United, Switzerland",
  },
};

export default function LocaleHomePage({ params }: { params: { locale: Locale } }) {
  const t = copy[params.locale];
  const otherLocale: Locale = params.locale === "de" ? "en" : "de";

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-lg bg-hero-gradient px-lg py-huge text-center">
      <GlassPanel className="motion-safe:animate-[fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_both] flex max-w-lg flex-col items-center gap-md p-xl">
        <span className="text-caption uppercase tracking-[0.14em] text-ink-mute">
          {t.eyebrow}
        </span>
        <p className="text-heading-md text-primary">Somos United</p>
        <h1 className="text-display-hero text-ink">{t.title}</h1>
        <p className="text-body text-ink-secondary">{t.body}</p>
        <Link href={`/${otherLocale}`} className="text-caption text-primary underline">
          {otherLocale.toUpperCase()}
        </Link>
      </GlassPanel>
      <p className="text-caption text-ink-mute">{t.footer}</p>
    </main>
  );
}
