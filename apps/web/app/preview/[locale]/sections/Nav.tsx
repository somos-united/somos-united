import Link from "next/link";
import type { ReactNode } from "react";

import { ButtonPrimaryPill, GlassPanel } from "@somos/ui";

import type { Locale } from "@/lib/locales";

import { MobileNavMenu } from "./MobileNavMenu";

export type NavActive = "home" | "module" | "about" | "blog" | "legal";

/**
 * Nav height stays within the 64-80px cap (py-sm on a text-heading-md
 * wordmark lands around 64px). Sparse glass usage per
 * 04-DESIGN-SYSTEM.md §4 — nav over the hero is exactly the case it names.
 *
 * `active` is passed in by each page rather than detected client-side
 * (e.g. usePathname) so Nav can stay a Server Component - every call
 * site already knows what page it is.
 *
 * Desktop (md+): all links + locale switch + full-text CTA inline.
 * Mobile: the same links move into MobileNavMenu's hamburger panel -
 * cramming 3 text links + locale switch + CTA into a ~360px bar broke
 * for real once Blog became a 3rd link, not just looked tight the way
 * 2 links did. CTA stays visible on mobile (shortened via ctaShort)
 * since it's the primary conversion action, not something to bury in a
 * menu.
 */
export function Nav({
  locale,
  cta,
  ctaShort,
  moduleLabel,
  aboutLabel,
  blogLabel,
  menuOpenLabel,
  menuCloseLabel,
  active,
}: {
  locale: Locale;
  cta: string;
  ctaShort: string;
  moduleLabel: string;
  aboutLabel: string;
  blogLabel: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
  active: NavActive;
}) {
  const otherLocale: Locale = locale === "de" ? "en" : "de";

  const navLinks = [
    { href: `/preview/${locale}/module`, label: moduleLabel, isActive: active === "module" },
    { href: `/preview/${locale}/about`, label: aboutLabel, isActive: active === "about" },
    { href: `/preview/${locale}/blog`, label: blogLabel, isActive: active === "blog" },
  ];

  return (
    <GlassPanel className="sticky top-0 z-20 !rounded-none !border-x-0 !border-t-0">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-lg py-sm">
        <Link
          href={`/preview/${locale}`}
          className="shrink-0 whitespace-nowrap text-heading-md text-ink"
        >
          Somos United
        </Link>

        <div className="hidden items-center gap-lg md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} isActive={link.isActive}>
              {link.label}
            </NavLink>
          ))}
          <Link
            href={`/preview/${otherLocale}`}
            className="whitespace-nowrap text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            {otherLocale.toUpperCase()}
          </Link>
          <ButtonPrimaryPill className="whitespace-nowrap">{cta}</ButtonPrimaryPill>
        </div>

        <div className="flex items-center gap-sm md:hidden">
          <MobileNavMenu
            links={navLinks}
            otherLocaleHref={`/preview/${otherLocale}`}
            otherLocaleLabel={otherLocale.toUpperCase()}
            openLabel={menuOpenLabel}
            closeLabel={menuCloseLabel}
          />
          <ButtonPrimaryPill className="whitespace-nowrap">
            <span className="hidden sm:inline">{cta}</span>
            <span className="sm:hidden">{ctaShort}</span>
          </ButtonPrimaryPill>
        </div>
      </div>
    </GlassPanel>
  );
}

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`whitespace-nowrap text-caption transition-colors hover:text-ink ${
        isActive ? "font-semibold text-ink" : "text-ink-mute"
      }`}
    >
      {children}
    </Link>
  );
}
