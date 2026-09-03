---
title: Somos United — Master Plan
version: 0.4 (freigegeben)
status: Freigegeben durch Danny am 2026-08-17 — Nachtrag Leitplanke 1 (No-Hardcoding als oberstes Gebot) am 2026-08-22 — Basis für 01-ARCHITECTURE.md
date: 2026-08-22
audience: Claude Code (Umsetzung) + Danny (Owner/Consultant-Review)
---

# Somos United — Master Plan

Dieses Dokument ist die oberste Ebene der Planung. Es legt Architektur, Modul-Reihenfolge und Design-Richtung grob fest. Details folgen in eigenen Dokumenten (siehe Abschnitt 8). Claude Code hält sich bei jeder Implementierung an dieses Dokument; bei Widersprüchen zwischen Folgedokumenten gilt dieses Master-Dokument.

## 0. Auftrag & Leitplanken

Somos United ist eine gemeinnützige Plattform (Schweiz) für Kurse/Module, die junge Menschen mental stärken. Wir bauen eine digitale Plattform, die die gesamte Journey abbildet: Entdecken → Buchen → Teilnehmen → Nachbetreuen, für drei Nutzergruppen (Familien/Clients, Trainer/Mitarbeiter, Admin/Backoffice).

Leitplanken für jede Entscheidung:
1. **Security First** — insbesondere bei Kinderdaten, Gesundheitsangaben (Allergien), Kontaktdaten. **Kein Hardcoding — oberstes Gebot (verschärft 2026-08-22 auf Dannys ausdrücklichen Wunsch):** nicht nur redaktionelle Inhalte, sondern jeder Wert, der sich im Geschäftsbetrieb ändern kann, lebt admin-editierbar in der Datenbank oder im CMS, nie im Code. Beispiele: Preise/Rabatte, Stornoregeln, Lohnabzugssätze/-arten (egal ob Prozentsatz oder Fixbetrag), AGB-Texte, Mieten, Adressen, Telefonnummern. Betrifft jedes Modul, gilt bei jeder Implementierungsentscheidung.
2. **Mobile First, zweisprachig DE/EN, weitere Sprachen geplant** (siehe Abschnitt 9).
3. **Modular** — jedes Modul muss unabhängig buchbar, erweiterbar und (später) abschaltbar sein, ohne andere Module zu brechen.
4. **Staging vor Production** — nichts geht live, das nicht auf Staging getestet wurde. Jeder Schritt wird versioniert dokumentiert (siehe CHANGELOG-Konvention, Abschnitt 7).
5. **Nicht zu technisch gegenüber Danny** — Claude Code dokumentiert Fortschritt in klarer Sprache, kein unnötiges Jargon in Statusupdates an ihn.
6. **Volle Eigenständigkeit (neu, bestätigt 2026-08-17)** — für dieses Projekt wird alles neu angelegt: jede App, jede API, jedes Tool bekommt einen eigenen, dedizierten Account unter Somos United selbst — nicht unter privaten Accounts oder Agentur-Accounts von Dritten. Ziel: Somos United besitzt und kontrolliert die gesamte Infrastruktur vollständig und unabhängig, jederzeit übertragbar. Konkrete Umsetzung (wer legt was mit welcher E-Mail an) folgt in `02-DEPLOYMENT.md`.

## 1. Architektur — Überblick

**Monorepo (Turborepo)**, ein Repo für alles, geteilte Packages für Konsistenz.

```
somos-united/
├── apps/
│   ├── web/            # Public Frontend (Next.js) — Marketing + Client-Bereich
│   ├── admin/           # Gemeinsames Backoffice: CRM, Finance, User-DB, MA-Erfassung.
│   │                     # Eine App, aber granulare Berechtigungen pro Bereich/Feature
│   │                     # (nicht nur pro Rolle) — z.B. eine Person sieht CRM, aber nicht Finance.
│   └── trainer/         # Eigene App für Trainer/Mitarbeiter (bestätigt).
│                         # Zwei Modi:
│                         #   1) Persönlicher Login: Einsatzplan, Notizen, QR-Scanner,
│                         #      eigene Abrechnungen einsehen/als PDF laden (Self-Service, wie SAP).
│                         #   2) Kiosk-Modus: locked-down Ansicht für ein Tablet am Kursort,
│                         #      nur Check-in-Funktion, kein Zugriff auf andere Trainer-Daten.
├── packages/
│   ├── ui/               # Geteilte Komponenten-Library (Design-System-Implementierung)
│   ├── config/           # ESLint/TS/Tailwind-Config, geteilt über alle Apps
│   ├── lib/              # Geteilte Business-Logik (Buchungslogik, Abo-Berechnung, Rollen/Rechte)
│   └── types/            # Geteilte TypeScript-Typen (Sanity- & Supabase-Schemas)
├── studio/               # Sanity Studio (CMS für Content: Module/Kurse, Seiten, Übersetzungen)
├── supabase/             # DB-Migrationen, Auth-Config, Edge Functions
├── docs/                 # Betriebs-/Prozessdokumentation (Deployment, Runbooks)
├── md/                   # Planungsdokumente für Claude Code (dieses Dokument + Folgedokumente)
├── memory/               # Lauf-Protokoll: was wurde wann gebaut/entschieden (Versionshistorie)
├── assets/               # Fonts, Icons, Brand-Assets
├── moods/                # Moodboards/Benchmarks (Referenz, kein Code)
├── scripts/              # Automatisierung (Seed-Daten, Migrations-Helper, Deploy-Skripte)
└── social/               # Vorlagen/Skripte für Social-Posting-Integration (Instagram/LinkedIn)
```

**Kernentscheidung:** CMS und Datenbank sind strikt getrennt.
- **Sanity** = redaktioneller Content (Kurstexte, Seiten, Übersetzungen, Medien, Modul-Beschreibungen, Onboarding-Tooltip-Texte). Nicht-technische Redakteure pflegen hier. **Plan: Free** zum Start — Limits (Anzahl nicht-Admin-Nutzer, API-CDN-Requests) reichen für den Launch; bei mehr Redakteuren/Traffic später auf Growth upgraden.
- **Supabase** = transaktionale/operative Daten (User, Buchungen, Zahlungen, Check-ins, Stundenerfassung, Trainer-Notizen, Lohn-/Abrechnungsdaten). Alles, was Auth, Rechte oder Persönlichkeitsschutz betrifft.

**Hosting/Infra:**
- **Vercel** — Frontend-Hosting, Preview-Deployments pro PR = automatisches Staging.
- **Supabase** — Postgres + Auth (Magic Link) + Storage + Edge Functions. **Region: Zürich** — echte Schweizer Datenresidenz für Kunden-, Trainer- und Finanzdaten.
- **Sanity** — gehostetes CMS, eigenes Studio-Deployment. Content liegt aktuell fix in Belgien (EU), keine Regionwahl möglich (auch nicht auf höheren Plänen) — unkritisch, da dort nur redaktioneller Content liegt, keine Personendaten.
- **Notion** (neu) — Erfassungs-Tool für redaktionellen Content ausserhalb von Sanity Studio, gedacht für Team-Mitglieder, denen Notion vertrauter ist. Fliesst per Webhook automatisiert als Draft nach Sanity (nie direkt live), Details in `01-ARCHITECTURE.md` Abschnitt 8.
- **Cloudflare** — DNS, WAF/Security-Layer vor Vercel, zusätzlich Access (Zero-Trust-Gate) vor Admin- und Trainer-App.
- **Resend** — transaktionale E-Mails (Reminder, Bestätigungen, Magic Link Fallback).
- **Bird** (ehem. MessageBird; Entscheidung 2026-09-03, ersetzt Twilio dauerhaft — siehe `07-MODULE-CRM.md` Abschnitt 3) — SMS- und WhatsApp-Versand (Buchungs-Reminder mit Opt-in, CRM-Alerts). Pay-as-you-go, keine monatliche Gebühr, echte EU-Datenhaltung (NL/Belgien/UK/Deutschland). **Twilio ist blacklisted, nie wieder in Betracht ziehen.**
- **Stripe** — Zahlungen/Abos.
- **CYON** — nur MX/E-Mail-Hosting (bestehend, bleibt unangetastet).
- **GitHub** — Repo + CI/CD-Trigger; **Snyk/Socket** — automatisierte Dependency-Security-Checks.
- **Google Search Console + Analytics** — Daten fliessen ins Admin-Dashboard (Abschnitt 3, CRM).

**Environments:** `preview` (jeder PR), `staging` (main-Branch, Passwort-geschützt, Spiegel von Production), `production` (Live, nur via Release-Freigabe). Genaue Deployment-Regeln folgen in `md/02-DEPLOYMENT.md`.

## 2. Datenmodell — Grundzüge

Vier Kern-Entitäten, auf denen alles aufbaut (Details in `md/03-DATA-MODEL.md`):

1. **Modul/Kurs** (Sanity: Beschreibung, Zielgruppe, Sprache, Preis-Referenz; Supabase: Verfügbarkeit, Buchungsstatus)
2. **Kurstermin** (verknüpft Modul × Veranstaltungsort × Trainer × Datum/Zeit)
3. **Veranstaltungsort** (Adresse, Karten-Koordinaten für MapLibre/OpenStreetMap, Kapazität)
4. **Teilnahme/Buchung** (Client × Kurstermin, Status, Abo-Zugehörigkeit, Zahlungsstatus, Check-in-Zeitpunkt)

Rollenmodell (Supabase Row-Level-Security-gesteuert): `admin`, `superuser`, `trainer`, `client`, plus feingranulare Berechtigungen innerhalb `admin` (z.B. `admin:crm`, `admin:finance`, `admin:users`) für das gemeinsame Backoffice. Need-to-know: Trainer sehen nie Kontaktdaten, nur berechtigte Admins sehen Finanzdaten.

## 3. Modul-Roadmap (Phasen)

Reihenfolge nach Abhängigkeit — jede Phase muss auf Staging stehen und von Danny abgenommen sein, bevor die nächste beginnt.

**Phase 0 — Fundament** (keine sichtbaren Features, aber Voraussetzung für alles)
Repo-Setup, Turborepo-Config, Sanity-Studio-Grundschema (i18n-fähig von Anfang an, siehe Abschnitt 9), Supabase-Projekt + Auth, Design-System-Basis (Tokens, Grundkomponenten), CI/CD Staging↔Production.

**Phase 1 — Public Frontend + CMS**
Marketing-Website (Startseite, Über uns, Module-Übersicht, Blog/News), zweisprachig DE/EN, aus Sanity gesteuert. Noch keine Buchung, kein Login.

**Phase 2 — Buchung & Client-Bereich**
Veranstaltungsorte + Kurstermine, Buchungsflow (Stripe Checkout), Client-Konto mit Magic Login, Kontaktdaten & Allergien-Erfassung, ICS-Kalender, Bestätigungs-/Reminder-Mails (10 Tage / 1 Tag vorher via Resend).

**Phase 3 — Trainer-App**
Eigene App (`apps/trainer`). Trainer-Login (Einsatzplan, Teilnehmerliste ohne Kontaktdaten, Notizfunktion), QR-Check-in inkl. 24h-Reminder, Kiosk-Modus für Tablets an Kursorten. Abrechnungs-Ansicht als UI-Platzhalter vorbereiten (echte Daten erst mit Phase 5).

**Phase 4 — Admin-App: CRM & Marketing**
Gemeinsames Backoffice (`apps/admin`) wird aufgesetzt, Start mit CRM-Bereich: Kundenliste (segmentierbar), Kundenportfolio/History, SMS-Alerts (Opt-in), Newsletter, Social-Posting (Insta/LinkedIn), Dashboard mit Ampelsystem-KPIs (inkl. Google Analytics/Search Console), Mitarbeiter-Erfassung (Basis für Trainer-Accounts).

**Phase 5 — Admin-App: Finance**
Gleiche App, Finance-Bereich (eigene Berechtigung): Zahlungsabgleich, Lohnabrechnung (Trainer: Stunden-/Monats-/Kursbasis inkl. Sozialleistungen/Ferienanspruch CH), Spesen, Saalmieten, Rechnungen/Quittungen, Rückvergütungen, CSV-Export, Kostenstellen/P&L. **Aktiviert damit auch die echte Abrechnungs-Ansicht in der Trainer-App aus Phase 3.**

**Phase 6 — Skalierung & Härtung**
Security-Audit (Snyk/Socket-Review), Performance, weitere Landessprache(n) mit echtem Content (siehe Abschnitt 9), Abo-Upgrades/Add-ons verfeinern, Onboarding-Tooltips für alle Module nachziehen.

## 4. Design-Richtung (Kurzfassung)

Volles Design-System folgt in `md/04-DESIGN-SYSTEM.md` — hier nur die Leitplanken, damit Phase-0-Komponenten schon konsistent gebaut werden:

- **Quelle:** `md/DESIGN-stripe.md` (Token-Analyse, Stripe-inspiriert) + Moodboard in `moods/` (u.a. Stripe Checkout, StellarGrowth als Kids-Kurs-Benchmark) sind der Ausgangspunkt — nicht 1:1 kopieren, sondern als Stimmungslage für Somos United adaptieren (wärmer/jugendlicher als reines Fintech-Blau, da Zielgruppe Familien/Jugendliche).
- **Look:** Bento-Grid-Layouts, ruhige Flächen, Pill-Buttons, grosszügiger Weissraum, dezente Microanimationen (kein Overdesign).
- **Referenzen:** Apple (Klarheit), Nike (Energie/Bewegtbild), Stripe (Typografie-Präzision, Tokens), Airbnb (Vertrauen, Foto-geführt), iOS-27 "Liquid"-Ästhetik als Interaktions-Vibe (Tiefe, weiche Blur-Layer) — nicht wörtlich kopieren, sondern als Qualitätsmassstab.
- **Ein zentrales CSS/Token-System** (`packages/ui`) ist Pflicht — keine Insel-Styles pro App/Modul. Gilt für alle drei Apps (web, admin, trainer inkl. Kiosk-Modus).

## 5. CRM & Backoffice — Prinzipien

- Eine Admin-App, granulare Berechtigungen pro Bereich (CRM/Finance/User-DB), nicht nur pro Rolle — eine Person kann z.B. CRM-Rechte ohne Finance-Rechte haben.
- Alles hinter Login, kein Screenshot/Download-Export ausser explizit erlaubtem CSV-Export (Finance/CRM-Listen) bzw. dem Abrechnungs-PDF-Download für Trainer.
- KPI-Dashboards: Ampelsystem (Grün/Gelb/Rot) statt reiner Zahlenwüste — Danny ist Laie, Dashboards müssen auf einen Blick verständlich sein.
- Mitarbeiter/Trainer werden im Admin-App erfasst; ihr Zugriff (persönlicher Login vs. Kiosk-Gerät an einer Location) wird von dort gesteuert.

## 6. Trainer-App & Compliance (Schweiz)

Lohnmodelle (Stunden/Monat/pauschal pro Kurs) müssen Schweizer Arbeitsrecht abbilden (Sozialleistungen, Ferienanspruch bei Stundenlohn). Trainer sehen und laden ihre Abrechnungen selbst (PDF-Self-Service, analog SAP) — die Berechnung passiert im Finance-Teil der Admin-App (Phase 5), die Trainer-App zeigt nur die fertigen, freigegebenen Abrechnungen an. Das ist keine reine Software-Frage — vor Umsetzung von Phase 5 braucht es eine kurze Abstimmung mit Danny zu den genauen Lohnansätzen.

## 7. Versionierung & Changelog-Konvention

Jeder Deploy-Schritt (Staging und Production) wird in `memory/CHANGELOG.md` protokolliert: Datum, Version, was wurde gebaut/geändert, wer hat abgenommen. Format wird in `md/02-DEPLOYMENT.md` festgelegt. Ziel: Danny kann jederzeit nachvollziehen, was auf Staging vs. Live läuft, ohne selbst Code zu lesen.

## 8. Dokumenten-Fahrplan (was als Nächstes entsteht)

`SECURITY.md` liegt quer zu allen Phasen und gilt ab sofort (nicht Teil der nummerierten Reihenfolge) — siehe eigenes Dokument.

Reihenfolge der nummerierten Folgedokumente in `md/`:

1. `01-ARCHITECTURE.md` — technische Vertiefung von Abschnitt 1 (Repo-Konventionen, Env-Variablen, Auth-Flow im Detail, Berechtigungsmodell admin-App, Kiosk-Modus-Technik)
2. `02-DEPLOYMENT.md` — Staging/Production-Regeln, CI/CD-Pipeline, Changelog-Format
3. `03-DATA-MODEL.md` — vollständiges Schema (Sanity-Schemas + Supabase-Tabellen + RLS-Policies)
4. `04-DESIGN-SYSTEM.md` — Farben, Typografie, Komponenten-Bibliothek, Bento-Layout-Regeln (aufbauend auf DESIGN-stripe.md)
5. `05-MODULE-BOOKING.md` — Buchungs-/Abo-Logik im Detail (Phase 2)
6. `06-MODULE-TRAINER.md` — Trainer-App im Detail: persönlicher Login + Kiosk-Modus (Phase 3)
7. `07-MODULE-CRM.md` — CRM/Marketing im Detail (Phase 4)
8. `08-MODULE-FINANCE.md` — Finance/Payroll im Detail inkl. Trainer-Self-Service-Anbindung (Phase 5)

Jedes Dokument wird erst geschrieben, kurz von Danny gegengelesen, dann erst beginnt Claude Code mit der Umsetzung der jeweiligen Phase.

## 9. Entscheidungen

**Entschieden (2026-08-17):**
- Trainer-Bereich: eigene App (`apps/trainer`), inkl. Kiosk-Modus für Vor-Ort-Check-in an Kursorten.
- Admin-Bereich: eine gemeinsame Backoffice-App (`apps/admin`) für CRM, Finance, User-DB — Sichtbarkeit granular pro Berechtigung gesteuert, nicht pro Rolle.
- Mitarbeiter/Trainer werden im Admin-App erfasst.
- Trainer sehen & laden ihre Abrechnungen selbst in der Trainer-App (Self-Service, PDF-Download, "wie SAP") — Daten stammen aus dem Finance-Teil der Admin-App (Phase 5); UI-Vorbereitung schon in Phase 3.
- Sanity: Free-Plan zum Start.
- Mehrsprachigkeit über DE/EN hinaus: **ja**, bestätigt. Timing aktuell **offen** (kein konkreter Standort ausserhalb der Deutschschweiz in Sicht) — Sanity wird darum von Anfang an technisch mehrsprachig-fähig gebaut (beliebig viele Locales ergänzbar ohne Schema-Umbau), ein fixes Rollout-Datum für FR/IT legen wir erst fest, wenn es konkret wird.

**Nachtrag (2026-08-22):** Danny hat das No-Hardcoding-Prinzip aus Leitplanke 1 (Abschnitt 0) ausdrücklich verschärft und zum obersten Gebot für das gesamte Projekt erklärt — Auslöser war die Payroll-Abzugsstruktur (`08-MODULE-FINANCE.md`), das Prinzip gilt aber durchgehend für alle Module. Kein inhaltlicher Widerspruch zur bisherigen Linie, nur eine Klarstellung: gemeint waren schon immer alle veränderlichen Geschäftswerte, nicht nur redaktionelle Inhalte.

Damit sind alle Grundsatzfragen für Phase 0/1 geklärt. Dieses Dokument gilt als freigegeben.

---
*Nächster Schritt: `01-ARCHITECTURE.md` wird erstellt.*
