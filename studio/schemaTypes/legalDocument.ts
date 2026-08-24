import { defineField, defineType } from "sanity";

import { LANGUAGES } from "../languages";

export const legalDocumentType = defineType({
  name: "legalDocument",
  title: "Rechtsdokument",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Typ",
      type: "string",
      options: {
        list: [
          { title: "AGB", value: "agb" },
          { title: "Datenschutzerklärung", value: "datenschutz" },
        ],
      },
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
      name: "version",
      title: "Version",
      type: "string",
      description:
        "Versioniert, weil eine Buchung immer gegen die zum Buchungszeitpunkt gültige Version verweist (bookings.legal_document_version, siehe md/03-DATA-MODEL.md §2.3).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "effectiveFrom",
      title: "Gültig ab",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Inhalt",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "type", subtitle: "version" },
  },
});
