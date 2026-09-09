import { defineArrayMember, defineField, defineType } from "sanity";

import { localizedString, localizedText } from "./localizedFields";

/**
 * The homepage's real content, as a flexible, orderable list of typed
 * sections -- not fixed named fields. Danny's direct reaction 2026-09-09
 * to the first version of this document (flat fields, no image field, no
 * way to add/remove/reorder a section, CTA text with no configurable
 * destination): "This seems to be structured really bad... Homepage
 * needs to be FLEXIBLE!!!! This is where people land > and we need to
 * guide them sideways to our topics" -- referencing re-athens.com's
 * repeated image+text+CTA "module" card pattern as the target shape.
 *
 * Each block type below maps to a real, already-built React section
 * component (Hero, ModuleBento, CoursesTeaser, ImageTextCta,
 * ProcessStrip, QuoteBlock, ClosingCta) -- editors choose which blocks
 * exist and in what order, but can't invent a layout the design system
 * doesn't have a component for. That's a deliberate middle ground: full
 * drag-and-drop freedom of arbitrary HTML would risk the page looking
 * broken in combinations the design was never built for.
 */

const ctaLinkTypes = [
  { title: "Modul-Übersicht", value: "modules" },
  { title: "Über uns", value: "about" },
  { title: "Blog", value: "blog" },
  { title: "Bestimmtes Modul", value: "module" },
  { title: "Eigene URL / E-Mail", value: "custom" },
];

// One shared CTA shape (label + where it goes) reused by every block type
// that has a button -- hero primary/secondary, the image+text card, the
// closing banner. A `moduleRef` link always resolves to that module's own
// real, current, per-language slug (module.ts) rather than a hand-typed
// path that could drift out of sync if a slug ever changes.
function ctaField(name: string, title: string, options: { required?: boolean } = {}) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      localizedString("label", "Text", { required: true }),
      defineField({
        name: "linkType",
        title: "Ziel",
        type: "string",
        options: { list: ctaLinkTypes, layout: "radio" },
        initialValue: "modules",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "moduleRef",
        title: "Modul",
        type: "reference",
        to: [{ type: "module" }],
        hidden: ({ parent }) => (parent as { linkType?: string } | undefined)?.linkType !== "module",
      }),
      defineField({
        name: "customUrl",
        title: "URL, Pfad oder E-Mail",
        type: "string",
        description:
          'Ein Pfad wie "/about", eine volle URL ("https://...") oder eine Adresse ("mailto:...").',
        hidden: ({ parent }) => (parent as { linkType?: string } | undefined)?.linkType !== "custom",
      }),
    ],
    validation: (Rule) => (options.required ? Rule.required() : Rule),
  });
}

const processStep = defineType({
  name: "processStep",
  title: "Schritt",
  type: "object",
  fields: [localizedString("verb", "Verb", { required: true }), localizedText("body", "Beschreibung", 2)],
  preview: {
    select: { title: "verb.de" },
  },
});

const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  fields: [
    localizedString("headline", "Headline", { required: true }),
    localizedText("subtext", "Subtext", 2),
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
      description: "Optional -- ohne Bild bleibt der bestehende Farbverlauf-Platzhalter sichtbar.",
    }),
    ctaField("primaryCta", "Primär-CTA", { required: true }),
    ctaField("secondaryCta", "Sekundär-CTA"),
  ],
  preview: {
    select: { title: "headline.de", media: "image" },
  },
});

const moduleGridBlock = defineType({
  name: "moduleGridBlock",
  title: "Modul-Grid",
  type: "object",
  fields: [localizedString("heading", "Titel")],
  preview: {
    select: { title: "heading.de" },
    prepare: ({ title }) => ({ title: title || "Modul-Grid", subtitle: "6 Module aus Sanity" }),
  },
});

const courseGridBlock = defineType({
  name: "courseGridBlock",
  title: "Kurs-Grid",
  type: "object",
  fields: [
    localizedString("heading", "Titel"),
    localizedText("subtext", "Subtext", 2),
    // Not a section-level ctaField: each course card links to its own
    // real booking page (Supabase course_series.module_ref, see
    // getPublishedCourses) -- this is just the repeated button label
    // shown on every card, e.g. "Jetzt buchen".
    localizedString("ctaLabel", "Button-Text auf Kurskarten", { required: true }),
  ],
  preview: {
    select: { title: "heading.de" },
    prepare: ({ title }) => ({ title: title || "Kurs-Grid", subtitle: "Kurse aus Supabase" }),
  },
});

// The re-athens.com-style repeatable card: one image, a short pitch, one
// CTA -- exactly the block type that was missing before and that Danny
// asked for directly ("MODULES and FLEXIBLE... guide them sideways to
// our topics"). Add as many as needed, in any order, mixed with the
// other block types.
const imageTextCtaBlock = defineType({
  name: "imageTextCtaBlock",
  title: "Bild + Text + CTA",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
    }),
    localizedString("heading", "Titel", { required: true }),
    localizedText("body", "Text", 3),
    ctaField("cta", "CTA", { required: true }),
  ],
  preview: {
    select: { title: "heading.de", media: "image" },
  },
});

const processStepsBlock = defineType({
  name: "processStepsBlock",
  title: "Ablauf",
  type: "object",
  fields: [
    localizedString("heading", "Titel"),
    defineField({
      name: "steps",
      title: "Schritte",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "heading.de" },
    prepare: ({ title }) => ({ title: title || "Ablauf" }),
  },
});

const quoteBlock = defineType({
  name: "quoteBlock",
  title: "Zitat",
  type: "object",
  fields: [
    localizedString("label", "Label"),
    localizedText("body", "Text", 3),
    localizedString("attribution", "Quelle"),
  ],
  preview: {
    select: { title: "body.de" },
  },
});

const ctaBannerBlock = defineType({
  name: "ctaBannerBlock",
  title: "Schluss-CTA",
  type: "object",
  fields: [localizedString("headline", "Headline", { required: true }), ctaField("cta", "CTA", { required: true })],
  preview: {
    select: { title: "headline.de" },
  },
});

export const homePageType = defineType({
  name: "homePage",
  title: "Startseite",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      title: "Sektionen",
      type: "array",
      of: [
        defineArrayMember({ type: "heroBlock" }),
        defineArrayMember({ type: "moduleGridBlock" }),
        defineArrayMember({ type: "courseGridBlock" }),
        defineArrayMember({ type: "imageTextCtaBlock" }),
        defineArrayMember({ type: "processStepsBlock" }),
        defineArrayMember({ type: "quoteBlock" }),
        defineArrayMember({ type: "ctaBannerBlock" }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Startseite" }),
  },
});

export const homePageSchemaTypes = [
  processStep,
  heroBlock,
  moduleGridBlock,
  courseGridBlock,
  imageTextCtaBlock,
  processStepsBlock,
  quoteBlock,
  ctaBannerBlock,
  homePageType,
];
