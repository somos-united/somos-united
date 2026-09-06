"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerClient } from "../../../lib/supabase/server";

export async function updateTeamMemberRole(formData: FormData): Promise<void> {
  const targetId = formData.get("target_id");
  const newRole = formData.get("role");
  if (typeof targetId !== "string" || typeof newRole !== "string") return;

  const supabase = getSupabaseServerClient();
  await supabase.rpc("update_team_member_role", {
    target_id: targetId,
    new_role: newRole,
  });

  revalidatePath("/team");
}
