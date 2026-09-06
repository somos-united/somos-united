import { getSupabaseServerClient } from "./supabase/server";

export interface CurrentProfile {
  id: string;
  email: string | undefined;
  role: string;
  isAdmin: boolean;
}

// Middleware only checks "is there a logged-in user" (cheap, no DB read).
// This does the real authorization check — is this user's profile.role
// actually admin/superuser — and is called by every data page before it
// touches locations/course_series/course_instances/price_tiers. RLS backs
// this up server-side (20260906000000_admin_console_rls.sql), so a bug
// here can't leak data, only mis-render a page.
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "client";

  return {
    id: user.id,
    email: user.email,
    role,
    isAdmin: role === "admin" || role === "superuser",
  };
}
