import { redirect } from "next/navigation";

// Force this route to render per-request instead of being statically
// prerendered at build time. A fully static page whose only job is calling
// redirect() gets its redirect baked into a cached static asset, and
// `next start` doesn't attach the `Location` header when serving that
// cached asset (reproduced against Next.js 14.2.15: `next build` marks "/"
// as ○ Static, and the production server then returns 307 with no
// `Location` header — visitors hitting "/" see a blank page instead of
// landing on /de). Found via apps/web/e2e/smoke.spec.ts.
export const dynamic = "force-dynamic";

// No locale prefix -> redirect to the default locale (01-ARCHITECTURE.md §6:
// "kein Locale-Präfix = Redirect auf Default (de)").
export default function RootPage() {
  redirect("/de");
}
