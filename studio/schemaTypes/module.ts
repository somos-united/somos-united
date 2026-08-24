import { defineField, defineType } from "sanity";

import { LANGUAGES } from "../languages";

// Fixed content taxonomy from md/03-DATA-MODEL.md §1 — this is a CMS schema
// enum (editors still fully control the display title/copy per module), not
// a hardcoded business value in the "no hardcoding" sense of
// 00-MASTER-PLAN.md §0 (that principle targets prices/rates/policy text
// living admin-editable in DB/CMS instead of in application code).
const CATEGORIES = [
  { title: "Medienkompetenz", value: "medienkompetenz" },
  { title: "Respekt", value: "respekt" },
  { title: "Gewaltprävention", value: "gewaltpraevention" },
  { title: "Psychische Belastung", value: "psychische_belastung" },
  { title: "Orientierung", value: "orientierung" },
  { title: "Social Media", value: "social_media" },
];

export const moduleType = defineType({
  name: "module",
  title: "Modul",
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
      name: "description",
      title: "Beschreibung",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      options: { list: CATEGORIES, layout: "dropdown" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ageRange",
      title: "Altersspanne",
      type: "string",
      description: 'Freitext, z.B. "10–14 Jahre".',
    }),
    defineField({
      name: "heroImage",
      title: "Hero-Bild",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "onboardingTooltip",
      title: "Onboarding-Tooltip",
      type: "text",
      description: "Wird beim ersten Erscheinen des Moduls gezeigt.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      options: {
        list: [
          { title: "Entwurf", value: "draft" },
          { title: "Veröffentlicht", value: "published" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "notionSourceId",
      title: "Notion Source ID",
      type: "string",
      readOnly: true,
      description:
        "Gesetzt vom Notion→Sanity-Sync (01-ARCHITECTURE.md §8), sonst leer/nullable.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "heroImage" },
  },
});
