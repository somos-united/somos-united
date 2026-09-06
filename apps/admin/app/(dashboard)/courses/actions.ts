"use server";

import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "../../../lib/supabase/server";

export async function createCourseSeries(formData: FormData): Promise<void> {
  const moduleRef = formData.get("module_ref");
  if (typeof moduleRef !== "string" || moduleRef.trim() === "") return;

  const locationId = formData.get("location_id");
  const cadenceLabel = formData.get("cadence_label");
  const aboEnabled = formData.get("abo_enabled") === "on";
  const fomoEnabled = formData.get("fomo_enabled") === "on";

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("course_series").insert({
    module_ref: moduleRef.trim(),
    location_id: typeof locationId === "string" && locationId !== "" ? locationId : null,
    cadence_label:
      typeof cadenceLabel === "string" && cadenceLabel.trim() !== ""
        ? cadenceLabel.trim()
        : null,
    abo_enabled: aboEnabled,
    fomo_enabled: fomoEnabled,
  });

  // redirect, not revalidatePath -- see the same comment in
  // locations/actions.ts (resets the form, avoids inviting a duplicate
  // submit that isn't obviously visible as having worked).
  redirect(error ? "/courses?status=error" : "/courses?status=saved");
}

export async function updateCourseSeries(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const moduleRef = formData.get("module_ref");
  if (typeof id !== "string" || typeof moduleRef !== "string" || moduleRef.trim() === "") return;

  const locationId = formData.get("location_id");
  const cadenceLabel = formData.get("cadence_label");
  const aboEnabled = formData.get("abo_enabled") === "on";
  const fomoEnabled = formData.get("fomo_enabled") === "on";

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("course_series")
    .update({
      module_ref: moduleRef.trim(),
      location_id: typeof locationId === "string" && locationId !== "" ? locationId : null,
      cadence_label:
        typeof cadenceLabel === "string" && cadenceLabel.trim() !== ""
          ? cadenceLabel.trim()
          : null,
      abo_enabled: aboEnabled,
      fomo_enabled: fomoEnabled,
    })
    .eq("id", id);

  redirect(error ? "/courses?status=error" : "/courses?status=updated");
}

export async function deleteCourseSeries(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  // price_tiers CASCADE (deleted with the series), but course_instances
  // only SET NULL (become unassigned one-off dates, not deleted), and any
  // subscriptions referencing this series block the delete entirely (no
  // action) -- the error redirect below surfaces that rather than
  // silently failing.
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("course_series").delete().eq("id", id);

  redirect(error ? "/courses?status=error" : "/courses?status=deleted");
}
