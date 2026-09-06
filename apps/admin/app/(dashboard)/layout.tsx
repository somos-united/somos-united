import Link from "next/link";

import { ButtonSecondary, GlassPanel } from "@somos/ui";

import { getCurrentProfile } from "../../lib/current-profile";
import { signOut } from "./actions";

const NAV_ITEMS = [
  { href: "/", label: "Übersicht" },
  { href: "/locations", label: "Standorte" },
  { href: "/courses", label: "Kurse" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  // middleware.ts already blocks unauthenticated requests, so a null
  // profile here means the auth.users row exists but has no matching
  // profiles row yet — handle_new_user() should always create one, but
  // fail safe rather than crash on a missing row.
  if (!profile || !profile.isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-md bg-canvas-soft px-lg text-center">
        <GlassPanel className="flex max-w-sm flex-col gap-sm p-xl">
          <h1 className="text-heading-md text-ink">Zugang ausstehend</h1>
          <p className="text-body text-ink-secondary">
            Dein Account ({profile?.email ?? "unbekannt"}) ist eingeloggt, hat aber noch keine
            Admin-Berechtigung. Bitte Danny Bescheid geben, damit die Rolle freigeschaltet wird.
          </p>
          <form action={signOut}>
            <ButtonSecondary type="submit">Abmelden</ButtonSecondary>
          </form>
        </GlassPanel>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-soft">
      <header className="flex items-center justify-between border-b border-hairline bg-canvas px-lg py-sm">
        <nav className="flex gap-lg">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body text-ink-secondary hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="flex items-center gap-sm">
          <span className="text-body text-ink-mute">{profile.email}</span>
          <ButtonSecondary type="submit">Abmelden</ButtonSecondary>
        </form>
      </header>
      <main className="mx-auto max-w-3xl px-lg py-xl">{children}</main>
    </div>
  );
}
