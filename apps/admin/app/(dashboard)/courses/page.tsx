import Link from "next/link";

import { ButtonPrimaryPill, GlassPanel, TextInput } from "@somos/ui";

import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { createCourseSeries } from "./actions";

interface SeriesRow {
  id: string;
  module_ref: string;
  cadence_label: string | null;
  abo_enabled: boolean;
  fomo_enabled: boolean;
  locations: { name: string } | null;
}

interface LocationOption {
  id: string;
  name: string;
}

async function getCourseSeries(): Promise<SeriesRow[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("course_series")
    .select("id, module_ref, cadence_label, abo_enabled, fomo_enabled, locations ( name )")
    .order("created_at", { ascending: false });
  return (data as unknown as SeriesRow[]) ?? [];
}

async function getLocationOptions(): Promise<LocationOption[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("locations").select("id, name").order("name");
  return data ?? [];
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const [series, locations] = await Promise.all([getCourseSeries(), getLocationOptions()]);

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="text-heading-lg text-ink">Kurse</h1>

      {searchParams.status === "saved" && (
        <p className="rounded-sm bg-status-good-bg px-md py-sm text-body text-status-good-text">
          Kursserie gespeichert.
        </p>
      )}

      <div className="flex flex-col gap-sm">
        {series.length === 0 && (
          <p className="text-body text-ink-secondary">
            Noch keine Kursserien angelegt — unten die erste hinzufügen.
          </p>
        )}
        {series.map((s) => (
          <Link key={s.id} href={`/courses/${s.id}`}>
            <GlassPanel className="flex flex-col gap-xs p-md hover:bg-canvas-lavender">
              <div className="flex items-baseline justify-between">
                <span className="text-body font-medium text-ink">{s.module_ref}</span>
                {s.cadence_label && (
                  <span className="text-caption-lg text-ink-mute">{s.cadence_label}</span>
                )}
              </div>
              <span className="text-caption-lg text-ink-secondary">
                {s.locations?.name ?? "Kein Standort zugewiesen"}
                {" · "}
                {s.fomo_enabled ? "FOMO-Pills an" : "FOMO-Pills aus"}
                {" · "}
                {s.abo_enabled ? "Abo möglich" : "Nur Einzelbuchung"}
              </span>
            </GlassPanel>
          </Link>
        ))}
      </div>

      <GlassPanel className="flex flex-col gap-sm p-lg">
        <h2 className="text-heading-md text-ink">Neue Kursserie</h2>
        <p className="text-caption-lg text-ink-mute">
          `module_ref` ist die Sanity-Dokument-ID des Kursinhalts (Text/Bilder kommen von dort,
          diese Serie regelt nur Termine/Preise/Standort).
        </p>
        <form action={createCourseSeries} className="flex flex-col gap-sm">
          <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
            Sanity module_ref
            <TextInput name="module_ref" required placeholder="z.B. course-medienkompetenz" />
          </label>
          <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
            Standort
            <select
              name="location_id"
              className="w-full rounded-sm border border-hairline bg-canvas px-md py-sm text-body text-ink focus:border-primary focus:outline-none"
            >
              <option value="">— kein Standort —</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
            Rhythmus (nur informativ)
            <TextInput name="cadence_label" placeholder="z.B. wöchentlich" />
          </label>
          <label className="flex items-center gap-xs text-caption-lg text-ink-secondary">
            <input type="checkbox" name="fomo_enabled" defaultChecked />
            FOMO-Pills anzeigen (Knappheit/Dringlichkeit)
          </label>
          <label className="flex items-center gap-xs text-caption-lg text-ink-secondary">
            <input type="checkbox" name="abo_enabled" />
            Abo-Buchung erlauben (6x/12x/24x)
          </label>
          <ButtonPrimaryPill type="submit" className="self-start">
            Kursserie speichern
          </ButtonPrimaryPill>
        </form>
      </GlassPanel>
    </div>
  );
}
