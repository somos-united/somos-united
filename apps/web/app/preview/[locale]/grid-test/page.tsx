import type { ReactNode } from "react";

import type { Locale } from "@/lib/locales";

import { HOME_COPY } from "../copy";
import { CourseCard } from "../sections/CoursesTeaser";

/**
 * Internal-only sandbox: the same 6 course cards from the homepage
 * teaser, dropped into several different grid widths/combinations back
 * to back, so grid behavior (text wrap, pill fit, price/CTA alignment)
 * can be compared before picking a layout. Not linked from the site nav
 * and not real content — reachable only through the /preview/* Basic
 * Auth gate, same as the homepage draft.
 */
export default function GridTestPage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];
  const courses = t.courses.items;
  const cta = t.courses.cta;
  const isDe = params.locale === "de";

  return (
    <main className="mx-auto max-w-6xl px-lg py-huge md:px-xl">
      <div className="mb-huge rounded-lg border border-hairline bg-canvas-lavender/40 p-lg">
        <h1 className="text-heading-lg text-ink">
          {isDe ? "Grid-Test — nur zur Ansicht" : "Grid test — review only"}
        </h1>
        <p className="mt-xs max-w-[60ch] text-body text-ink-secondary">
          {isDe
            ? "Dieselben 6 Kurskarten in verschiedenen Grid-Breiten, um das Verhalten zu vergleichen. Keine Design-Entscheidung, kein echter Inhalt."
            : "The same 6 course cards across different grid widths, to compare behavior. Not a design decision, not real content."}
        </p>
      </div>

      <GridSection
        label={isDe ? "3-spaltig (aktuelles Homepage-Grid)" : "3-up (current homepage grid)"}
        className="grid-cols-1 md:grid-cols-3"
      >
        {courses.map((course) => (
          <CourseCard key={course.title} course={course} cta={cta} />
        ))}
      </GridSection>

      <GridSection
        label={isDe ? "2-spaltig (breitere Karten)" : "2-up (wider cards)"}
        className="grid-cols-1 md:grid-cols-2"
      >
        {courses.map((course) => (
          <CourseCard key={course.title} course={course} cta={cta} />
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
          <CourseCard key={course.title} course={course} cta={cta} />
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
            <CourseCard course={course} cta={cta} />
          </div>
        ))}
      </GridSection>

      <GridSection
        label={isDe ? "Einspaltig, volle Breite" : "Single column, full width"}
        className="mx-auto grid-cols-1 max-w-2xl"
      >
        {courses.slice(0, 2).map((course) => (
          <CourseCard key={course.title} course={course} cta={cta} />
        ))}
      </GridSection>
    </main>
  );
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
