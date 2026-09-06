import { createClient } from "@supabase/supabase-js";

// Server-only, privileged client — bypasses RLS entirely. Never import this
// into anything that could run in the browser, and use it only for the
// narrow set of checks that must happen before a user has a session (e.g.
// login/actions.ts's pre-OTP admin-email check via the email_is_approved_admin
// RPC, which is locked down to service_role — see
// 20260906010000_email_is_approved_admin.sql). Everything else should keep
// using the cookie-based client in server.ts, which respects RLS.
export function getSupabaseServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
