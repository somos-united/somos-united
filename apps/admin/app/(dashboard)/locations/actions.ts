"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerClient } from "../../../lib/supabase/server";

export async function createLocation(formData: FormData): Promise<void> {
  const name = formData.get("name");
  if (typeof name !== "string" || name.trim() === "") return;

  const address = formData.get("address");
  const capacity = formData.get("capacity");
  const rentAmount = formData.get("rent_amount_chf");

  const supabase = getSupabaseServerClient();
  await supabase.from("locations").insert({
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

  revalidatePath("/locations");
}
