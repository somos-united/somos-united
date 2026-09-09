import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { PRIMARY_PILL_CLASSNAME } from "@somos/ui";

import type { ResolvedCta } from "@/lib/sanity";

/**
 * The re-athens.com-style repeatable card (image, short pitch, one CTA)
 * Danny asked for directly 2026-09-09 ("MODULES and FLEXIBLE... guide
 * them sideways to our topics") -- editors add as many of these as they
 * want, in any order, via homePage.ts's imageTextCtaBlock. Alternates
 * image-left/image-right by index so a run of several doesn't read as
 * one repeated row.
 */
export function ImageTextCta({
  imageUrl,
  heading,
  body,
  cta,
  imageOnRight = false,
}: {
  imageUrl?: string;
  heading: string;
  body?: string;
  cta: ResolvedCta;
  imageOnRight?: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl px-lg py-huge md:px-xl">
      <div className="grid grid-cols-1 items-center gap-xxl md:grid-cols-2">
        <div className={imageOnRight ? "md:order-2" : ""}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- no next/image remote-pattern config yet
            <img
              src={imageUrl}
              alt=""
              className="aspect-[4/3] w-full rounded-xl border border-hairline object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-canvas-lavender)_0%,var(--color-canvas-mint)_100%)]">
              <span className="text-caption text-ink-mute">[Illustration folgt]</span>
            </div>
          )}
        </div>
        <div className={imageOnRight ? "md:order-1" : ""}>
          <h2 className="text-display-section text-ink">{heading}</h2>
          {body && <p className="mt-md max-w-[48ch] text-body text-ink-secondary">{body}</p>}
          <div className="mt-lg">
            {cta.href ? (
              <Link href={cta.href} className={`${PRIMARY_PILL_CLASSNAME} gap-xs`}>
                {cta.label}
                <ArrowRight size={18} weight="bold" aria-hidden />
              </Link>
            ) : (
              <span className={`${PRIMARY_PILL_CLASSNAME} gap-xs opacity-50`}>{cta.label}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
