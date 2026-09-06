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
  await supabase.from("course_series").insert({
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
  redirect("/courses?status=saved");
}
