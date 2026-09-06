"use server";

import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "../../../../lib/supabase/server";

export async function createInstance(seriesId: string, formData: FormData): Promise<void> {
  const startAt = formData.get("start_at");
  const endAt = formData.get("end_at");
  const capacity = formData.get("capacity");
  if (typeof startAt !== "string" || startAt === "") return;
  if (typeof endAt !== "string" || endAt === "") return;
  if (typeof capacity !== "string" || capacity === "") return;

  const locationId = formData.get("location_id");
  const moduleRef = formData.get("module_ref");

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("course_instances").insert({
    series_id: seriesId,
    module_ref: typeof moduleRef === "string" ? moduleRef : "",
    location_id: typeof locationId === "string" && locationId !== "" ? locationId : null,
    start_at: new Date(startAt).toISOString(),
    end_at: new Date(endAt).toISOString(),
    capacity: Number.parseInt(capacity, 10),
  });

  // redirect, not revalidatePath -- see locations/actions.ts's comment.
  redirect(`/courses/${seriesId}?status=${error ? "error" : "instance_saved"}`);
}

export async function updateInstance(seriesId: string, formData: FormData): Promise<void> {
  const id = formData.get("id");
  const startAt = formData.get("start_at");
  const endAt = formData.get("end_at");
  const capacity = formData.get("capacity");
  if (typeof id !== "string") return;
  if (typeof startAt !== "string" || startAt === "") return;
  if (typeof endAt !== "string" || endAt === "") return;
  if (typeof capacity !== "string" || capacity === "") return;

  const locationId = formData.get("location_id");

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("course_instances")
    .update({
      location_id: typeof locationId === "string" && locationId !== "" ? locationId : null,
      start_at: new Date(startAt).toISOString(),
      end_at: new Date(endAt).toISOString(),
      capacity: Number.parseInt(capacity, 10),
    })
    .eq("id", id);

  redirect(`/courses/${seriesId}?status=${error ? "error" : "instance_updated"}`);
}

export async function deleteInstance(seriesId: string, formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  // bookings.course_instance_id has no delete rule set (blocks the
  // delete if any booking references this instance) -- the error
  // redirect surfaces that rather than silently failing.
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("course_instances").delete().eq("id", id);

  redirect(`/courses/${seriesId}?status=${error ? "error" : "instance_deleted"}`);
}

export async function createPriceTier(seriesId: string, formData: FormData): Promise<void> {
  const planType = formData.get("plan_type");
  const daysBeforeMin = formData.get("days_before_min");
  const priceChf = formData.get("price_chf");
  if (typeof planType !== "string" || planType === "") return;
  if (typeof daysBeforeMin !== "string" || daysBeforeMin === "") return;
  if (typeof priceChf !== "string" || priceChf === "") return;

  const daysBeforeMax = formData.get("days_before_max");
  const label = formData.get("label");

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("price_tiers").insert({
    series_id: seriesId,
    plan_type: planType,
    days_before_min: Number.parseInt(daysBeforeMin, 10),
    days_before_max:
      typeof daysBeforeMax === "string" && daysBeforeMax !== ""
        ? Number.parseInt(daysBeforeMax, 10)
        : null,
    price_cents: Math.round(Number.parseFloat(priceChf) * 100),
    label: typeof label === "string" && label.trim() !== "" ? label.trim() : null,
  });

  redirect(`/courses/${seriesId}?status=${error ? "error" : "tier_saved"}`);
}

export async function updatePriceTier(seriesId: string, formData: FormData): Promise<void> {
  const id = formData.get("id");
  const planType = formData.get("plan_type");
  const daysBeforeMin = formData.get("days_before_min");
  const priceChf = formData.get("price_chf");
  if (typeof id !== "string") return;
  if (typeof planType !== "string" || planType === "") return;
  if (typeof daysBeforeMin !== "string" || daysBeforeMin === "") return;
  if (typeof priceChf !== "string" || priceChf === "") return;

  const daysBeforeMax = formData.get("days_before_max");
  const label = formData.get("label");

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("price_tiers")
    .update({
      plan_type: planType,
      days_before_min: Number.parseInt(daysBeforeMin, 10),
      days_before_max:
        typeof daysBeforeMax === "string" && daysBeforeMax !== ""
          ? Number.parseInt(daysBeforeMax, 10)
          : null,
      price_cents: Math.round(Number.parseFloat(priceChf) * 100),
      label: typeof label === "string" && label.trim() !== "" ? label.trim() : null,
    })
    .eq("id", id);

  redirect(`/courses/${seriesId}?status=${error ? "error" : "tier_updated"}`);
}

export async function deletePriceTier(seriesId: string, formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("price_tiers").delete().eq("id", id);

  redirect(`/courses/${seriesId}?status=${error ? "error" : "tier_deleted"}`);
}
