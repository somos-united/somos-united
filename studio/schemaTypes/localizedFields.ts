import { defineField } from "sanity";

import { LANGUAGES, LOCALE_FIELD_NAMES } from "../languages";

/**
 * Shared per-language field builders — one object field keyed by locale
 * (`{ de, en }`) rather than a separate document per language. Extracted
 * from module.ts (2026-09-08, see that file's own comment for the "why":
 * two documents per item let non-translatable fields drift apart with
 * nothing to catch it) once homePage.ts needed the same pattern.
 */

export function localizedString(
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

export function localizedText(name: string, title: string, rows: number) {
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

// Localized slugs (one per language, not one shared value) so an English
// visitor gets an English URL word instead of the German one -- standard
// practice, and better for per-language SEO than a shared slug behind a
// locale-prefixed path.
export function localizedSlug(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    options: { columns: 2 },
    fields: LANGUAGES.map((lang) => {
      const fieldName = LOCALE_FIELD_NAMES[lang.id];
      return defineField({
        name: fieldName,
        title: lang.title,
        type: "slug",
        options: {
          source: (doc) =>
            (doc as { title?: Record<string, string> }).title?.[fieldName] ?? "",
          maxLength: 96,
        },
        validation: (Rule) => Rule.required(),
      });
    }),
  });
}

export function localizedBlockContent(name: string, title: string) {
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
