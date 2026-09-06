import { notFound } from "next/navigation";

import { ButtonPrimaryPill, GlassPanel, TextInput } from "@somos/ui";

import { getSupabaseServerClient } from "../../../../lib/supabase/server";
import { createInstance, createPriceTier } from "./actions";

interface SeriesDetail {
  id: string;
  module_ref: string;
  location_id: string | null;
  cadence_label: string | null;
  abo_enabled: boolean;
  fomo_enabled: boolean;
}

interface InstanceRow {
  id: string;
  start_at: string;
  end_at: string;
  capacity: number;
  location_id: string | null;
}

interface PriceTierRow {
  id: string;
  plan_type: string;
  days_before_min: number;
  days_before_max: number | null;
  price_cents: number;
  label: string | null;
}

interface LocationOption {
  id: string;
  name: string;
}

async function getSeries(id: string): Promise<SeriesDetail | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("course_series")
    .select("id, module_ref, location_id, cadence_label, abo_enabled, fomo_enabled")
    .eq("id", id)
    .single();
  return data;
}

async function getInstances(seriesId: string): Promise<InstanceRow[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("course_instances")
    .select("id, start_at, end_at, capacity, location_id")
    .eq("series_id", seriesId)
    .order("start_at");
  return data ?? [];
}

async function getPriceTiers(seriesId: string): Promise<PriceTierRow[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("price_tiers")
    .select("id, plan_type, days_before_min, days_before_max, price_cents, label")
    .eq("series_id", seriesId)
    .order("plan_type")
    .order("days_before_min");
  return data ?? [];
}

async function getLocationOptions(): Promise<LocationOption[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("locations").select("id, name").order("name");
  return data ?? [];
}

export default async function CourseSeriesDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { status?: string };
}) {
  const series = await getSeries(params.id);
  if (!series) notFound();

  const [instances, priceTiers, locations] = await Promise.all([
    getInstances(series.id),
    getPriceTiers(series.id),
    getLocationOptions(),
  ]);

  const createInstanceForSeries = createInstance.bind(null, series.id);
  const createPriceTierForSeries = createPriceTier.bind(null, series.id);

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-heading-lg text-ink">{series.module_ref}</h1>
        <p className="text-caption-lg text-ink-mute">
          {series.cadence_label ?? "Kein Rhythmus angegeben"}
          {" · "}
          {series.fomo_enabled ? "FOMO-Pills an" : "FOMO-Pills aus"}
          {" · "}
          {series.abo_enabled ? "Abo möglich" : "Nur Einzelbuchung"}
        </p>
      </div>

      {searchParams.status === "instance_saved" && (
        <p className="rounded-sm bg-status-good-bg px-md py-sm text-body text-status-good-text">
          Termin gespeichert.
        </p>
      )}
      {searchParams.status === "tier_saved" && (
        <p className="rounded-sm bg-status-good-bg px-md py-sm text-body text-status-good-text">
          Preisstufe gespeichert.
        </p>
      )}

      <section className="flex flex-col gap-sm">
        <h2 className="text-heading-md text-ink">Termine</h2>
        {instances.length === 0 && (
          <p className="text-body text-ink-secondary">Noch keine Termine angelegt.</p>
        )}
        {instances.map((instance) => (
          <GlassPanel key={instance.id} className="flex items-baseline justify-between p-md">
            <span className="text-body text-ink">
              {new Date(instance.start_at).toLocaleString("de-CH", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
            <span className="text-caption-lg text-ink-mute">Kapazität {instance.capacity}</span>
          </GlassPanel>
        ))}

        <GlassPanel className="flex flex-col gap-sm p-lg">
          <h3 className="text-heading-md text-ink">Neuer Termin</h3>
          <form action={createInstanceForSeries} className="flex flex-col gap-sm">
            <input type="hidden" name="module_ref" value={series.module_ref} />
            <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
              Beginn
              <TextInput name="start_at" type="datetime-local" required />
            </label>
            <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
              Ende
              <TextInput name="end_at" type="datetime-local" required />
            </label>
            <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
              Kapazität
              <TextInput name="capacity" type="number" min={1} required placeholder="12" />
            </label>
            <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
              Standort
              <select
                name="location_id"
                defaultValue={series.location_id ?? ""}
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
            <ButtonPrimaryPill type="submit" className="self-start">
              Termin speichern
            </ButtonPrimaryPill>
          </form>
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-sm">
        <h2 className="text-heading-md text-ink">Preisstaffel</h2>
        {priceTiers.length === 0 && (
          <p className="text-body text-ink-secondary">Noch keine Preisstaffel angelegt.</p>
        )}
        {priceTiers.map((tier) => (
          <GlassPanel key={tier.id} className="flex items-baseline justify-between p-md">
            <span className="text-body text-ink">
              {tier.plan_type}
              {tier.label ? ` — ${tier.label}` : ""}
            </span>
            <span className="text-caption-lg text-ink-mute">
              ab {tier.days_before_min} Tage vorher
              {tier.days_before_max !== null ? ` bis ${tier.days_before_max}` : " (offen)"}
              {" · CHF "}
              {(tier.price_cents / 100).toFixed(2)}
            </span>
          </GlassPanel>
        ))}

        <GlassPanel className="flex flex-col gap-sm p-lg">
          <h3 className="text-heading-md text-ink">Neue Preisstufe</h3>
          <form action={createPriceTierForSeries} className="flex flex-col gap-sm">
            <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
              Buchungsart
              <select
                name="plan_type"
                required
                className="w-full rounded-sm border border-hairline bg-canvas px-md py-sm text-body text-ink focus:border-primary focus:outline-none"
              >
                <option value="single">Einzelbuchung</option>
                <option value="6x">Abo 6x</option>
                <option value="12x">Abo 12x</option>
                <option value="24x">Abo 24x</option>
              </select>
            </label>
            <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
              Ab wie vielen Tagen vorher gilt dieser Preis (Minimum)
              <TextInput name="days_before_min" type="number" min={0} required placeholder="0" />
            </label>
            <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
              Bis wie vielen Tagen vorher (leer = kein Maximum, z.B. Early Bird)
              <TextInput name="days_before_max" type="number" min={0} placeholder="30" />
            </label>
            <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
              Preis (CHF)
              <TextInput name="price_chf" type="number" step="0.05" min={0} required placeholder="35" />
            </label>
            <label className="flex flex-col gap-xs text-caption-lg text-ink-secondary">
              Label (nur zur Übersicht, z.B. &ldquo;Early Bird&rdquo;)
              <TextInput name="label" placeholder="Early Bird" />
            </label>
            <ButtonPrimaryPill type="submit" className="self-start">
              Preisstufe speichern
            </ButtonPrimaryPill>
          </form>
        </GlassPanel>
      </section>
    </div>
  );
}
