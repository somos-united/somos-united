import { ButtonPrimaryPill, GlassPanel, TextInput } from "@somos/ui";

import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { createLocation } from "./actions";

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

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const locations = await getLocations();

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="text-heading-lg text-ink">Standorte</h1>

      {searchParams.status === "saved" && (
        <p className="rounded-sm bg-status-good-bg px-md py-sm text-body text-status-good-text">
          Standort gespeichert.
        </p>
      )}

      <div className="flex flex-col gap-sm">
        {locations.length === 0 && (
          <p className="text-body text-ink-secondary">
            Noch keine Standorte angelegt — unten den ersten hinzufügen.
          </p>
        )}
        {locations.map((location) => (
          <GlassPanel key={location.id} className="flex flex-col gap-xs p-md">
            <div className="flex items-baseline justify-between">
              <span className="text-body font-medium text-ink">{location.name}</span>
              {location.capacity !== null && (
                <span className="text-caption-lg text-ink-mute">
                  Kapazität {location.capacity}
                </span>
              )}
            </div>
            {location.address && (
              <span className="text-caption-lg text-ink-secondary">{location.address}</span>
            )}
            {location.rent_active && location.rent_amount_cents !== null && (
              <span className="text-caption-lg text-ink-mute">
                Miete: CHF {(location.rent_amount_cents / 100).toFixed(2)}
              </span>
            )}
          </GlassPanel>
        ))}
      </div>

      <GlassPanel className="flex flex-col gap-sm p-lg">
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
      </GlassPanel>
    </div>
  );
}
