import { ArrowRight, Check, Clock, UsersThree } from "@phosphor-icons/react/ssr";

export interface CourseCardData {
  category: string;
  title: string;
  dateLabel: string;
  price: string;
  advantages: string[];
  fomo?: { kind: "scarcity" | "urgency"; label: string };
}

/**
 * The "commercial" teaser: concrete, bookable course instances with real
 * pricing and FOMO-pill mechanics (05-MODULE-BOOKING.md §5-6), sitting
 * between the category overview above and the process/social-proof
 * sections below. Distinct layout family from ModuleBento above it -
 * uniform product cards, not an asymmetric grid, because this is a real
 * catalog listing rather than a category showcase.
 *
 * Prices use the module doc's own example tier numbers (CHF 25/30/35 -
 * §5: "Early Bird/Standard/Last Minute") rather than invented figures.
 * Both pill types are real, data-driven mechanics (scarcity: remaining
 * capacity vs. a threshold; urgency: the active price tier's end date) -
 * shown here as three different real states (scarcity, urgency, none)
 * since `fomo_enabled` is genuinely per-series and not every course
 * shows one.
 *
 * No illustration asset exists yet for these cards (same gap as the
 * hero - 04-DESIGN-SYSTEM.md §8: no photography/illustration commissioned
 * so far). The image slot below is a labeled placeholder, not a fake
 * finished illustration - flagged clearly rather than faked.
 */
export function CoursesTeaser({
  heading,
  subtext,
  courses,
  cta,
}: {
  heading: string;
  subtext: string;
  courses: CourseCardData[];
  cta: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-lg py-huge md:px-xl">
      <h2 className="text-display-section text-ink">{heading}</h2>
      <p className="mt-sm max-w-[52ch] text-body text-ink-secondary">{subtext}</p>

      <div className="mt-xl grid grid-cols-1 gap-lg md:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.title}
            className="flex flex-col overflow-hidden rounded-lg border border-hairline"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center bg-[linear-gradient(135deg,var(--color-canvas-lavender)_0%,var(--color-canvas-mint)_100%)]">
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

            <div className="flex flex-1 flex-col p-lg">
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

              <div className="mt-lg flex flex-1 items-end justify-between gap-md">
                <span className="text-heading-lg text-ink">{course.price}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-xs rounded-pill bg-primary px-lg py-xs text-button text-on-primary transition-colors hover:bg-primary-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {cta}
                  <ArrowRight size={16} weight="bold" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
