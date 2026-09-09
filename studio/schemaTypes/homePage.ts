import { defineArrayMember, defineField, defineType } from "sanity";

import { localizedString, localizedText } from "./localizedFields";

/**
 * The homepage's remaining hardcoded text (hero, module/course section
 * chrome, process steps, quote, closing CTA) -- previously only in
 * apps/web/app/preview/[locale]/copy.ts, never in Sanity, despite Danny's
 * standing "no hardcoding" rule (00-MASTER-PLAN.md §0). Flagged 2026-09-09
 * when he noticed the unrelated `page` document type ("Seite") existed in
 * the Studio but was never actually read by the homepage code -- that
 * type is being removed as dead content, replaced by this one, real,
 * single-card-per-site document (same locale-object pattern as module.ts).
 *
 * Singleton in practice (one real homepage), enforced only by convention
 * -- migrated content is created with a fixed document ID, but nothing in
 * the schema itself blocks creating a second one.
 */
const processStep = defineType({
  name: "processStep",
  title: "Schritt",
  type: "object",
  fields: [localizedString("verb", "Verb", { required: true }), localizedText("body", "Beschreibung", 2)],
  preview: {
    select: { title: "verb.de" },
  },
});

export const homePageType = defineType({
  name: "homePage",
  title: "Startseite",
  type: "document",
  fields: [
    localizedString("heroHeadline", "Hero: Headline", { required: true }),
    localizedText("heroSubtext", "Hero: Subtext", 2),
    localizedString("heroPrimaryCta", "Hero: Primär-CTA"),
    localizedString("heroSecondaryCta", "Hero: Sekundär-CTA"),
    localizedString("modulesHeading", "Modul-Sektion: Titel"),
    localizedString("coursesHeading", "Kurs-Sektion: Titel"),
    localizedText("coursesSubtext", "Kurs-Sektion: Subtext", 2),
    localizedString("coursesCta", "Kurs-Sektion: CTA"),
    localizedString("processHeading", "Ablauf: Titel"),
    defineField({
      name: "processSteps",
      title: "Ablauf: Schritte",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
      validation: (Rule) => Rule.min(1),
    }),
    localizedString("quoteLabel", "Zitat: Label"),
    localizedText("quoteBody", "Zitat: Text", 3),
    localizedString("quoteAttribution", "Zitat: Quelle"),
    localizedString("closingHeadline", "Schluss-CTA: Headline"),
    localizedString("closingCta", "Schluss-CTA: Button"),
  ],
  preview: {
    select: { title: "heroHeadline.de" },
  },
});

export const homePageSchemaTypes = [processStep, homePageType];
