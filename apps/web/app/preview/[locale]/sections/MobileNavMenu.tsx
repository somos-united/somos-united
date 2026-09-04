"use client";

import { List, X } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useState } from "react";

/**
 * Isolated interactive leaf (04-DESIGN-SYSTEM.md/design-taste convention:
 * Server Components render static layout, only components that actually
 * need client state are 'use client'). Nav.tsx stays a Server Component
 * and renders this for the secondary links (Module/About/Blog + locale
 * switch) on mobile - added once a 3rd nav link (Blog) made cramming
 * everything into the top bar genuinely break, not just look tight
 * (see the 320px nav-wrap fix a few commits back).
 *
 * Desktop is untouched: those same links render inline in Nav.tsx via
 * `hidden md:flex`, this component is `md:hidden`.
 */
export function MobileNavMenu({
  links,
  otherLocaleHref,
  otherLocaleLabel,
  openLabel,
  closeLabel,
}: {
  links: { href: string; label: string; isActive: boolean }[];
  otherLocaleHref: string;
  otherLocaleLabel: string;
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        className="flex items-center justify-center rounded-md p-xxs text-ink transition-colors hover:text-primary"
      >
        {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-hairline bg-canvas px-lg py-lg">
          <nav className="flex flex-col gap-md">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={link.isActive ? "page" : undefined}
                className={`text-body ${link.isActive ? "font-semibold text-ink" : "text-ink-secondary"}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={otherLocaleHref}
              onClick={() => setOpen(false)}
              className="text-body text-ink-secondary"
            >
              {otherLocaleLabel}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
