import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Built lazily inside each caller, not at module scope: createServerClient
// needs `cookies()` from next/headers, which throws outside a request
// context (e.g. during Next's build-time page-data collection).
export function getSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render, where cookies can't
            // be written — middleware.ts refreshes the session instead.
          }
        },
      },
    },
  );
}
