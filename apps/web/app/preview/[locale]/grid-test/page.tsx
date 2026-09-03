import type { ReactNode } from "react";

import type { Locale } from "@/lib/locales";

import { HOME_COPY } from "../copy";
import {
  CourseCardDetail,
  CourseCardQuick,
  CourseCardTeaser,
  type CourseCardData,
} from "../sections/CoursesTeaser";

/**
 * Internal-only sandbox: same 6 course cards from the homepage teaser,
 * dropped into different grid widths (part 1) and different card
 * "expressions" (part 2), so both axes can be compared before picking a
 * direction. Not linked from the site nav, not real content - reachable
 * only through the /preview/* Basic Auth gate, same as the homepage
 * draft.
 */
export default function GridTestPage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];
  const courses = t.courses.items;
  const cta = t.courses.cta;
  const isDe = params.locale === "de";
  // copy.ts always seeds 6 course items - safe to assert for this
  // review-only sandbox rather than add dead null-checks.
  const [course0, course1, course2, course3] = courses as [
    CourseCardData,
    CourseCardData,
    CourseCardData,
    CourseCardData,
    ...CourseCardData[],
  ];

  // Named card expressions, from most to least information-dense - see
  // CoursesTeaser.tsx for the full rationale on each.
  const expressions: { name: string; blurb: string; Card: typeof CourseCardDetail }[] = [
    {
      name: "Detail Card",
      blurb: isDe
        ? "Eyebrow, Titel, 4-5 Vorteile, Preis, CTA. Voller Informationsgehalt."
        : "Eyebrow, title, 4-5 benefits, price, CTA. Full information.",
      Card: CourseCardDetail,
    },
    {
      name: "Quick Card",
      blurb: isDe
        ? "Eyebrow, Titel, Preis, CTA. Ohne Vorteilsliste."
        : "Eyebrow, title, price, CTA. No benefit list.",
      Card: CourseCardQuick,
    },
    {
      name: "Teaser Card",
      blurb: isDe
        ? "Nur Titel + ein grosser Hard-Sell-CTA. Reiner Blickfang."
        : "Just title + one big hard-sell CTA. Pure eye-catcher.",
      Card: CourseCardTeaser,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-lg py-huge md:px-xl">
      <div className="mb-huge rounded-lg border border-hairline bg-canvas-lavender/40 p-lg">
        <h1 className="text-heading-lg text-ink">
          {isDe ? "Grid-Test — nur zur Ansicht" : "Grid test — review only"}
        </h1>
        <p className="mt-xs max-w-[60ch] text-body text-ink-secondary">
          {isDe
            ? "Dieselben 6 Kurskarten in verschiedenen Grid-Breiten und Card-Ausdrücken, um das Verhalten zu vergleichen. Keine Design-Entscheidung, kein echter Inhalt."
            : "The same 6 course cards across different grid widths and card expressions, to compare behavior. Not a design decision, not real content."}
        </p>
      </div>

      {/* ---------- Part 2: card expressions ---------- */}

      <h2 className="mb-md text-display-section text-ink">
        {isDe ? "Card-Ausdrücke" : "Card expressions"}
      </h2>
      <p className="mb-xl max-w-[60ch] text-body text-ink-secondary">
        {isDe
          ? "Drei benannte Varianten derselben Kursdaten — von voller Information bis reinem Blickfang."
          : "Three named variants of the same course data — from full information to pure eye-catcher."}
      </p>

      <div className="mb-huge grid grid-cols-1 gap-lg md:grid-cols-3">
        {expressions.map(({ name, blurb, Card }) => (
          <div key={name}>
            <p className="mb-sm text-caption uppercase tracking-wide text-ink-mute">{name}</p>
            <Card course={course0} cta={cta} />
            <p className="mt-sm text-caption text-ink-mute">{blurb}</p>
          </div>
        ))}
      </div>

      <GridSection
        label={
          isDe
            ? "Mix 1 — ein Detail Card als Anker, zwei Teaser Cards"
            : "Mix 1 — one Detail Card as anchor, two Teaser Cards"
        }
        className="grid-cols-1 md:grid-cols-3"
      >
        <CourseCardDetail course={course0} cta={cta} />
        <CourseCardTeaser course={course1} cta={cta} />
        <CourseCardTeaser course={course2} cta={cta} />
      </GridSection>

      <GridSection
        label={
          isDe
            ? "Mix 2 — Teaser Card doppelt breit als visueller Hero, Quick Cards darunter"
            : "Mix 2 — Teaser Card double-width as a visual hero, Quick Cards below"
        }
        className="grid-cols-1 md:grid-cols-3"
      >
        <div className="md:col-span-2">
          <CourseCardTeaser course={course0} cta={cta} />
        </div>
        <CourseCardQuick course={course1} cta={cta} />
        <CourseCardQuick course={course2} cta={cta} />
        <CourseCardQuick course={course3} cta={cta} />
      </GridSection>

      <GridSection
        label={
          isDe
            ? "Mix 3 — alle 6 Kurse, Ausdruck rotiert (Detail / Quick / Teaser)"
            : "Mix 3 — all 6 courses, expression rotates (Detail / Quick / Teaser)"
        }
        className="grid-cols-1 md:grid-cols-3"
      >
        {courses.map((course, index) => (
          <RotatingCard key={course.title} course={course} cta={cta} index={index} />
        ))}
      </GridSection>

      {/* ---------- Part 1: grid widths (Detail Card only) ---------- */}

      <h2 className="mb-md mt-huge text-display-section text-ink">
        {isDe ? "Grid-Breiten" : "Grid widths"}
      </h2>
      <p className="mb-xl max-w-[60ch] text-body text-ink-secondary">
        {isDe
          ? "Dieselben 6 Karten (Detail Card) in verschiedenen Spaltenzahlen."
          : "The same 6 cards (Detail Card) across different column counts."}
      </p>

      <GridSection
        label={isDe ? "3-spaltig (aktuelles Homepage-Grid)" : "3-up (current homepage grid)"}
        className="grid-cols-1 md:grid-cols-3"
      >
        {courses.map((course) => (
          <CourseCardDetail key={course.title} course={course} cta={cta} />
        ))}
      </GridSection>

      <GridSection
        label={isDe ? "2-spaltig (breitere Karten)" : "2-up (wider cards)"}
        className="grid-cols-1 md:grid-cols-2"
      >
        {courses.map((course) => (
          <CourseCardDetail key={course.title} course={course} cta={cta} />
        ))}
      </GridSection>

      <GridSection
        label={
          isDe
            ? "4-spaltig (kompakt — Stresstest für Textumbruch)"
            : "4-up (compact — stress-tests text wrap)"
        }
        className="grid-cols-2 md:grid-cols-4"
      >
        {courses.map((course) => (
          <CourseCardDetail key={course.title} course={course} cta={cta} />
        ))}
      </GridSection>

      <GridSection
        label={
          isDe
            ? "Asymmetrisch — erste Karte doppelt breit hervorgehoben"
            : "Asymmetric — first card featured, double width"
        }
        className="grid-cols-1 md:grid-cols-3"
      >
        {courses.map((course, index) => (
          <div key={course.title} className={index === 0 ? "md:col-span-2" : undefined}>
            <CourseCardDetail course={course} cta={cta} />
          </div>
        ))}
      </GridSection>

      <GridSection
        label={isDe ? "Einspaltig, volle Breite" : "Single column, full width"}
        className="mx-auto grid-cols-1 max-w-2xl"
      >
        {courses.slice(0, 2).map((course) => (
          <CourseCardDetail key={course.title} course={course} cta={cta} />
        ))}
      </GridSection>
    </main>
  );
}

function RotatingCard({
  course,
  cta,
  index,
}: {
  course: CourseCardData;
  cta: string;
  index: number;
}) {
  const variant = index % 3;
  if (variant === 0) return <CourseCardDetail course={course} cta={cta} />;
  if (variant === 1) return <CourseCardQuick course={course} cta={cta} />;
  return <CourseCardTeaser course={course} cta={cta} />;
}

function GridSection({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-huge">
      <h2 className="mb-md text-caption uppercase tracking-wide text-ink-mute">{label}</h2>
      <div className={`grid gap-lg ${className}`}>{children}</div>
    </section>
  );
}
