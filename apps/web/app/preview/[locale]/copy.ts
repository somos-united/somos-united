import type { ModuleCategory } from "@somos/types";

import type { Locale } from "@/lib/locales";

import type { CourseCardData } from "./sections/CoursesTeaser";

/**
 * Placeholder copy for the Phase 1 design preview (/preview/[locale]).
 * Deliberately hardcoded here, not fetched from Sanity — this pass is
 * about nailing the layout/visual direction first. Once approved, this
 * moves into Sanity `page`/`module` documents (the fetch plumbing for
 * that already exists in lib/sanity.ts from the earlier pipeline proof).
 */

export interface ModuleTeaser {
  category: ModuleCategory;
  title: string;
  teaser: string;
}

export interface HomeCopy {
  nav: { cta: string };
  hero: { headline: string; subtext: string; primaryCta: string; secondaryCta: string };
  modulesHeading: string;
  modules: ModuleTeaser[];
  courses: {
    heading: string;
    subtext: string;
    cta: string;
    items: CourseCardData[];
  };
  process: { heading: string; steps: { verb: string; body: string }[] };
  quote: { label: string; body: string; attribution: string };
  closing: { headline: string; cta: string };
  footer: { tagline: string; contactLabel: string; linksHeading: string };
}

export const HOME_COPY: Record<Locale, HomeCopy> = {
  de: {
    nav: { cta: "Kurse entdecken" },
    hero: {
      headline: "Stark ins Leben.",
      subtext:
        "Kurse für Kinder und Jugendliche zu Medienkompetenz, Respekt und mentaler Stärke.",
      primaryCta: "Kurse entdecken",
      secondaryCta: "Kontakt aufnehmen",
    },
    modulesHeading: "Unsere Module",
    modules: [
      {
        category: "medienkompetenz",
        title: "Medienkompetenz",
        teaser: "Wie Kinder und Jugendliche Medien bewusst, sicher und selbstbestimmt nutzen.",
      },
      {
        category: "respekt",
        title: "Respekt",
        teaser: "Wertschätzend miteinander umgehen, Grenzen erkennen und respektieren.",
      },
      {
        category: "gewaltpraevention",
        title: "Gewaltprävention",
        teaser: "Konflikte erkennen und gewaltfrei lösen lernen.",
      },
      {
        category: "psychische_belastung",
        title: "Psychische Stärke",
        teaser: "Umgang mit Druck, Stress und schwierigen Gefühlen.",
      },
      {
        category: "orientierung",
        title: "Orientierung",
        teaser: "Den eigenen Weg finden, in Schule, Beruf und Leben.",
      },
      {
        category: "social_media",
        title: "Social Media",
        teaser: "Bewusster Umgang mit sozialen Netzwerken und ihren Folgen.",
      },
    ],
    courses: {
      heading: "Nächste Kurse",
      subtext: "Eine Auswahl kommender Termine, Preise nach Buchungszeitpunkt gestaffelt.",
      cta: "Jetzt buchen",
      items: [
        {
          category: "Medienkompetenz",
          title: "Medienkompetenz Basiskurs",
          dateLabel: "Wöchentlich, Zürich",
          price: "CHF 25.–",
          fomo: { kind: "scarcity", label: "Nur noch 3 Plätze" },
        },
        {
          category: "Gewaltprävention",
          title: "Gewaltprävention Einstieg",
          dateLabel: "Wöchentlich, Bern",
          price: "CHF 30.–",
          fomo: { kind: "urgency", label: "Preis gültig bis 15.10." },
        },
        {
          category: "Respekt",
          title: "Respekt im Alltag",
          dateLabel: "Wöchentlich, Basel",
          price: "CHF 35.–",
        },
      ],
    },
    process: {
      heading: "So läuft's ab",
      steps: [
        { verb: "Anmelden", body: "Kurs auswählen und Familie registrieren." },
        { verb: "Teilnehmen", body: "Vor Ort oder online, in kleinen Gruppen." },
        { verb: "Wachsen", body: "Neue Stärke für Schule, Freundschaften und Alltag." },
      ],
    },
    quote: {
      label: "Platzhalter",
      body: "So könnte hier eine kurze Rückmeldung aus einer Familie stehen, sobald echte Stimmen vorliegen.",
      attribution: "Elternteil, Zürich (Platzhalter)",
    },
    closing: {
      headline: "Bereit für den nächsten Schritt?",
      cta: "Kurse entdecken",
    },
    footer: {
      tagline: "Mentale Stärkung für junge Menschen.",
      contactLabel: "Schreib uns",
      linksHeading: "Verein",
    },
  },
  en: {
    nav: { cta: "Explore courses" },
    hero: {
      headline: "Strong into life.",
      subtext: "Courses for kids and teens on media literacy, respect, and mental strength.",
      primaryCta: "Explore courses",
      secondaryCta: "Get in touch",
    },
    modulesHeading: "Our modules",
    modules: [
      {
        category: "medienkompetenz",
        title: "Media literacy",
        teaser: "How kids and teens use media consciously, safely, and with confidence.",
      },
      {
        category: "respekt",
        title: "Respect",
        teaser: "Treating each other with respect, recognising and honouring boundaries.",
      },
      {
        category: "gewaltpraevention",
        title: "Violence prevention",
        teaser: "Recognising conflict and learning to resolve it without violence.",
      },
      {
        category: "psychische_belastung",
        title: "Mental strength",
        teaser: "Coping with pressure, stress, and difficult emotions.",
      },
      {
        category: "orientierung",
        title: "Orientation",
        teaser: "Finding your own path, in school, work, and life.",
      },
      {
        category: "social_media",
        title: "Social media",
        teaser: "A conscious approach to social networks and their effects.",
      },
    ],
    courses: {
      heading: "Upcoming courses",
      subtext: "A selection of upcoming dates, priced by how early you book.",
      cta: "Book now",
      items: [
        {
          category: "Media literacy",
          title: "Media Literacy Basics",
          dateLabel: "Weekly, Zurich",
          price: "CHF 25.-",
          fomo: { kind: "scarcity", label: "Only 3 spots left" },
        },
        {
          category: "Violence prevention",
          title: "Violence Prevention Intro",
          dateLabel: "Weekly, Bern",
          price: "CHF 30.-",
          fomo: { kind: "urgency", label: "Price valid until Oct 15" },
        },
        {
          category: "Respect",
          title: "Respect in Everyday Life",
          dateLabel: "Weekly, Basel",
          price: "CHF 35.-",
        },
      ],
    },
    process: {
      heading: "How it works",
      steps: [
        { verb: "Sign up", body: "Choose a course and register your family." },
        { verb: "Take part", body: "In person or online, in small groups." },
        { verb: "Grow", body: "New strength for school, friendships, and everyday life." },
      ],
    },
    quote: {
      label: "Placeholder",
      body: "A short piece of feedback from a family could sit here once real voices are gathered.",
      attribution: "Parent, Zurich (placeholder)",
    },
    closing: {
      headline: "Ready for the next step?",
      cta: "Explore courses",
    },
    footer: {
      tagline: "Mental strength for young people.",
      contactLabel: "Drop us a line",
      linksHeading: "Association",
    },
  },
};
