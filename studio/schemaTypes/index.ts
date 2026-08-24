import type { SchemaTypeDefinition } from "sanity";

import { blogPostType } from "./blogPost";
import { legalDocumentType } from "./legalDocument";
import { moduleType } from "./module";
import { pageType } from "./page";
import { siteSettingsType } from "./siteSettings";

// The sixth schema from md/03-DATA-MODEL.md §1 — `translation.metadata` — is
// registered at runtime by the `@sanity/document-internationalization`
// plugin (see sanity.config.ts), not hand-authored here: it's the plugin's
// own document type and redefining it would conflict.
export const schemaTypes: SchemaTypeDefinition[] = [
  moduleType,
  pageType,
  blogPostType,
  legalDocumentType,
  siteSettingsType,
];
