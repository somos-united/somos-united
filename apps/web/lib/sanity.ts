import type { TypedObject } from "@portabletext/types";
import { createClient } from "@sanity/client";

import type { Locale } from "./locales";

/**
 * URL locales ("de"/"en", apps/web/lib/locales.ts) vs Sanity's `language`
 * field ("de-CH"/"en", studio/languages.ts) don't match 1:1 — this is the
 * one place that bridges them.
 */
const SANITY_LANGUAGE_BY_LOCALE: Record<Locale, string> = {
  de: "de-CH",
  en: "en",
};

// Built lazily, not at module scope: `createClient` throws synchronously if
// `projectId` is unset, which would crash Next's build-time "collect page
// data" step (it imports every route module) even though this page is
// `force-dynamic` and the client is only ever actually used at request
// time, once real env vars exist.
function getSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01",
    // No token: this reads only published content at request time, never
    // drafts — matches the "no auto-publish, someone reviews first" rule
    // (SECURITY.md §7) and needs no secret for a public marketing page.
    useCdn: process.env.NODE_ENV === "production",
  });
}

export interface SanitySection {
  _key: string;
  heading?: string;
  layout?: "bento-large" | "bento-medium" | "bento-small";
  body?: TypedObject[];
  image?: { asset: { _ref: string; _type: "reference" } };
}

export interface SanityPageDoc {
  _id: string;
  title: string;
  sections: SanitySection[];
}

export async function getPageBySlug(
  slug: string,
  locale: Locale,
): Promise<SanityPageDoc | null> {
  const language = SANITY_LANGUAGE_BY_LOCALE[locale];
  return getSanityClient().fetch<SanityPageDoc | null>(
    `*[_type == "page" && slug.current == $slug && language == $language][0]{
      _id, title, sections
    }`,
    { slug, language },
  );
}
