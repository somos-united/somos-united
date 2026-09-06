import Link from "next/link";

import { GlassPanel } from "@somos/ui";

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-md">
      <h1 className="text-heading-lg text-ink">Übersicht</h1>
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
        <Link href="/locations">
          <GlassPanel className="flex flex-col gap-xs p-lg hover:bg-canvas-lavender">
            <h2 className="text-heading-md text-ink">Standorte</h2>
            <p className="text-body text-ink-secondary">
              Kursräume anlegen und verwalten (Adresse, Kapazität, Miete).
            </p>
          </GlassPanel>
        </Link>
        <Link href="/courses">
          <GlassPanel className="flex flex-col gap-xs p-lg hover:bg-canvas-lavender">
            <h2 className="text-heading-md text-ink">Kurse</h2>
            <p className="text-body text-ink-secondary">
              Kursserien, Termine und Preisstaffeln pflegen.
            </p>
          </GlassPanel>
        </Link>
      </div>
    </div>
  );
}
