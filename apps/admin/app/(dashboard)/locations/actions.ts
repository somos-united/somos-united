"use server";

import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "../../../lib/supabase/server";

export async function createLocation(formData: FormData): Promise<void> {
  const name = formData.get("name");
  if (typeof name !== "string" || name.trim() === "") return;

  const address = formData.get("address");
  const capacity = formData.get("capacity");
  const rentAmount = formData.get("rent_amount_chf");

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("locations").insert({
    name: name.trim(),
    address: typeof address === "string" && address.trim() !== "" ? address.trim() : null,
    capacity:
      typeof capacity === "string" && capacity !== "" ? Number.parseInt(capacity, 10) : null,
    rent_amount_cents:
      typeof rentAmount === "string" && rentAmount !== ""
        ? Math.round(Number.parseFloat(rentAmount) * 100)
        : null,
    rent_active: typeof rentAmount === "string" && rentAmount !== "",
  });

  // redirect (not revalidatePath) so the form's uncontrolled inputs
  // actually reset via a fresh navigation -- otherwise a saved location
  // just reappears in the list above an unchanged, still-filled-in form,
  // which reads as "did that even work?" and invites a duplicate submit
  // (exactly what happened testing this: three "Schulhaus Scherr" rows).
  redirect(error ? "/locations?status=error" : "/locations?status=saved");
}

export async function updateLocation(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const name = formData.get("name");
  if (typeof id !== "string" || typeof name !== "string" || name.trim() === "") return;

  const address = formData.get("address");
  const capacity = formData.get("capacity");
  const rentAmount = formData.get("rent_amount_chf");

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("locations")
    .update({
      name: name.trim(),
      address: typeof address === "string" && address.trim() !== "" ? address.trim() : null,
      capacity:
        typeof capacity === "string" && capacity !== "" ? Number.parseInt(capacity, 10) : null,
      rent_amount_cents:
        typeof rentAmount === "string" && rentAmount !== ""
          ? Math.round(Number.parseFloat(rentAmount) * 100)
          : null,
      rent_active: typeof rentAmount === "string" && rentAmount !== "",
    })
    .eq("id", id);

  redirect(error ? "/locations?status=error" : "/locations?status=updated");
}

export async function deleteLocation(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  // course_series/course_instances referencing this location have
  // ON DELETE SET NULL (not CASCADE) -- deleting a location un-assigns it
  // from any courses rather than deleting those too.
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("locations").delete().eq("id", id);

  redirect(error ? "/locations?status=error" : "/locations?status=deleted");
}
