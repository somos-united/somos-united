import { ButtonPrimaryPill, TextInput } from "@somos/ui";

import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { createLocation, deleteLocation, updateLocation } from "./actions";

interface LocationRow {
  id: string;
  name: string;
  address: string | null;
  capacity: number | null;
  rent_amount_cents: number | null;
  rent_active: boolean;
}

async function getLocations(): Promise<LocationRow[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("locations")
    .select("id, name, address, capacity, rent_amount_cents, rent_active")
    .order("name");
  return data ?? [];
}

const STATUS_MESSAGES: Record<string, string> = {
  saved: "Standort gespeichert.",
  updated: "Änderungen gespeichert.",
  deleted: "Standort gelöscht.",
};

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const locations = await getLocations();
  const status = searchParams.status;

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="text-heading-lg text-ink">Standorte</h1>

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
        {locations.length === 0 && (
          <p className="text-body text-ink-secondary">
            Noch keine Standorte angelegt — unten den ersten hinzufügen.
          </p>
        )}
        {locations.map((location) => (
          <div
            key={location.id}
            className="flex flex-col gap-sm rounded-lg border border-hairline bg-canvas p-md"
          >
            <form action={updateLocation} className="flex flex-col gap-sm">
              <input type="hidden" name="id" value={location.id} />
              <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
                <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
                  Name
                  <TextInput name="name" defaultValue={location.name} required />
                </label>
                <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
                  Adresse
                  <TextInput name="address" defaultValue={location.address ?? ""} />
                </label>
                <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
                  Kapazität (Personen)
                  <TextInput
                    name="capacity"
                    type="number"
                    min={1}
                    defaultValue={location.capacity ?? ""}
                  />
                </label>
                <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
                  Monatsmiete (CHF, optional)
                  <TextInput
                    name="rent_amount_chf"
                    type="number"
                    step="0.05"
                    min={0}
                    defaultValue={
                      location.rent_active && location.rent_amount_cents !== null
                        ? (location.rent_amount_cents / 100).toFixed(2)
                        : ""
                    }
                  />
                </label>
              </div>
              <div className="flex items-center gap-sm">
                <ButtonPrimaryPill type="submit">Speichern</ButtonPrimaryPill>
                <button
                  type="submit"
                  formAction={deleteLocation}
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
        <h2 className="text-heading-md text-ink">Neuer Standort</h2>
        <form action={createLocation} className="flex flex-col gap-sm">
          <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
            Name
            <TextInput name="name" required placeholder="z.B. Jugendhaus Zürich-West" />
          </label>
          <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
            Adresse
            <TextInput name="address" placeholder="Strasse, PLZ Ort" />
          </label>
          <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
            Kapazität (Personen)
            <TextInput name="capacity" type="number" min={1} placeholder="12" />
          </label>
          <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
            Monatsmiete (CHF, optional)
            <TextInput name="rent_amount_chf" type="number" step="0.05" min={0} placeholder="800" />
          </label>
          <ButtonPrimaryPill type="submit" className="self-start">
            Standort speichern
          </ButtonPrimaryPill>
        </form>
      </div>
    </div>
  );
}
