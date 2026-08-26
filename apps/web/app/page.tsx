import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { detectLocale } from "@/lib/detect-locale";

// Force this route to render per-request instead of being statically
// prerendered at build time. A fully static page whose only job is calling
// redirect() gets its redirect baked into a cached static asset, and
// `next start` doesn't attach the `Location` header when serving that
// cached asset (reproduced against Next.js 14.2.15: `next build` marks "/"
// as ○ Static, and the production server then returns 307 with no
// `Location` header — visitors hitting "/" see a blank page instead of
// landing on /de). Found via apps/web/e2e/smoke.spec.ts. Also required
// here regardless, since reading the request's Accept-Language header via
// headers() needs a per-request render.
export const dynamic = "force-dynamic";

// No locale prefix -> redirect based on the browser's Accept-Language
// header, falling back to the default (de) when absent or unsupported
// (01-ARCHITECTURE.md §6).
export default function RootPage() {
  const acceptLanguage = headers().get("accept-language");
  redirect(`/${detectLocale(acceptLanguage)}`);
}
