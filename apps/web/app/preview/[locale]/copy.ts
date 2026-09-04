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
  nav: {
    cta: string;
    ctaShort: string;
    moduleLabel: string;
    aboutLabel: string;
    blogLabel: string;
    menuOpenLabel: string;
    menuCloseLabel: string;
  };
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
  footer: {
    tagline: string;
    contactLabel: string;
    linksHeading: string;
    legalHeading: string;
    impressumLabel: string;
    datenschutzLabel: string;
  };
}

export const HOME_COPY: Record<Locale, HomeCopy> = {
  de: {
    nav: {
      cta: "Kurse entdecken",
      ctaShort: "Kurse",
      moduleLabel: "Module",
      aboutLabel: "Über uns",
      blogLabel: "Blog",
      menuOpenLabel: "Menü öffnen",
      menuCloseLabel: "Menü schliessen",
    },
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
      legalHeading: "Rechtliches",
      impressumLabel: "Impressum",
      datenschutzLabel: "Datenschutz",
    },
  },
  en: {
    nav: {
      cta: "Explore courses",
      ctaShort: "Courses",
      moduleLabel: "Modules",
      aboutLabel: "About",
      blogLabel: "Blog",
      menuOpenLabel: "Open menu",
      menuCloseLabel: "Close menu",
    },
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
      legalHeading: "Legal",
      impressumLabel: "Imprint",
      datenschutzLabel: "Privacy",
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
  detailCoursesMixedHeading: string;
  detailCoursesMixedSubtext: string;
  otherModulesHeading: string;
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
    detailCoursesMixedHeading: "Kurse, die dich interessieren könnten",
    detailCoursesMixedSubtext:
      "Dieses Modul hat aktuell nur wenige eigene Termine — hier eine Auswahl aus allen Kursen.",
    otherModulesHeading: "Weitere Module",
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
    detailCoursesMixedHeading: "Courses you might like",
    detailCoursesMixedSubtext:
      "This module only has a few dates of its own right now — here's a selection from across all courses.",
    otherModulesHeading: "Other modules",
  },
};

/**
 * Content for /about. Grounded in the org's own mandate statement
 * (00-MASTER-PLAN.md §0: "Somos United ist eine gemeinnützige Plattform
 * (Schweiz) für Kurse/Module, die junge Menschen mental stärken") rather
 * than invented mission-statement fluff. Deliberately no fabricated
 * team bios/photos - `team.placeholder` is honest about that gap the
 * same way "[Illustration folgt]" is elsewhere, rather than inventing
 * fake names the way a fake testimonial would be.
 */
export interface AboutValue {
  icon: "shield" | "heart" | "users" | "target";
  title: string;
  body: string;
}

export interface AboutPageCopy {
  heading: string;
  subtext: string;
  storyHeading: string;
  story: string[];
  valuesHeading: string;
  values: AboutValue[];
  team: { heading: string; placeholder: string };
}

export const ABOUT_PAGE_COPY: Record<Locale, AboutPageCopy> = {
  de: {
    heading: "Wir sind Somos United.",
    subtext:
      "Eine gemeinnützige Plattform aus der Schweiz, die Kinder und Jugendliche mental stärkt — mit Kursen zu Medienkompetenz, Respekt, Gewaltprävention und mehr.",
    storyHeading: "Warum es uns gibt",
    story: [
      "Aufwachsen war noch nie einfach — aber die Herausforderungen von heute sind neu: ständige Erreichbarkeit, sozialer Druck online wie offline, wachsende psychische Belastung. Somos United wurde gegründet, um Kindern und Jugendlichen praktische Werkzeuge für genau diese Realität mitzugeben.",
      "Als gemeinnützige Organisation aus der Schweiz glauben wir, dass mentale Stärke lernbar ist — in kleinen Gruppen, mit echten Trainer:innen, nah am Alltag der Teilnehmenden. Deshalb bauen wir sechs Module, die genau dort ansetzen, wo es zählt.",
    ],
    valuesHeading: "Was uns wichtig ist",
    values: [
      {
        icon: "shield",
        title: "Sicherheit zuerst",
        body: "Besonders bei Daten von Kindern und Jugendlichen gilt: so wenig wie möglich, so geschützt wie möglich.",
      },
      {
        icon: "heart",
        title: "Für alle zugänglich",
        body: "Als gemeinnützige Organisation wollen wir, dass Herkunft oder Budget nie über die Teilnahme entscheiden.",
      },
      {
        icon: "users",
        title: "Gemeinschaft",
        body: "Stärke entsteht im Austausch — unsere Kurse laufen bewusst in kleinen Gruppen, nicht allein vor einem Bildschirm.",
      },
      {
        icon: "target",
        title: "Echte Wirkung",
        body: "Sechs Module, die an echten Herausforderungen ansetzen — nicht an abstrakten Lehrplänen.",
      },
    ],
    team: {
      heading: "Unser Team",
      placeholder: "Hier stellen wir bald die Menschen hinter Somos United vor.",
    },
  },
  en: {
    heading: "We are Somos United.",
    subtext:
      "A Swiss nonprofit platform that strengthens kids and teens mentally — with courses on media literacy, respect, violence prevention, and more.",
    storyHeading: "Why we exist",
    story: [
      "Growing up was never easy — but today's challenges are new: constant connectivity, social pressure online and offline, and rising mental strain. Somos United was founded to give kids and teens practical tools for exactly that reality.",
      "As a Swiss nonprofit, we believe mental strength can be learned — in small groups, with real trainers, close to participants' everyday lives. That's why we're building six modules that meet young people exactly where it counts.",
    ],
    valuesHeading: "What matters to us",
    values: [
      {
        icon: "shield",
        title: "Safety first",
        body: "Especially with children's data: as little as possible, as protected as possible.",
      },
      {
        icon: "heart",
        title: "Accessible to everyone",
        body: "As a nonprofit, we don't want background or budget to ever decide who gets to take part.",
      },
      {
        icon: "users",
        title: "Community",
        body: "Strength grows through connection — our courses run in small groups on purpose, not alone in front of a screen.",
      },
      {
        icon: "target",
        title: "Real impact",
        body: "Six modules built around real challenges — not abstract curricula.",
      },
    ],
    team: {
      heading: "Our team",
      placeholder: "We'll introduce the people behind Somos United here soon.",
    },
  },
};

/**
 * Blog copy. Topics are grounded in the org's real subject matter (the
 * 6 modules, its own pedagogy) rather than generic filler - same rule
 * as everywhere else in this file. `slug` is shared across locales
 * (same convention as ModuleTeaser.category), `publishedAt` is a plain
 * ISO date string for this placeholder pass rather than a real
 * Sanity `datetime`.
 */
export interface BlogPost {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  body: string[];
}

export interface BlogPageCopy {
  indexHeading: string;
  indexSubtext: string;
  readMore: string;
  backToBlog: string;
  otherPostsHeading: string;
  posts: BlogPost[];
}

export const BLOG_PAGE_COPY: Record<Locale, BlogPageCopy> = {
  de: {
    indexHeading: "Blog",
    indexSubtext: "Einblicke aus unserer Arbeit mit Familien, Trainer:innen und den Modulen.",
    readMore: "Weiterlesen",
    backToBlog: "Zurück zum Blog",
    otherPostsHeading: "Weitere Beiträge",
    posts: [
      {
        slug: "bildschirmzeit-tipps",
        title: "5 Tipps für einen entspannteren Umgang mit Bildschirmzeit",
        publishedAt: "2026-08-15",
        excerpt:
          "Bildschirmzeit muss kein Streitthema sein. Fünf praktische Ansätze, die Familien im Alltag wirklich helfen.",
        body: [
          "Bildschirmzeit ist in den meisten Familien irgendwann Thema — meist dann, wenn die Fronten schon verhärtet sind. Dabei hilft es oft schon, Regeln gemeinsam statt einseitig festzulegen: Wenn Jugendliche mitentscheiden dürfen, wann und wie lange, steigt die Akzeptanz spürbar.",
          "Genauso wichtig: bildschirmfreie Zeiten nicht als Strafe, sondern als gemeinsame Familienzeit rahmen. Ein fixer Zeitpunkt am Tag — etwa beim Essen — reicht oft schon, um den Umgang insgesamt entspannter zu machen.",
        ],
      },
      {
        slug: "warum-gruppenkurse",
        title: "Warum unsere Kurse bewusst in kleinen Gruppen stattfinden",
        publishedAt: "2026-08-01",
        excerpt:
          "Stärke entsteht im Austausch. Ein Blick hinter unsere pädagogische Entscheidung für kleine Gruppen statt Einzelcoaching.",
        body: [
          "Wir könnten unsere Module auch als Einzelcoaching anbieten. Bewusst tun wir das nicht: Jugendliche lernen von anderen Jugendlichen oft mehr als von einer erwachsenen Autoritätsperson allein — gerade bei Themen wie Respekt, Gewaltprävention oder Social Media, wo es um echte Alltagssituationen geht.",
          "In kleinen Gruppen von acht bis zwölf Teilnehmenden entsteht ein Rahmen, in dem sich alle trauen, auch unangenehme Themen anzusprechen — begleitet, aber nicht bevormundet von unseren Trainer:innen.",
        ],
      },
      {
        slug: "fruehe-anzeichen-psychische-belastung",
        title: "Psychische Belastung bei Jugendlichen: Worauf Eltern achten können",
        publishedAt: "2026-07-18",
        excerpt:
          "Es gibt keine perfekte Checkliste — aber Signale, die Eltern ernst nehmen sollten. Ein einordnender Überblick.",
        body: [
          "Rückzug, Reizbarkeit, verändertes Schlafverhalten — solche Veränderungen gehören bei Jugendlichen bis zu einem gewissen Grad zur normalen Entwicklung. Schwierig wird es einzuschätzen, wann aus einer Phase eine echte Belastung wird.",
          "Ein guter erster Schritt ist selten die grosse Konfrontation, sondern ein niedrigschwelliges, wiederholtes Gesprächsangebot — verbunden mit dem klaren Signal, dass Hilfe holen keine Schwäche ist. Genau hier setzt unser Modul Psychische Stärke an.",
        ],
      },
    ],
  },
  en: {
    indexHeading: "Blog",
    indexSubtext: "Insights from our work with families, trainers, and the modules.",
    readMore: "Read more",
    backToBlog: "Back to blog",
    otherPostsHeading: "More posts",
    posts: [
      {
        slug: "bildschirmzeit-tipps",
        title: "5 tips for a more relaxed approach to screen time",
        publishedAt: "2026-08-15",
        excerpt:
          "Screen time doesn't have to be a fight. Five practical approaches that actually help families day to day.",
        body: [
          "Screen time becomes an issue in most families eventually — usually once positions have already hardened. It often helps to set rules together instead of unilaterally: when teens get a say in when and how long, buy-in rises noticeably.",
          "Just as important: frame screen-free time as shared family time, not punishment. One fixed point in the day — at dinner, say — is often enough to make the whole dynamic more relaxed.",
        ],
      },
      {
        slug: "warum-gruppenkurse",
        title: "Why our courses deliberately run in small groups",
        publishedAt: "2026-08-01",
        excerpt:
          "Strength grows through connection. A look behind our pedagogical choice of small groups over 1:1 coaching.",
        body: [
          "We could offer our modules as 1:1 coaching. We deliberately don't: teens often learn more from other teens than from an adult authority figure alone — especially on topics like respect, violence prevention, or social media, where real everyday situations are the point.",
          "In small groups of eight to twelve, a space forms where everyone feels safe raising even uncomfortable topics — guided, but not lectured at, by our trainers.",
        ],
      },
      {
        slug: "fruehe-anzeichen-psychische-belastung",
        title: "Mental strain in teens: what parents can watch for",
        publishedAt: "2026-07-18",
        excerpt:
          "There's no perfect checklist — but there are signals worth taking seriously. A grounding overview.",
        body: [
          "Withdrawal, irritability, changed sleep patterns — in teens, changes like these fall within normal development up to a point. What's hard is judging when a phase turns into real strain.",
          "A good first step is rarely a big confrontation — it's a low-key, repeated offer to talk, paired with the clear signal that asking for help isn't weakness. That's exactly where our Mental Strength module starts.",
        ],
      },
    ],
  },
};

/**
 * Legal pages (Impressum/Datenschutz). Unlike every other placeholder
 * in this file, these are NOT invented content to be swapped for real
 * copy later - an Impressum exists specifically to identify who's
 * legally responsible for the site, so the identifying fields
 * (address, phone, Handelsregister/UID) are honestly left as pending
 * rather than fabricated. See addressPending/uidPending below - render
 * these as an explicit "folgt"/"pending" state, not filled with
 * invented details.
 *
 * The privacy policy body is grounded in this project's actual
 * documented data practices (03-DATA-MODEL.md's child-data
 * minimization decision, Supabase Zürich region, Bird/Resend as real
 * processors, SECURITY.md's EDÖB breach-notification note) - still a
 * draft that needs real legal review before being treated as final,
 * but not fabricated the way a fake testimonial would be.
 *
 * No Sanity schema exists yet for an Impressum type specifically
 * (legalDocument only covers "agb"/"datenschutz", see
 * studio/schemaTypes/legalDocument.ts) - a small schema follow-up,
 * not urgent while nothing here is Sanity-driven yet.
 */
export interface LegalPageCopy {
  impressum: {
    heading: string;
    addressPending: string;
    uidPending: string;
    responsiblePending: string;
    contactLabel: string;
    liabilityHeading: string;
    liabilityBody: string;
    linksHeading: string;
    linksBody: string;
  };
  datenschutz: {
    heading: string;
    intro: string;
    controllerHeading: string;
    dataHeading: string;
    dataItems: string[];
    purposeHeading: string;
    purposeBody: string;
    thirdPartiesHeading: string;
    thirdPartiesIntro: string;
    thirdParties: { name: string; role: string }[];
    rightsHeading: string;
    rightsBody: string;
    breachHeading: string;
    breachBody: string;
    contactLabel: string;
  };
}

export const LEGAL_PAGE_COPY: Record<Locale, LegalPageCopy> = {
  de: {
    impressum: {
      heading: "Impressum",
      addressPending: "Adresse folgt",
      uidPending: "Handelsregister-/UID-Nummer folgt, falls eingetragen",
      responsiblePending: "Verantwortliche Person folgt",
      contactLabel: "E-Mail",
      liabilityHeading: "Haftungsausschluss",
      liabilityBody:
        "Der Verein Somos United übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen auf dieser Website. Haftungsansprüche gegen den Verein Somos United wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen entstehen, sind ausgeschlossen.",
      linksHeading: "Links auf externe Websites",
      linksBody:
        "Diese Website kann Links zu externen Websites Dritter enthalten, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.",
    },
    datenschutz: {
      heading: "Datenschutzerklärung",
      intro:
        "Diese Erklärung beschreibt, welche Daten der Verein Somos United im Rahmen dieser Website und der Kursverwaltung bearbeitet.",
      controllerHeading: "Verantwortliche Stelle",
      dataHeading: "Welche Daten wir erheben",
      dataItems: [
        "Kontaktdaten der Eltern/Erziehungsberechtigten (Name, E-Mail, Telefonnummer)",
        "Angaben zu Kindern: Vorname und Geburtsjahr (bewusst kein vollständiges Geburtsdatum), Allergien/Gesundheitshinweise, sofern für die Kursteilnahme relevant",
        "Buchungs- und Zahlungsdaten",
        "Technische Daten beim Website-Besuch (z. B. über Analyse-Tools)",
      ],
      purposeHeading: "Zweck der Datenbearbeitung",
      purposeBody:
        "Die Daten werden ausschliesslich zur Organisation und Durchführung unserer Kurse sowie zur Kommunikation mit teilnehmenden Familien verwendet.",
      thirdPartiesHeading: "Eingesetzte Dienstleister",
      thirdPartiesIntro:
        "Für den Betrieb dieser Plattform setzen wir folgende Dienstleister ein, die in unserem Auftrag Daten bearbeiten:",
      thirdParties: [
        { name: "Supabase", role: "Datenbank-Hosting (Region Zürich)" },
        { name: "Bird", role: "SMS- und WhatsApp-Versand" },
        { name: "Resend", role: "E-Mail-Versand" },
      ],
      rightsHeading: "Ihre Rechte",
      rightsBody:
        "Sie haben nach dem Schweizer Datenschutzgesetz (DSG) das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten. Bei Fragen wenden Sie sich an uns.",
      breachHeading: "Meldung von Datenschutzverletzungen",
      breachBody:
        "Bei einem Vorfall mit hohem Risiko für betroffene Personen informieren wir gemäss den gesetzlichen Vorgaben den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB).",
      contactLabel: "E-Mail",
    },
  },
  en: {
    impressum: {
      heading: "Imprint",
      addressPending: "Address pending",
      uidPending: "Commercial registry/UID number pending, if registered",
      responsiblePending: "Responsible person pending",
      contactLabel: "Email",
      liabilityHeading: "Disclaimer",
      liabilityBody:
        "Verein Somos United makes no guarantee as to the accuracy, completeness, or timeliness of the information on this website. Liability claims against Verein Somos United arising from the use or non-use of the information published here are excluded.",
      linksHeading: "Links to external websites",
      linksBody:
        "This website may contain links to external third-party websites over whose content we have no influence. The respective provider is always responsible for the content of linked pages.",
    },
    datenschutz: {
      heading: "Privacy Policy",
      intro:
        "This policy describes what data Verein Somos United processes as part of this website and course administration.",
      controllerHeading: "Data controller",
      dataHeading: "What data we collect",
      dataItems: [
        "Contact details of parents/guardians (name, email, phone number)",
        "Information about children: first name and birth year (deliberately not a full date of birth), allergy/health notes where relevant to course participation",
        "Booking and payment data",
        "Technical data from website visits (e.g. via analytics tools)",
      ],
      purposeHeading: "Purpose of processing",
      purposeBody:
        "Data is used exclusively to organise and run our courses and to communicate with participating families.",
      thirdPartiesHeading: "Service providers we use",
      thirdPartiesIntro:
        "To run this platform, we use the following service providers, who process data on our behalf:",
      thirdParties: [
        { name: "Supabase", role: "Database hosting (Zurich region)" },
        { name: "Bird", role: "SMS and WhatsApp sending" },
        { name: "Resend", role: "Email sending" },
      ],
      rightsHeading: "Your rights",
      rightsBody:
        "Under the Swiss Data Protection Act (DSG), you have the right to access, correct, and delete your data. Contact us with any questions.",
      breachHeading: "Data breach notification",
      breachBody:
        "In the event of an incident posing a high risk to affected individuals, we will notify the Swiss Federal Data Protection and Information Commissioner (FDPIC/EDÖB) as required by law.",
      contactLabel: "Email",
    },
  },
};

export interface NotFoundCopy {
  heading: string;
  body: string;
  cta: string;
}

export const NOT_FOUND_COPY: Record<Locale, NotFoundCopy> = {
  de: {
    heading: "Seite nicht gefunden",
    body: "Diese Seite gibt es nicht oder nicht mehr.",
    cta: "Zur Startseite",
  },
  en: {
    heading: "Page not found",
    body: "This page doesn't exist or isn't there anymore.",
    cta: "Back to homepage",
  },
};
