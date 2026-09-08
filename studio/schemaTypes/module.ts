import { defineField, defineType } from "sanity";

import { LANGUAGES, LOCALE_FIELD_NAMES } from "../languages";

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

// One module = one card, with a field per language for anything editorially
// translatable (title, teaser, description, age range, tooltip). Fields that
// aren't language-specific (category, slug, hero image, status) exist once,
// so they can't silently drift between language versions the way they could
// when DE/EN lived as two separate documents linked behind the scenes —
// Danny flagged that risk directly 2026-09-08 ("this is a recipe for a huge
// MESS") and this schema shape removes it rather than just documenting it.
function localizedString(
  name: string,
  title: string,
  options: { required?: boolean; max?: number } = {},
) {
  return defineField({
    name,
    title,
    type: "object",
    options: { columns: 2 },
    fields: LANGUAGES.map((lang) =>
      defineField({
        name: LOCALE_FIELD_NAMES[lang.id],
        title: lang.title,
        type: "string",
        validation: (Rule) => {
          const base = options.required ? Rule.required() : Rule;
          return options.max ? base.max(options.max) : base;
        },
      }),
    ),
  });
}

function localizedText(name: string, title: string, rows: number) {
  return defineField({
    name,
    title,
    type: "object",
    fields: LANGUAGES.map((lang) =>
      defineField({
        name: LOCALE_FIELD_NAMES[lang.id],
        title: lang.title,
        type: "text",
        rows,
      }),
    ),
  });
}

function localizedBlockContent(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: LANGUAGES.map((lang) =>
      defineField({
        name: LOCALE_FIELD_NAMES[lang.id],
        title: lang.title,
        type: "array",
        of: [{ type: "block" }],
      }),
    ),
  });
}

export const moduleType = defineType({
  name: "module",
  title: "Modul",
  type: "document",
  fields: [
    localizedString("title", "Titel", { required: true }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      // Nested-path strings aren't supported by the Studio's default slug
      // source resolver, hence the function form.
      options: {
        source: (doc) => (doc as { title?: { de?: string } }).title?.de ?? "",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    localizedString("teaser", "Teaser (Kurztext)", { max: 160 }),
    localizedBlockContent("description", "Beschreibung"),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      options: { list: CATEGORIES, layout: "dropdown" },
      validation: (Rule) => Rule.required(),
    }),
    localizedString("ageRange", "Altersspanne", {}),
    defineField({
      name: "heroImage",
      title: "Hero-Bild",
      type: "image",
      options: { hotspot: true },
    }),
    localizedText("onboardingTooltip", "Onboarding-Tooltip", 3),
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
    select: { title: "title.de", subtitle: "category", media: "heroImage" },
  },
});
