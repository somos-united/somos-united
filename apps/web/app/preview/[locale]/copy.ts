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
  ageRange: string;
  description: string[];
}

export interface HomeCopy {
  nav: { cta: string; moduleLabel: string };
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
    nav: { cta: "Kurse entdecken", moduleLabel: "Module" },
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
        ageRange: "10–14 Jahre",
        description: [
          "Kinder und Jugendliche wachsen mit Smartphones, Apps und ständiger Erreichbarkeit auf. Dieses Modul vermittelt, wie sie Inhalte kritisch einordnen, Fake News erkennen und ihre eigene Mediennutzung reflektieren.",
          "In praktischen Gruppenübungen tauschen sich die Teilnehmenden über eigene Erfahrungen aus und entwickeln gemeinsam Strategien für einen sicheren, selbstbestimmten Umgang mit digitalen Medien.",
        ],
      },
      {
        category: "respekt",
        title: "Respekt",
        teaser: "Wertschätzend miteinander umgehen, Grenzen erkennen und respektieren.",
        ageRange: "8–12 Jahre",
        description: [
          "Respektvoller Umgang beginnt im Alltag: beim Zuhören, beim Aushandeln von Konflikten, beim Anerkennen unterschiedlicher Perspektiven. Dieses Modul stärkt die Fähigkeit, eigene und fremde Grenzen wahrzunehmen.",
          "Rollenspiele und Gruppendiskussionen helfen den Teilnehmenden, Vorurteile zu hinterfragen und wertschätzende Kommunikation im Schulalltag und darüber hinaus zu üben.",
        ],
      },
      {
        category: "gewaltpraevention",
        title: "Gewaltprävention",
        teaser: "Konflikte erkennen und gewaltfrei lösen lernen.",
        ageRange: "10–15 Jahre",
        description: [
          "Konflikte gehören zum Aufwachsen dazu — entscheidend ist, wie man mit ihnen umgeht. Dieses Modul zeigt, wie Spannungen frühzeitig erkannt und deeskaliert werden, bevor sie eskalieren.",
          "Ausgebildete Trainer:innen begleiten die Gruppe durch alltagsnahe Rollenspiele, in denen Teilnehmende üben, eigene Grenzen zu setzen und gewaltfrei zu reagieren.",
        ],
      },
      {
        category: "psychische_belastung",
        title: "Psychische Stärke",
        teaser: "Umgang mit Druck, Stress und schwierigen Gefühlen.",
        ageRange: "12–16 Jahre",
        description: [
          "Schule, soziale Erwartungen, der eigene Anspruch — psychischer Druck zeigt sich bei Jugendlichen oft anders als bei Erwachsenen. Dieses Modul schafft einen geschützten Rahmen, um über Stress und schwierige Gefühle zu sprechen.",
          "Im Zentrum stehen einfache Entspannungstechniken, das Verstehen eigener Emotionen und der Austausch in einer unterstützenden Gruppe — bewusst ohne Leistungsdruck oder Verkaufsdruck.",
        ],
      },
      {
        category: "orientierung",
        title: "Orientierung",
        teaser: "Den eigenen Weg finden, in Schule, Beruf und Leben.",
        ageRange: "14–17 Jahre",
        description: [
          "Welche Stärken habe ich, welche Berufsfelder passen zu mir, wie treffe ich eine Entscheidung, die sich richtig anfühlt? Dieses Modul begleitet Jugendliche in einer Phase, in der viele Weichen gestellt werden.",
          "Durch Selbstreflexion, Erkundung verschiedener Berufsfelder und begleitete Übungen gewinnen die Teilnehmenden mehr Sicherheit für ihre nächsten Schritte.",
        ],
      },
      {
        category: "social_media",
        title: "Social Media",
        teaser: "Bewusster Umgang mit sozialen Netzwerken und ihren Folgen.",
        ageRange: "11–15 Jahre",
        description: [
          "Soziale Netzwerke prägen den Alltag von Jugendlichen wie kaum ein anderes Medium. Dieses Modul vermittelt einen bewussteren Umgang mit Apps, Privatsphäre-Einstellungen und dem eigenen digitalen Fussabdruck.",
          "Ein besonderer Schwerpunkt liegt auf dem Erkennen von Cybermobbing und dem Finden einer gesunden Bildschirmzeit — praxisnah und ohne erhobenen Zeigefinger.",
        ],
      },
    ],
    courses: {
      heading: "Nächste Kurse",
      subtext: "Eine Auswahl kommender Termine, Preise nach Buchungszeitpunkt gestaffelt.",
      cta: "Jetzt buchen",
      items: [
        {
          category: "Medienkompetenz",
          moduleCategory: "medienkompetenz",
          title: "Medienkompetenz Basiskurs",
          dateLabel: "Wöchentlich, Zürich",
          price: "CHF 25.–",
          advantages: [
            "Sicher online unterwegs",
            "Fake News erkennen",
            "Eigene Mediennutzung reflektieren",
            "Praktische Gruppenübungen",
            "Austausch mit Gleichaltrigen",
          ],
          fomo: { kind: "scarcity", label: "Nur noch 3 Plätze" },
        },
        {
          category: "Gewaltprävention",
          moduleCategory: "gewaltpraevention",
          title: "Gewaltprävention Einstieg",
          dateLabel: "Wöchentlich, Bern",
          price: "CHF 30.–",
          advantages: [
            "Konflikte früh erkennen",
            "Gewaltfrei reagieren lernen",
            "Eigene Grenzen setzen",
            "Rollenspiele aus dem Alltag",
            "Begleitung durch Trainer:innen",
          ],
          fomo: { kind: "urgency", label: "Preis gültig bis 15.10." },
        },
        {
          category: "Respekt",
          moduleCategory: "respekt",
          title: "Respekt im Alltag",
          dateLabel: "Wöchentlich, Basel",
          price: "CHF 35.–",
          advantages: [
            "Wertschätzend kommunizieren",
            "Perspektiven wechseln",
            "Vorurteile hinterfragen",
            "Teamgeist stärken",
          ],
        },
        {
          category: "Psychische Stärke",
          moduleCategory: "psychische_belastung",
          title: "Psychische Stärke im Alltag",
          dateLabel: "Wöchentlich, Luzern",
          price: "CHF 25.–",
          advantages: [
            "Stress besser bewältigen",
            "Eigene Gefühle verstehen",
            "Entspannungstechniken üben",
            "Unterstützung durch die Gruppe",
            "Mentale Widerstandskraft aufbauen",
          ],
          // Bewusst ohne FOMO-Pill (05-MODULE-BOOKING.md §6:
          // "manche Kurse ... sollen keine Verknappungs-Botschaft
          // zeigen") - Verknappungsdruck passt nicht zu einem
          // Kurs über psychische Belastung.
        },
        {
          category: "Orientierung",
          moduleCategory: "orientierung",
          title: "Orientierung finden",
          dateLabel: "Wöchentlich, St. Gallen",
          price: "CHF 30.–",
          advantages: [
            "Eigene Stärken entdecken",
            "Ziele für die Zukunft setzen",
            "Berufsfelder kennenlernen",
            "Entscheidungen sicherer treffen",
          ],
          fomo: { kind: "scarcity", label: "Nur noch 5 Plätze" },
        },
        {
          category: "Social Media",
          moduleCategory: "social_media",
          title: "Social Media bewusst nutzen",
          dateLabel: "Wöchentlich, Genf",
          price: "CHF 25.–",
          advantages: [
            "Bewusster Umgang mit Apps",
            "Privatsphäre schützen",
            "Cybermobbing erkennen",
            "Gesunde Bildschirmzeit finden",
            "Digitale Spuren verstehen",
          ],
          fomo: { kind: "urgency", label: "Preis gültig bis 30.9." },
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
    nav: { cta: "Explore courses", moduleLabel: "Modules" },
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
        ageRange: "10–14 years",
        description: [
          "Kids and teens grow up with smartphones, apps, and constant connectivity. This module teaches them to critically assess content, spot fake news, and reflect on their own media habits.",
          "In hands-on group exercises, participants share their own experiences and work together on strategies for a safer, more self-determined approach to digital media.",
        ],
      },
      {
        category: "respekt",
        title: "Respect",
        teaser: "Treating each other with respect, recognising and honouring boundaries.",
        ageRange: "8–12 years",
        description: [
          "Respectful behaviour starts in everyday life: listening, working through conflict, recognising different perspectives. This module builds the ability to notice both your own boundaries and other people's.",
          "Role play and group discussions help participants question assumptions and practice respectful communication at school and beyond.",
        ],
      },
      {
        category: "gewaltpraevention",
        title: "Violence prevention",
        teaser: "Recognising conflict and learning to resolve it without violence.",
        ageRange: "10–15 years",
        description: [
          "Conflict is part of growing up — what matters is how you handle it. This module shows how to recognise rising tension early and de-escalate before it turns into something worse.",
          "Trained facilitators guide the group through realistic role-play scenarios where participants practice setting boundaries and responding without violence.",
        ],
      },
      {
        category: "psychische_belastung",
        title: "Mental strength",
        teaser: "Coping with pressure, stress, and difficult emotions.",
        ageRange: "12–16 years",
        description: [
          "School, social expectations, self-imposed pressure — mental strain shows up differently in teens than in adults. This module creates a safe space to talk about stress and difficult emotions.",
          "The focus is on simple relaxation techniques, understanding your own feelings, and support from a group — deliberately without performance pressure or a sales pitch.",
        ],
      },
      {
        category: "orientierung",
        title: "Orientation",
        teaser: "Finding your own path, in school, work, and life.",
        ageRange: "14–17 years",
        description: [
          "What are my strengths, which career fields fit me, how do I make a decision that actually feels right? This module supports teens through a stage where a lot of paths are being set.",
          "Through self-reflection, exploring different career fields, and guided exercises, participants gain more confidence for their next steps.",
        ],
      },
      {
        category: "social_media",
        title: "Social media",
        teaser: "A conscious approach to social networks and their effects.",
        ageRange: "11–15 years",
        description: [
          "Social networks shape teenage life like few other media. This module teaches a more conscious approach to apps, privacy settings, and your own digital footprint.",
          "A particular focus is on recognising cyberbullying and finding healthy screen time — practical, and without wagging a finger.",
        ],
      },
    ],
    courses: {
      heading: "Upcoming courses",
      subtext: "A selection of upcoming dates, priced by how early you book.",
      cta: "Book now",
      items: [
        {
          category: "Media literacy",
          moduleCategory: "medienkompetenz",
          title: "Media Literacy Basics",
          dateLabel: "Weekly, Zurich",
          price: "CHF 25.-",
          advantages: [
            "Navigate online safely",
            "Spot fake news",
            "Reflect on media habits",
            "Hands-on group exercises",
            "Connect with peers",
          ],
          fomo: { kind: "scarcity", label: "Only 3 spots left" },
        },
        {
          category: "Violence prevention",
          moduleCategory: "gewaltpraevention",
          title: "Violence Prevention Intro",
          dateLabel: "Weekly, Bern",
          price: "CHF 30.-",
          advantages: [
            "Recognise conflict early",
            "Respond without violence",
            "Set personal boundaries",
            "Real-life role play",
            "Guided by trainers",
          ],
          fomo: { kind: "urgency", label: "Price valid until Oct 15" },
        },
        {
          category: "Respect",
          moduleCategory: "respekt",
          title: "Respect in Everyday Life",
          dateLabel: "Weekly, Basel",
          price: "CHF 35.-",
          advantages: [
            "Communicate with respect",
            "Practice perspective-taking",
            "Question assumptions",
            "Build team spirit",
          ],
        },
        {
          category: "Mental strength",
          moduleCategory: "psychische_belastung",
          title: "Mental Strength in Everyday Life",
          dateLabel: "Weekly, Lucerne",
          price: "CHF 25.-",
          advantages: [
            "Cope with stress better",
            "Understand your own feelings",
            "Practice relaxation techniques",
            "Support from the group",
            "Build mental resilience",
          ],
        },
        {
          category: "Orientation",
          moduleCategory: "orientierung",
          title: "Finding Direction",
          dateLabel: "Weekly, St. Gallen",
          price: "CHF 30.-",
          advantages: [
            "Discover your own strengths",
            "Set goals for the future",
            "Explore career paths",
            "Make decisions with confidence",
          ],
          fomo: { kind: "scarcity", label: "Only 5 spots left" },
        },
        {
          category: "Social media",
          moduleCategory: "social_media",
          title: "Using Social Media Consciously",
          dateLabel: "Weekly, Geneva",
          price: "CHF 25.-",
          advantages: [
            "Use apps more mindfully",
            "Protect your privacy",
            "Recognise cyberbullying",
            "Find healthy screen time",
            "Understand your digital footprint",
          ],
          fomo: { kind: "urgency", label: "Price valid until Sep 30" },
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

/**
 * Chrome text for the dedicated module pages (/module index +
 * /module/[category] detail) - kept separate from HomeCopy since the
 * per-module content itself (title/teaser/ageRange/description) already
 * lives in HOME_COPY[locale].modules and is shared between the homepage
 * teaser and these pages, one source of truth per module.
 */
export interface ModulePageCopy {
  indexHeading: string;
  indexSubtext: string;
  backToModules: string;
  ageLabel: string;
  detailCoursesHeading: (moduleTitle: string) => string;
  detailCoursesSubtext: string;
  detailCoursesEmpty: string;
}

export const MODULE_PAGE_COPY: Record<Locale, ModulePageCopy> = {
  de: {
    indexHeading: "Unsere Module",
    indexSubtext:
      "Sechs Themenfelder, in denen Kinder und Jugendliche gestärkt werden — jedes mit eigenen Kursen und passendem Altersbereich.",
    backToModules: "Alle Module",
    ageLabel: "Altersspanne",
    detailCoursesHeading: (moduleTitle) => `Kurse zu ${moduleTitle}`,
    detailCoursesSubtext: "Eine Auswahl kommender Termine zu diesem Modul.",
    detailCoursesEmpty: "Aktuell sind keine Termine zu diesem Modul geplant.",
  },
  en: {
    indexHeading: "Our modules",
    indexSubtext:
      "Six topic areas where kids and teens are strengthened — each with its own courses and matching age range.",
    backToModules: "All modules",
    ageLabel: "Age range",
    detailCoursesHeading: (moduleTitle) => `${moduleTitle} courses`,
    detailCoursesSubtext: "A selection of upcoming dates for this module.",
    detailCoursesEmpty: "No dates are currently scheduled for this module.",
  },
};
