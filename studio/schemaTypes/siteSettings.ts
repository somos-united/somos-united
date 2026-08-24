import { defineArrayMember, defineField, defineType } from "sanity";

import { DEFAULT_LANGUAGE, LANGUAGES } from "../languages";

/**
 * Global settings — a singleton document (one row, not internationalized
 * per-document like module/page/blogPost/legalDocument; `defaultLocale`
 * itself picks which locale is the site default).
 */
export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site-Einstellungen",
  type: "document",
  fields: [
    defineField({
      name: "defaultLocale",
      title: "Standard-Locale",
      type: "string",
      initialValue: DEFAULT_LANGUAGE,
      options: {
        list: LANGUAGES.map((lang) => ({ title: lang.title, value: lang.id })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactEmail",
      title: "Kontakt-E-Mail",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Kontakt-Telefon",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social-Links",
      type: "array",
      of: [
        defineArrayMember({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Plattform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer-Text",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site-Einstellungen" }),
  },
});
