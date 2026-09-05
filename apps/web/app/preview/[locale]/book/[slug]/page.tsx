import { ArrowLeft, Clock, UsersThree } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/locales";

import { HOME_COPY } from "../../copy";
import { Nav } from "../../sections/Nav";
import { SiteFooter } from "../../sections/SiteFooter";
import { BOOKING_PAGE_CHROME, BOOKING_PAGES, type PlanOption } from "../copy";
import { activeTier, daysUntil, formatDateLabel, formatPrice, formatShortDate, spotsLeft, tierEndDate } from "../pricing";

/**
 * Rendered per-request, not statically pre-rendered - the whole point
 * of this page is a price that's correctly computed against *today's*
 * date (05-MODULE-BOOKING.md §5's "airline principle"). A static build
 * would freeze the wrong tier the moment a real day passes.
 */
export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Metadata {
  const page = BOOKING_PAGES[params.locale][params.slug];
  if (!page) return {};
  return { title: page.courseTitle };
}

export default function BookingPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const t = HOME_COPY[params.locale];
  const chrome = BOOKING_PAGE_CHROME[params.locale];
  const page = BOOKING_PAGES[params.locale][params.slug];
  if (!page) {
    notFound();
  }

  const today = new Date();
  const firstInstance = page.instances[0]!;

  return (
    <>
      <Nav
        locale={params.locale}
        cta={t.nav.cta}
        ctaShort={t.nav.ctaShort}
        moduleLabel={t.nav.moduleLabel}
        aboutLabel={t.nav.aboutLabel}
        blogLabel={t.nav.blogLabel}
        menuOpenLabel={t.nav.menuOpenLabel}
        menuCloseLabel={t.nav.menuCloseLabel}
        active="module"
      />
      <main>
        <section className="mx-auto max-w-4xl px-lg pt-xl md:px-xl">
          <Link
            href={`/preview/${params.locale}/module/${page.moduleCategory}`}
            className="inline-flex items-center gap-xs text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            {chrome.backToModule}
          </Link>

          <span className="mt-lg block text-caption text-ink-mute">
            {page.category} · {page.cadenceLabel}, {page.location}
          </span>
          <h1 className="mt-xs text-display-hero text-ink">{page.courseTitle}</h1>
        </section>

        <section className="mx-auto max-w-4xl px-lg py-xl md:px-xl">
          <h2 className="text-heading-lg text-ink">{chrome.instancesHeading}</h2>
          <div className="mt-md flex flex-col gap-xs">
            {page.instances.map((instance) => {
              const remaining = spotsLeft(instance);
              const showScarcity = page.fomoEnabled && remaining <= page.scarcitySeatsThreshold;
              return (
                <div
                  key={instance.isoDate}
                  className="flex items-center justify-between rounded-lg border border-hairline px-lg py-md"
                >
                  <div>
                    <span className="text-body text-ink">
                      {formatDateLabel(instance.isoDate, params.locale)}
                    </span>
                    <span className="ml-sm text-caption text-ink-mute">{instance.time}</span>
                  </div>
                  {showScarcity && (
                    <span className="inline-flex items-center gap-xxs rounded-pill bg-accent-coral px-md py-xxs text-caption text-on-primary">
                      <UsersThree size={13} weight="bold" aria-hidden />
                      {chrome.spotsLeftLabel(remaining)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-lg pb-xl md:px-xl">
          <h2 className="text-heading-lg text-ink">{chrome.plansHeading}</h2>
          <div className="mt-md grid grid-cols-1 gap-lg md:grid-cols-2">
            {page.plans.map((plan) => (
              <PlanCard
                key={plan.planType}
                plan={plan}
                referenceIsoDate={firstInstance.isoDate}
                today={today}
                locale={params.locale}
                fomoEnabled={page.fomoEnabled}
                priceValidUntilLabel={chrome.priceValidUntilLabel}
                ctaLabel={chrome.ctaLabel}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-lg pb-huge md:px-xl">
          <div className="rounded-lg border border-hairline bg-canvas-soft p-xl">
            <h2 className="text-heading-lg text-ink">{chrome.whatsNextHeading}</h2>
            <p className="mt-sm max-w-[60ch] text-body text-ink-secondary">{chrome.whatsNextBody}</p>
          </div>
        </section>
      </main>
      <SiteFooter
        locale={params.locale}
        tagline={t.footer.tagline}
        contactLabel={t.footer.contactLabel}
        linksHeading={t.footer.linksHeading}
        legalHeading={t.footer.legalHeading}
        impressumLabel={t.footer.impressumLabel}
        datenschutzLabel={t.footer.datenschutzLabel}
      />
    </>
  );
}

function PlanCard({
  plan,
  referenceIsoDate,
  today,
  locale,
  fomoEnabled,
  priceValidUntilLabel,
  ctaLabel,
}: {
  plan: PlanOption;
  referenceIsoDate: string;
  today: Date;
  locale: Locale;
  fomoEnabled: boolean;
  priceValidUntilLabel: (date: string) => string;
  ctaLabel: string;
}) {
  const daysBefore = daysUntil(referenceIsoDate, today);
  const tier = activeTier(plan.tiers, daysBefore);
  const endDate = tierEndDate(tier, referenceIsoDate);

  return (
    <div className="flex flex-col rounded-lg border border-hairline p-xl">
      <span className="text-heading-md text-ink">{plan.label}</span>
      <p className="mt-xs text-body text-ink-secondary">{plan.description}</p>

      <div className="mt-lg flex items-baseline gap-xs">
        <span className="text-display-section text-ink">{formatPrice(tier.priceCents)}</span>
        <span className="text-caption text-ink-mute">({tier.tierLabel})</span>
      </div>

      {fomoEnabled && endDate && (
        <span className="mt-xs inline-flex w-fit items-center gap-xxs rounded-pill bg-ink px-md py-xxs text-caption text-canvas">
          <Clock size={13} weight="bold" aria-hidden />
          {priceValidUntilLabel(formatShortDate(endDate.toISOString().slice(0, 10), locale))}
        </span>
      )}

      <button
        type="button"
        className="mt-lg inline-flex items-center justify-center rounded-pill bg-primary px-lg py-sm text-button text-on-primary transition-colors hover:bg-primary-press"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
