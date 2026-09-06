import { KpiTile } from "@somos/ui";

import { getSupabaseServerClient } from "../../lib/supabase/server";

async function getCounts() {
  const supabase = getSupabaseServerClient();
  const [locations, series, upcomingInstances] = await Promise.all([
    supabase.from("locations").select("id", { count: "exact", head: true }),
    supabase.from("course_series").select("id", { count: "exact", head: true }),
    supabase
      .from("course_instances")
      .select("id", { count: "exact", head: true })
      .gt("start_at", new Date().toISOString()),
  ]);

  return {
    locations: locations.count ?? 0,
    series: series.count ?? 0,
    upcomingInstances: upcomingInstances.count ?? 0,
  };
}

export default async function AdminHomePage() {
  const counts = await getCounts();

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="text-heading-lg text-ink">Übersicht</h1>
      <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
        <KpiTile label="Standorte" value={counts.locations} />
        <KpiTile label="Kursserien" value={counts.series} />
        <KpiTile label="Kommende Termine" value={counts.upcomingInstances} />
      </div>
    </div>
  );
}
