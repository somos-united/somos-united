import Link from "next/link";

import { ButtonPrimaryPill, TextInput } from "@somos/ui";

import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { createCourseSeries, deleteCourseSeries, updateCourseSeries } from "./actions";

interface SeriesRow {
  id: string;
  module_ref: string;
  location_id: string | null;
  cadence_label: string | null;
  abo_enabled: boolean;
  fomo_enabled: boolean;
}

interface LocationOption {
  id: string;
  name: string;
}

async function getCourseSeries(): Promise<SeriesRow[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("course_series")
    .select("id, module_ref, location_id, cadence_label, abo_enabled, fomo_enabled")
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getLocationOptions(): Promise<LocationOption[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("locations").select("id, name").order("name");
  return data ?? [];
}

const STATUS_MESSAGES: Record<string, string> = {
  saved: "Kursserie gespeichert.",
  updated: "Änderungen gespeichert.",
  deleted: "Kursserie gelöscht.",
};

function LocationSelect({
  locations,
  defaultValue,
}: {
  locations: LocationOption[];
  defaultValue: string;
}) {
  return (
    <select
      name="location_id"
      defaultValue={defaultValue}
      className="w-full rounded-sm border border-hairline bg-canvas px-md py-sm text-body text-ink focus:border-primary focus:outline-none"
    >
      <option value="">— kein Standort —</option>
      {locations.map((location) => (
        <option key={location.id} value={location.id}>
          {location.name}
        </option>
      ))}
    </select>
  );
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const [series, locations] = await Promise.all([getCourseSeries(), getLocationOptions()]);
  const status = searchParams.status;

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="text-heading-lg text-ink">Kurse</h1>

      {status && status !== "error" && STATUS_MESSAGES[status] && (
        <p className="rounded-sm bg-status-good-bg px-md py-sm text-body text-status-good-text">
          {STATUS_MESSAGES[status]}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-sm bg-status-critical-bg px-md py-sm text-body text-status-critical-text">
          Das hat nicht geklappt. Bitte erneut versuchen.
        </p>
      )}

      <div className="flex flex-col gap-sm">
        {series.length === 0 && (
          <p className="text-body text-ink-secondary">
            Noch keine Kursserien angelegt — unten die erste hinzufügen.
          </p>
        )}
        {series.map((s) => (
          <div key={s.id} className="flex flex-col gap-sm rounded-lg border border-hairline bg-canvas p-md">
            <Link href={`/courses/${s.id}`} className="text-caption-lg text-primary underline">
              Termine &amp; Preise verwalten →
            </Link>
            <form action={updateCourseSeries} className="flex flex-col gap-sm">
              <input type="hidden" name="id" value={s.id} />
              <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
                Sanity module_ref
                <TextInput name="module_ref" defaultValue={s.module_ref} required />
              </label>
              <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
                Standort
                <LocationSelect locations={locations} defaultValue={s.location_id ?? ""} />
              </label>
              <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
                Rhythmus (nur informativ)
                <TextInput name="cadence_label" defaultValue={s.cadence_label ?? ""} />
              </label>
              <label className="flex items-center gap-xs text-caption-lg text-ink-secondary">
                <input type="checkbox" name="fomo_enabled" defaultChecked={s.fomo_enabled} />
                FOMO-Pills anzeigen (Knappheit/Dringlichkeit)
              </label>
              <label className="flex items-center gap-xs text-caption-lg text-ink-secondary">
                <input type="checkbox" name="abo_enabled" defaultChecked={s.abo_enabled} />
                Abo-Buchung erlauben (6x/12x/24x)
              </label>
              <div className="flex items-center gap-sm">
                <ButtonPrimaryPill type="submit">Speichern</ButtonPrimaryPill>
                <button
                  type="submit"
                  formAction={deleteCourseSeries}
                  className="text-caption-lg text-status-critical-text underline underline-offset-2"
                >
                  Löschen
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-sm rounded-lg border border-hairline bg-canvas p-lg">
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
            <LocationSelect locations={locations} defaultValue="" />
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
      </div>
    </div>
  );
}
