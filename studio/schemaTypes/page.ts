import { defineArrayMember, defineField, defineType } from "sanity";

import { LANGUAGES } from "../languages";

/**
 * Flexible section block for the Bento-grid marketing layout
 * (04-DESIGN-SYSTEM.md §5). Deliberately generic in Phase 0 — a fuller,
 * more opinionated set of section types can replace/extend this once
 * apps/web's real page-builder UI is designed in Phase 1.
 */
const pageSection = defineArrayMember({
  name: "section",
  title: "Section",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "layout",
      title: "Bento-Layout",
      type: "string",
      options: {
        list: [
          { title: "Gross (2×2)", value: "bento-large" },
          { title: "Mittel (2×1 / 1×1)", value: "bento-medium" },
          { title: "Klein (1×1)", value: "bento-small" },
        ],
      },
    }),
    defineField({ name: "body", title: "Text", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "image", title: "Bild", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "heading", subtitle: "layout" },
  },
});

export const pageType = defineType({
  name: "page",
  title: "Seite",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "language",
      title: "Sprache",
      type: "string",
      readOnly: true,
      options: {
        list: LANGUAGES.map((lang) => ({ title: lang.title, value: lang.id })),
      },
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [pageSection],
    }),
  ],
});
