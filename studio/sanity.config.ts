import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { LANGUAGES } from "./languages";
import { schemaTypes } from "./schemaTypes";

// Live project: ydbo6w2y ("Somos United", dataset "production"), set via
// studio/.env. Falls back to "placeholder" only if that file is missing, so
// `sanity build`/`sanity dev` still start without crashing.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "placeholder";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineConfig({
  name: "somos-united",
  title: "Somos United",

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
    // i18n (01-ARCHITECTURE.md §6): page/blogPost/legalDocument get a
    // per-language document + a `translation.metadata` document linking the
    // language variants — that sixth schema from md/03-DATA-MODEL.md §1 is
    // registered by this plugin itself, not hand-authored in schemaTypes/.
    //
    // `module` deliberately does NOT use this plugin (removed 2026-09-08):
    // for short structured content like modules, two documents per item
    // meant category/ageRange/slug were entered twice and could drift
    // between languages with nothing to catch it. module.ts now holds one
    // document per item with a field per language instead.
    documentInternationalization({
      supportedLanguages: LANGUAGES.map((lang) => ({ id: lang.id, title: lang.title })),
      schemaTypes: ["page", "blogPost", "legalDocument"],
      allowCreateMetaDoc: true,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
