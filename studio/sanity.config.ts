import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { LANGUAGES } from "./languages";
import { schemaTypes } from "./schemaTypes";

// No live Sanity project exists yet (md/02-DEPLOYMENT.md §2/§8) — these env
// vars are unset until that project is created; the placeholder keeps
// `sanity build`/`sanity dev` runnable locally in the meantime.
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
