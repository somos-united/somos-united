import { createClient } from "@supabase/supabase-js";

// Built lazily, not at module scope: same reason as getSanityClient() in
// sanity.ts -- createClient throws synchronously if the URL is unset,
// which would crash Next's build-time "collect page data" step. Anon-key
// only, no auth/cookies -- the public site only ever reads what
// 20260906030000_public_booking_read_access.sql explicitly opened up
// (course_series/course_instances/price_tiers, locations via the
// locations_public view), never writes.
export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
