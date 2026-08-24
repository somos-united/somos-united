/**
 * Placeholder TypeScript types for the Sanity content schemas defined in
 * `studio/schemaTypes/` (source of truth: md/03-DATA-MODEL.md §1). These are
 * intentionally light hand-written mirrors, not generated (no
 * `sanity-codegen`/`sanity typegen` run yet since there's no deployed
 * dataset with real content). Replace/regenerate once Phase 1 starts
 * consuming real Sanity content from `apps/web`.
 */

export type SanityLocale = "de-CH" | "en";

export interface SanityImageRef {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

/** Sanity Portable Text — kept as `unknown[]` at this placeholder stage. */
export type PortableTextBlock = unknown;

export type ModuleCategory =
  | "medienkompetenz"
  | "respekt"
  | "gewaltpraevention"
  | "psychische_belastung"
  | "orientierung"
  | "social_media";

export type SanityDocStatus = "draft" | "published";

export interface SanityModule {
  _id: string;
  _type: "module";
  title: string;
  slug: { current: string };
  language: SanityLocale;
  description: PortableTextBlock[];
  category: ModuleCategory;
  ageRange: string;
  heroImage?: SanityImageRef;
  onboardingTooltip?: string;
  status: SanityDocStatus;
  notionSourceId?: string | null;
}

export interface SanityPageSection {
  _key: string;
  _type: string;
  [field: string]: unknown;
}

export interface SanityPage {
  _id: string;
  _type: "page";
  title: string;
  slug: { current: string };
  language: SanityLocale;
  sections: SanityPageSection[];
}

export interface SanityBlogPost {
  _id: string;
  _type: "blogPost";
  title: string;
  slug: { current: string };
  language: SanityLocale;
  publishedAt: string;
  body: PortableTextBlock[];
}

export type LegalDocumentType = "agb" | "datenschutz";

export interface SanityLegalDocument {
  _id: string;
  _type: "legalDocument";
  type: LegalDocumentType;
  language: SanityLocale;
  version: string;
  effectiveFrom: string;
  body: PortableTextBlock[];
}

export interface SanitySiteSettingsSocialLink {
  _key: string;
  platform: string;
  url: string;
}

export interface SanitySiteSettings {
  _id: string;
  _type: "siteSettings";
  socialLinks?: SanitySiteSettingsSocialLink[];
  footerText?: PortableTextBlock[];
  contactEmail?: string;
  contactPhone?: string;
  defaultLocale: SanityLocale;
}

export interface SanityTranslationMetadata {
  _id: string;
  _type: "translation.metadata";
  translations: Array<{
    _key: string;
    value: { _type: "reference"; _ref: string };
  }>;
}
