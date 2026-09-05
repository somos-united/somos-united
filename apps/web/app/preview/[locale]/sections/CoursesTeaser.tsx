import { ArrowRight, Check, Clock, UsersThree } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import type { ModuleCategory } from "@somos/types";

import type { Locale } from "@/lib/locales";

export interface CourseCardData {
  category: string;
  moduleCategory: ModuleCategory;
  title: string;
  dateLabel: string;
  price: string;
  advantages: string[];
  fomo?: { kind: "scarcity" | "urgency"; label: string };
  /**
   * Slug of a real /book/[slug] page, if one's been built for this
   * course yet (only "medienkompetenz-basiskurs" so far - one template
   * built well before replicating to the rest, see book/copy.ts).
   * Undefined means the CTA stays a plain non-navigating button rather
   * than link to a page that doesn't exist.
   */
  bookingSlug?: string;
}

/**
 * Three named card "expressions" for the same course data, from most to
 * least information-dense - so the grid-behavior review page
 * (grid-test/page.tsx) can mix them and Danny can address each by name
 * when picking a direction:
 *
 * - Detail Card: full info (eyebrow, title, 4-5 benefit bullets, price,
 *   CTA). The only variant used on the shipped homepage today.
 * - Quick Card: eyebrow, title, price, CTA - drops the bullet list.
 * - Teaser Card: title + one full-width "hard sell" CTA only - no
 *   eyebrow, no price, no bullets. Pure visual impulse-click, closest to
 *   the original ModuleBento treatment above it on the homepage.
 */

/**
 * Shared CTA for all three card expressions: a real link once
 * course.bookingSlug + locale are both available, otherwise a plain
 * non-navigating button (most courses don't have a /book page built
 * yet). One place to keep this logic instead of tripling it.
 */
function CourseCta({
  course,
  cta,
  locale,
  className,
}: {
  course: CourseCardData;
  cta: string;
  locale?: Locale;
  className: string;
}) {
  if (course.bookingSlug && locale) {
    return (
      <Link href={`/preview/${locale}/book/${course.bookingSlug}`} className={className}>
        {cta}
        <ArrowRight size={16} weight="bold" aria-hidden />
      </Link>
    );
  }
  return (
    <button type="button" className={className}>
      {cta}
      <ArrowRight size={16} weight="bold" aria-hidden />
    </button>
  );
}

export function CourseCardDetail({
  course,
  cta,
  locale,
}: {
  course: CourseCardData;
  cta: string;
  locale?: Locale;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-hairline">
      <div className="relative flex min-h-[200px] flex-1 items-center justify-center bg-[linear-gradient(135deg,var(--color-canvas-lavender)_0%,var(--color-canvas-mint)_100%)]">
        {course.fomo && (
          <span
            className={`absolute left-md top-md inline-flex items-center gap-xxs rounded-pill px-md py-xxs text-caption ${
              course.fomo.kind === "scarcity"
                ? "bg-accent-coral text-on-primary"
                : "bg-ink text-canvas"
            }`}
          >
            {course.fomo.kind === "scarcity" ? (
              <UsersThree size={13} weight="bold" aria-hidden />
            ) : (
              <Clock size={13} weight="bold" aria-hidden />
            )}
            {course.fomo.label}
          </span>
        )}
        <span className="text-caption text-ink-mute">[Illustration folgt]</span>
      </div>

      <div className="flex flex-col p-lg">
        <span className="text-caption text-ink-mute">
          {course.category} · {course.dateLabel}
        </span>
        <h3 className="mt-xs text-heading-lg text-ink">{course.title}</h3>

        <ul className="mt-md flex flex-col gap-xs">
          {course.advantages.map((advantage) => (
            <li key={advantage} className="flex items-start gap-xs text-body text-ink-secondary">
              <Check
                size={14}
                weight="bold"
                className="mt-[3px] shrink-0 text-accent-teal-deep"
                aria-hidden
              />
              {advantage}
            </li>
          ))}
        </ul>

        <div className="mt-lg flex items-center justify-between gap-md">
          <span className="text-heading-lg text-ink">{course.price}</span>
          <CourseCta
            course={course}
            cta={cta}
            locale={locale}
            className="inline-flex items-center gap-xs rounded-pill bg-primary px-lg py-xs text-button text-on-primary transition-colors hover:bg-primary-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </div>
      </div>
    </div>
  );
}

export function CourseCardQuick({
  course,
  cta,
  locale,
}: {
  course: CourseCardData;
  cta: string;
  locale?: Locale;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-hairline">
      <div className="relative flex min-h-[200px] flex-1 items-center justify-center bg-[linear-gradient(135deg,var(--color-canvas-lavender)_0%,var(--color-canvas-mint)_100%)]">
        {course.fomo && (
          <span
            className={`absolute left-md top-md inline-flex items-center gap-xxs rounded-pill px-md py-xxs text-caption ${
              course.fomo.kind === "scarcity"
                ? "bg-accent-coral text-on-primary"
                : "bg-ink text-canvas"
            }`}
          >
            {course.fomo.kind === "scarcity" ? (
              <UsersThree size={13} weight="bold" aria-hidden />
            ) : (
              <Clock size={13} weight="bold" aria-hidden />
            )}
            {course.fomo.label}
          </span>
        )}
        <span className="text-caption text-ink-mute">[Illustration folgt]</span>
      </div>

      <div className="flex flex-col p-lg">
        <span className="text-caption text-ink-mute">
          {course.category} · {course.dateLabel}
        </span>
        <h3 className="mt-xs text-heading-lg text-ink">{course.title}</h3>

        <div className="mt-lg flex items-center justify-between gap-md">
          <span className="text-heading-lg text-ink">{course.price}</span>
          <CourseCta
            course={course}
            cta={cta}
            locale={locale}
            className="inline-flex items-center gap-xs rounded-pill bg-primary px-lg py-xs text-button text-on-primary transition-colors hover:bg-primary-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </div>
      </div>
    </div>
  );
}

export function CourseCardTeaser({
  course,
  cta,
  locale,
}: {
  course: CourseCardData;
  cta: string;
  locale?: Locale;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-hairline">
      <div className="relative flex min-h-[200px] flex-1 items-center justify-center bg-[linear-gradient(135deg,var(--color-canvas-lavender)_0%,var(--color-canvas-mint)_100%)]">
        {course.fomo && (
          <span
            className={`absolute left-md top-md inline-flex items-center gap-xxs rounded-pill px-md py-xxs text-caption ${
              course.fomo.kind === "scarcity"
                ? "bg-accent-coral text-on-primary"
                : "bg-ink text-canvas"
            }`}
          >
            {course.fomo.kind === "scarcity" ? (
              <UsersThree size={13} weight="bold" aria-hidden />
            ) : (
              <Clock size={13} weight="bold" aria-hidden />
            )}
            {course.fomo.label}
          </span>
        )}
        <span className="text-caption text-ink-mute">[Illustration folgt]</span>
      </div>

      <div className="flex flex-col gap-md p-lg">
        <h3 className="text-heading-lg text-ink">{course.title}</h3>
        <CourseCta
          course={course}
          cta={cta}
          locale={locale}
          className="inline-flex w-full items-center justify-center gap-xs rounded-pill bg-primary px-lg py-sm text-button text-on-primary transition-colors hover:bg-primary-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </div>
    </div>
  );
}

/**
 * The "commercial" teaser: concrete, bookable course instances with real
 * pricing and FOMO-pill mechanics (05-MODULE-BOOKING.md §5-6), sitting
 * between the category overview above and the process/social-proof
 * sections below. Uses Detail Card for every course by default; the
 * grid-behavior review page (grid-test/page.tsx) is where Content
 * boxes and the lighter Quick/Teaser expressions get blended in.
 *
 * Prices use the module doc's own example tier numbers (CHF 25/30/35 -
 * §5: "Early Bird/Standard/Last Minute") rather than invented figures.
 * Both pill types are real, data-driven mechanics (scarcity: remaining
 * capacity vs. a threshold; urgency: the active price tier's end date) -
 * shown here as three different real states (scarcity, urgency, none)
 * since `fomo_enabled` is genuinely per-series and not every course
 * shows one.
 *
 * No illustration asset exists yet for these cards - an illustrator has
 * been commissioned (brief: minimalistic, quirky, B&W line art with a
 * single bright accent color, per Danny 2026-09-03) but nothing's
 * delivered yet. The image slot below is a labeled placeholder, not a
 * fake finished illustration - flagged clearly rather than faked.
 */
export function CoursesTeaser({
  heading,
  subtext,
  courses,
  cta,
  locale,
}: {
  heading: string;
  subtext: string;
  courses: CourseCardData[];
  cta: string;
  locale?: Locale;
}) {
  return (
    <section className="mx-auto max-w-6xl px-lg py-huge md:px-xl">
      <h2 className="text-display-section text-ink">{heading}</h2>
      <p className="mt-sm max-w-[52ch] text-body text-ink-secondary">{subtext}</p>

      <div className="mt-xl grid grid-cols-1 gap-lg md:grid-cols-3">
        {courses.map((course) => (
          <CourseCardDetail key={course.title} course={course} cta={cta} locale={locale} />
        ))}
      </div>
    </section>
  );
}
