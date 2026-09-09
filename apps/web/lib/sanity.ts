import type { TypedObject } from "@portabletext/types";
import { createClient } from "@sanity/client";
import type { ModuleCategory } from "@somos/types";

import type { Locale } from "./locales";

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

export interface SanityHomePageDoc {
  heroHeadline: string;
  heroSubtext?: string;
  heroPrimaryCta?: string;
  heroSecondaryCta?: string;
  modulesHeading?: string;
  coursesHeading?: string;
  coursesSubtext?: string;
  coursesCta?: string;
  processHeading?: string;
  processSteps: { verb: string; body?: string }[];
  quoteLabel?: string;
  quoteBody?: string;
  quoteAttribution?: string;
  closingHeadline?: string;
  closingCta?: string;
}

// Singleton by convention (homePage.ts), not enforced by the schema --
// `[0]` just takes whichever one exists rather than requiring a known
// document ID, since there's supposed to be exactly one.
export async function getHomePage(locale: Locale): Promise<SanityHomePageDoc | null> {
  return getSanityClient().fetch<SanityHomePageDoc | null>(
    `*[_type == "homePage"][0]{
      "heroHeadline": heroHeadline[$locale],
      "heroSubtext": heroSubtext[$locale],
      "heroPrimaryCta": heroPrimaryCta[$locale],
      "heroSecondaryCta": heroSecondaryCta[$locale],
      "modulesHeading": modulesHeading[$locale],
      "coursesHeading": coursesHeading[$locale],
      "coursesSubtext": coursesSubtext[$locale],
      "coursesCta": coursesCta[$locale],
      "processHeading": processHeading[$locale],
      "processSteps": processSteps[]{ "verb": verb[$locale], "body": body[$locale] },
      "quoteLabel": quoteLabel[$locale],
      "quoteBody": quoteBody[$locale],
      "quoteAttribution": quoteAttribution[$locale],
      "closingHeadline": closingHeadline[$locale],
      "closingCta": closingCta[$locale]
    }`,
    { locale },
  );
}

export interface SanityModuleDoc {
  _id: string;
  title: string;
  slug: string;
  teaser?: string;
  ageRange?: string;
  category: ModuleCategory;
  description: TypedObject[];
}

// Unlike `blogPost`/`legalDocument` (still one document per language via
// the document-internationalization plugin), `module` is a single document
// per item with a field per language (module.ts, changed 2026-09-08: two
// documents per module let shared fields like category/ageRange drift
// between languages with nothing to catch it) -- same pattern as
// `homePage` above. `Locale` ("de"/"en") is used directly as the object
// key here because it already matches the schema's field names
// (studio/languages.ts LOCALE_FIELD_NAMES) -- no separate id mapping
// needed for this schema.
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
    `*[_type == "module" && slug[$locale].current == $slug && status == "published"][0]{
      _id,
      "title": title[$locale],
      "slug": slug[$locale].current,
      "teaser": teaser[$locale],
      "ageRange": ageRange[$locale],
      category,
      "description": description[$locale]
    }`,
    { slug, locale },
  );
}

// Supabase's course_series.module_ref (03-DATA-MODEL.md) is a single
// system-level join key across both languages, not a per-locale URL slug --
// it was set once, to the module's German slug, when the course was
// created. The booking flow (book/[slug]/data.ts) looks a module up by
// that fixed value regardless of visitor locale, so it can't use
// getModuleBySlug above (which now matches the visitor's own locale's
// slug, per module.ts's localized slugs). Still returns locale-appropriate
// title/teaser/description for display.
export async function getModuleByModuleRef(
  moduleRef: string,
  locale: Locale,
): Promise<SanityModuleDoc | null> {
  return getSanityClient().fetch<SanityModuleDoc | null>(
    `*[_type == "module" && slug.de.current == $moduleRef && status == "published"][0]{
      _id,
      "title": title[$locale],
      "slug": slug[$locale].current,
      "teaser": teaser[$locale],
      "ageRange": ageRange[$locale],
      category,
      "description": description[$locale]
    }`,
    { moduleRef, locale },
  );
}

// The 6 module topic-overview documents (Medienkompetenz, Respekt, ...)
// deliberately use the German slug == category (see getModuleBySlug's
// callers in the module index/detail pages and the homepage) so this is
// really just getModuleBySlug called 6× — a dedicated query is only worth
// it because callers want all 6 in one shot, in a stable, known order.
// German specifically (not the requested locale) because it's the one
// slug half that's guaranteed to equal the category code -- the English
// slug is a real translated word (studio/schemaTypes/module.ts) and
// wouldn't match.
export async function getAllModuleTeasers(locale: Locale): Promise<SanityModuleDoc[]> {
  const modules = await getSanityClient().fetch<SanityModuleDoc[]>(
    `*[_type == "module" && status == "published" && slug.de.current == category]{
      _id,
      "title": title[$locale],
      "slug": slug[$locale].current,
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
