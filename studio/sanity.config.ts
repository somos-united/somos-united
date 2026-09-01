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
    // i18n (01-ARCHITECTURE.md §6): module/page/blogPost/legalDocument get a
    // per-language document + a `translation.metadata` document linking the
    // language variants — that sixth schema from md/03-DATA-MODEL.md §1 is
    // registered by this plugin itself, not hand-authored in schemaTypes/.
    documentInternationalization({
      supportedLanguages: LANGUAGES.map((lang) => ({ id: lang.id, title: lang.title })),
      schemaTypes: ["module", "page", "blogPost", "legalDocument"],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
