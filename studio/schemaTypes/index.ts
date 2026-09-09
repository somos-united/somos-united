import type { SchemaTypeDefinition } from "sanity";

import { blogPostType } from "./blogPost";
import { homePageSchemaTypes } from "./homePage";
import { legalDocumentType } from "./legalDocument";
import { moduleType } from "./module";
import { siteSettingsType } from "./siteSettings";

// The sixth schema from md/03-DATA-MODEL.md §1 — `translation.metadata` — is
// registered at runtime by the `@sanity/document-internationalization`
// plugin (see sanity.config.ts), not hand-authored here: it's the plugin's
// own document type and redefining it would conflict.
//
// `page` (generic Bento "Sections" builder) removed 2026-09-09: nothing in
// apps/web ever called getPageBySlug, so it was dead content sitting in the
// Studio next to the real, wired-up homePage document below.
export const schemaTypes: SchemaTypeDefinition[] = [
  moduleType,
  ...homePageSchemaTypes,
  blogPostType,
  legalDocumentType,
  siteSettingsType,
];
