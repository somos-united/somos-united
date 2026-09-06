"use client";

import { ChartBar, GraduationCap, MapPin, UsersThree, type Icon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: { href: string; label: string; icon: Icon }[] = [
  { href: "/", label: "Übersicht", icon: ChartBar },
  { href: "/locations", label: "Standorte", icon: MapPin },
  { href: "/courses", label: "Kurse", icon: GraduationCap },
  { href: "/team", label: "Team", icon: UsersThree },
];

// Isolated 'use client' leaf (same pattern as apps/web's MobileNavMenu) --
// only this needs usePathname() for the active-route highlight, so only
// this re-renders on navigation; the rest of the dashboard shell stays a
// plain Server Component.
export function SidebarNav() {
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
