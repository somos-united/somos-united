import type { TypedObject } from "@portabletext/types";
import { createClient } from "@sanity/client";
import type { ModuleCategory } from "@somos/types";

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
    //
    // useCdn deliberately false, including in production: caught live
    // (2026-09-08) that Sanity's CDN endpoint can lag ~60s+ behind a
    // fresh publish, which directly undermines the "content changes must
    // actually be editable and show up" principle this whole content
    // migration is built around. This site's traffic doesn't need CDN
    // caching; guaranteed consistency matters more than the marginal
    // speed/cost benefit here.
    useCdn: false,
  });
}

// Shared by every consumer that needs plain text out of a portable-text
// field without pulling in a full portable-text renderer for what's
// currently always plain paragraphs (no bold/links/lists yet). Returns
// one string per block, so callers choose how to join them (separate
// <p> tags vs. one blob) rather than baking that choice in here.
export function portableTextToPlainParagraphs(blocks: TypedObject[]): string[] {
  return blocks
    .map((block) => {
      if (typeof block !== "object" || block === null || !("children" in block)) return "";
      const children = (block as { children?: unknown }).children;
      if (!Array.isArray(children)) return "";
      return children
        .map((child) =>
          typeof child === "object" && child !== null && "text" in child
            ? String((child as { text?: unknown }).text ?? "")
            : "",
        )
        .join("");
    })
    .filter((paragraph) => paragraph !== "");
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

export interface SanityModuleDoc {
  _id: string;
  title: string;
  teaser?: string;
  ageRange?: string;
  category: ModuleCategory;
  description: TypedObject[];
}

// Unlike `page` (still one document per language via the
// document-internationalization plugin, see getPageBySlug above), `module`
// is a single document per item with a field per language (module.ts,
// changed 2026-09-08: two documents per module let shared fields like
// category/ageRange drift between languages with nothing to catch it).
// `Locale` ("de"/"en") is used directly as the object key here because it
// already matches the schema's field names (studio/languages.ts
// LOCALE_FIELD_NAMES) -- no separate id mapping needed for this schema.
//
// `status == "published"` is the schema's own editorial flag on top of
// Sanity's draft/publish mechanism, so a module can exist and be published
// in Sanity but still be marked "draft" content-wise while the editorial
// team works on it.
export async function getModuleBySlug(
  slug: string,
  locale: Locale,
): Promise<SanityModuleDoc | null> {
  return getSanityClient().fetch<SanityModuleDoc | null>(
    `*[_type == "module" && slug.current == $slug && status == "published"][0]{
      _id,
      "title": title[$locale],
      "teaser": teaser[$locale],
      "ageRange": ageRange[$locale],
      category,
      "description": description[$locale]
    }`,
    { slug, locale },
  );
}

// The 6 module topic-overview documents (Medienkompetenz, Respekt, ...)
// deliberately use slug == category (see getModuleBySlug's callers in the
// module index/detail pages and the homepage) so this is really just
// getModuleBySlug called 6× — a dedicated query is only worth it because
// callers want all 6 in one shot, in a stable, known order.
export async function getAllModuleTeasers(locale: Locale): Promise<SanityModuleDoc[]> {
  const modules = await getSanityClient().fetch<SanityModuleDoc[]>(
    `*[_type == "module" && status == "published" && slug.current == category]{
      _id,
      "title": title[$locale],
      "teaser": teaser[$locale],
      "ageRange": ageRange[$locale],
      category,
      "description": description[$locale]
    }`,
    { locale },
  );

  const order: ModuleCategory[] = [
    "medienkompetenz",
    "respekt",
    "gewaltpraevention",
    "psychische_belastung",
    "orientierung",
    "social_media",
  ];
  return order
    .map((category) => modules.find((m) => m.category === category))
    .filter((m): m is SanityModuleDoc => m !== undefined);
}
