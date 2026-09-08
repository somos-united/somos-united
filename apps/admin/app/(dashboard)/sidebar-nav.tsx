"use client";

import {
  ChartBar,
  GraduationCap,
  List,
  MapPin,
  SignOut,
  UsersThree,
  X,
  type Icon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS: { href: string; label: string; icon: Icon }[] = [
  { href: "/", label: "Übersicht", icon: ChartBar },
  { href: "/locations", label: "Standorte", icon: MapPin },
  { href: "/courses", label: "Kurse", icon: GraduationCap },
  { href: "/team", label: "Team", icon: UsersThree },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-xxs">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const ItemIcon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-sm rounded-sm px-md py-sm text-body transition-colors ${
              isActive
                ? "bg-primary-subdued-bg font-medium text-primary"
                : "text-ink-secondary hover:bg-canvas-soft hover:text-ink"
            }`}
          >
            <ItemIcon size={18} weight={isActive ? "fill" : "regular"} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The whole nav shell (branding, links, sign-out) lives in one client
 * component so mobile open/close state can control both the toggle button
 * and the drawer without lifting state across a server/client boundary.
 * Desktop keeps the original always-visible sidebar (`md:flex`); on
 * mobile it's a slide-in drawer behind a hamburger button, same pattern
 * as apps/web's MobileNavMenu.
 */
export function SidebarNav({
  email,
  onSignOut,
}: {
  email: string;
  onSignOut: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-hairline bg-canvas px-lg py-md md:hidden">
        <span className="text-heading-md text-ink">Somos United</span>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Menü schliessen" : "Menü öffnen"}
          className="flex items-center justify-center rounded-md p-xs text-ink"
        >
          {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col justify-between border-r border-hairline bg-canvas p-lg transition-transform md:static md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-xl">
          <span className="hidden text-heading-md text-ink md:block">Somos United</span>
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
        <div className="flex flex-col gap-sm border-t border-hairline pt-md">
          <span className="truncate text-caption text-ink-mute">{email}</span>
          <form action={onSignOut}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-xs rounded-pill border-[1.5px] border-primary px-xl py-sm text-button text-primary transition-colors hover:bg-primary-subdued-bg"
            >
              <SignOut size={16} weight="bold" aria-hidden />
              Abmelden
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
