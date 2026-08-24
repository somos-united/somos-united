---
title: Somos United — Executive Summary
date: 2026-08-22
audience: Danny (Owner) + schneller Überblick für Team/Board
status: Alle 10 Kerndokumente freigegeben (22.8.) — offen nur noch die Lohnabzugssätze mit dem Treuhänder
purpose: Fasst den gesamten Planungsstand (alle Dokumente in md/) auf einer Seite zusammen — nicht-technisch. Details und Begründungen stehen im jeweils verlinkten Dokument.
---

# Somos United — Executive Summary

Somos United baut eine digitale Plattform für die gesamte Journey rund um die eigenen Kurse: Entdecken, Buchen, Teilnehmen, Nachbetreuen — für drei Nutzergruppen (Familien, Trainer, Admin-Team). Mobile-first, zweisprachig Deutsch/Englisch, in klar getrennte Phasen gegliedert. Diese Übersicht zeigt, was in jedem Planungsdokument steckt und wo wir stehen — für die technische Tiefe gilt jeweils das verlinkte Dokument.

## Auf einen Blick

| Dokument | Inhalt | Status |
|---|---|---|
| `00-MASTER-PLAN.md` | Vision, Architektur-Überblick, Phasen-Fahrplan | Freigegeben |
| `01-ARCHITECTURE.md` | Technisches Fundament (3 Apps, Login, Rechte) | Freigegeben |
| `SECURITY.md` | Sicherheitskonzept | Freigegeben |
| `02-DEPLOYMENT.md` | Konten, Staging/Live, Changelog | Freigegeben |
| `03-DATA-MODEL.md` | Vollständiges Datenschema | Freigegeben |
| `04-DESIGN-SYSTEM.md` | Farben, Schrift, Komponenten | Freigegeben |
| `05-MODULE-BOOKING.md` | Buchung, Preise, Abos | Freigegeben (inkl. Nachtrag Abo-Verlängerung) |
| `06-MODULE-TRAINER.md` | Trainer-App | Freigegeben |
| `07-MODULE-CRM.md` | CRM & Marketing | Freigegeben (inkl. Nachtrag E-Mail-Korrespondenz) |
| `08-MODULE-FINANCE.md` | Finance & Personaldossier | Wartet auf Freigabe (Struktur steht, Zahlen offen) |

## 1. Master-Plan — die Vision und der Fahrplan

Legt die Grundregeln für alles Weitere fest: Sicherheit zuerst (besonders bei Kinderdaten), mobile-first und zweisprachig von Anfang an, jedes Modul unabhängig einsetzbar, nichts geht live ohne vorherigen Test auf einer separaten Testumgebung. Neu verschärft (22.8.): **kein Hardcoding ist das oberste Gebot** — jeder Wert, der sich im Betrieb ändern kann (Preise, Rabatte, Lohnabzüge, Mieten, Adressen, Telefonnummern, AGB-Texte), lebt admin-editierbar in der Datenbank oder im CMS, nie fest im Code. Somos United besitzt und kontrolliert sämtliche Infrastruktur selbst — nichts läuft über private oder Agentur-Accounts. Der Bau ist in sechs Phasen gegliedert: Fundament, öffentliche Website, Buchung, Trainer-App, CRM, Finance, danach Feinschliff und weitere Sprachen. Dieses Dokument ist die oberste Instanz — bei Widersprüchen zwischen den Detaildokumenten gilt der Master-Plan.

## 2. Architektur — das technische Fundament

Drei getrennte Apps (öffentliche Website + Kundenkonto, internes Backoffice, Trainer-App) auf einer gemeinsamen Basis, damit ein Fehler in einer App nicht die anderen mitreisst. Ein zentrales Login-System für alle drei, mit fein abgestuften Berechtigungen im Backoffice (jemand kann z.B. Kundendaten sehen, aber keine Finanzzahlen). Legt auch fest, wie Notion als vereinfachtes Eingabe-Werkzeug für Redaktions-Inhalte an das eigentliche CMS angebunden wird.

## 3. Security — das Sicherheitskonzept

Bündelt alle sicherheitsrelevanten Entscheidungen an einem Ort: mehrstufiger Zugriffsschutz fürs Backoffice, Zwei-Faktor-Pflicht für Admin- und Trainer-Accounts, echte Schweizer Datenspeicherung für alle Personendaten (Kunden, Trainer, Finanzen). Regelt Aufbewahrungsfristen (10 Jahre für Buchhaltung, kürzer und löschbar für reine Kontaktdaten) und das Vorgehen im Ernstfall einer Datenpanne. Einzige bewusste Ausnahme von der sonst strikten Schweiz/EU-Linie: der SMS-Versand über einen US-Anbieter (günstiger, jederzeit austauschbar, siehe CRM-Kapitel).

## 4. Deployment & Konten — wer besitzt was

Regelt, welche Accounts neu und dediziert unter Somos United selbst entstehen (nicht privat, nicht über eine Agentur) — von Hosting über Datenbank bis Zahlungsanbieter, alle mit Zwei-Faktor-Pflicht und gesammelt in einem gemeinsamen, kostenlosen Passwort-Tresor für zwei Personen. Legt den Weg einer Änderung fest: erst auf einer internen Testumgebung geprüft, dann bewusst freigegeben, nie ein stiller automatischer Sprung auf die Live-Seite. Jeder Release wird in einem einfachen Protokoll festgehalten, damit jederzeit nachvollziehbar ist, was wann live ging.

## 5. Datenmodell — das Rückgrat aller Module

Das vollständige technische Schema: welche Information wo gespeichert wird und wer worauf zugreifen darf. Redaktionelle Inhalte (Kurstexte, Seiten) leben im CMS, alles Persönliche und Transaktionale (Buchungen, Zahlungen, Löhne) in der eigenen, Schweizer Datenbank — strikt getrennt. Wird laufend nachgezogen, sobald ein Fachkapitel (Buchung, CRM, Finance) neue Anforderungen bringt — das ist normal und in diesem Projekt so vorgesehen, kein Zeichen von Unfertigkeit.

## 6. Design-System — Look & Feel

Eigenständige, kräftige Markenfarben (Violett als Haupt-Ton, Koralle und Türkis als Akzente) auf ruhigem, pastellenem Hintergrund — energiegeladen, aber nicht kalt wie eine reine Fintech-Marke, passend zur Zielgruppe Familien/Jugendliche. Schrift ist Supreme (nicht die ursprünglich vorgeschlagene Alpino, die Danny verworfen hat). Bento-Grid-Layouts, grosszügiger Weissraum, dezente "Liquid-Glass"-Akzente. Gleiche Bausteine in allen drei Apps, nur Dichte und Wärme unterscheiden sich je nach Einsatzzweck (Marketing warm und verspielt, Backoffice ruhig und dicht, Trainer-App funktional und kontrastreich).

## 7. Modul Booking — Buchung, Preise, Abos

Das grösste und am weitesten ausgearbeitete Fachkapitel. Ein Abo ist an eine konkrete, wiederkehrende Kursserie gebunden und bucht automatisch die nächsten Termine. Preise sind keine fixen Werte, sondern eine admin-editierbare Staffel nach Airline-Prinzip (früh buchen = günstiger), ergänzt um automatisierte "Nur noch X Plätze frei"- und "Preis steigt bald"-Hinweise. Stornofristen sind gestaffelt und jederzeit anpassbar. Kunden verwalten Buchungen, Rechnungen und Stornos selbst in einem Kontobereich nach Vorbild von Galaxus.ch. Neu (Nachtrag vom 19.8.): Abos verlängern sich automatisch wie bei einem Streaming-Abo, mit einem vorherigen, frei konfigurierbaren Anreiz zum Upgrade (Rabatt oder z.B. ein Sachgeschenk) — inklusive einer Bank-ähnlichen Regel, wie mit Wochenenden bei automatisierten Versänden umgegangen wird. Dieses Kapitel ist vollständig abgeschlossen.

## 8. Modul Trainer-App

Zwei getrennte Zugriffsarten auf dieselbe App: der persönliche Login für Trainer (Einsatzplan, Teilnehmerliste ohne Kontaktdaten, geteilte Notizen, Stundenerfassung) und ein gesperrter Kiosk-Modus für Tablets direkt am Kursort, nur für den Check-in gedacht und jederzeit remote sperrbar bei Verlust. Check-in läuft per QR-Code mit manuellem Ersatzweg. Trainer sehen künftig ihre eigenen Abrechnungen selbst, sobald das Finance-Modul live ist.

## 9. Modul CRM & Marketing

Kundenliste und Zielgruppen-Segmente immer live berechnet, nie eine separate, veraltbare Liste. SMS-Versand über Twilio (günstiger als der ursprünglich genutzte Schweizer Anbieter, mit dem Datenresidenz-Kompromiss aus dem Security-Kapitel). Social-Media-Posting startet mit einem einfachen Planungskalender, die volle automatische Veröffentlichung folgt später. Google-Analytics- und Suchmaschinendaten werden vollständig ins eigene Dashboard eingebaut statt nur verlinkt. Die E-Mail-Korrespondenz mit Kunden ist künftig direkt im jeweiligen Kundenkonto im Backoffice sichtbar (ähnlich wie bei Mandrill/HubSpot) — technisch gelöst über die bereits genutzte Mail-Software, ohne zusätzliches Drittanbieter-Tool. Von dir bestätigt; offen ist nur noch die technische Detailfrage des genauen Subdomain-Namens.

## 10. Modul Finance & Personaldossier

Das Backoffice führt künftig auch ein eigenes kleines HR-Tool: Lohnansätze werden als Verlauf mit Gültigkeitsdatum geführt (nicht als fixer Wert), unterstützen sowohl Brutto- als auch Nettolohn-Vereinbarungen. Personaldokumente (z.B. Strafregisterauszug, Arbeitsvertrag) werden pro Trainer verwaltet, mit Erinnerungen bei Ablauf. Monatliche Lohnabrechnungen und der jährliche Lohnausweis werden automatisch erstellt und verschickt. Saalmieten hängen direkt am jeweiligen Kursort. Abzüge vom Lohn können sowohl Prozentsätze (z.B. AHV) als auch Fixbeträge (z.B. Arbeitskleidung) sein — beides ist jetzt im Datenmodell vorgesehen, admin-editierbar, nichts davon im Code fest verdrahtet. Der wichtigste noch offene Punkt: die tatsächlichen Abzugssätze/-beträge (Sozialversicherungen etc.) müssen mit dir bzw. eurem Treuhänder abgestimmt werden, bevor das Modul live gehen kann — das ist bewusst keine technische Entscheidung, die ich für euch treffe.

## Offene Punkte, die noch deinen Input brauchen

Alle zehn Kerndokumente sind jetzt formell freigegeben (zuletzt 22.8.: Architektur, Security, Deployment, Datenmodell). Es bleibt eine einzige echte Zahlen-Lücke: die exakten Lohnabzugssätze/-beträge fürs Finance-Modul — braucht kurze Rücksprache mit deinem Treuhänder vor Phase 5, ist aber reine Dateneingabe im Admin-App, keine Architektur-Frage mehr. Dazu zwei kleine, unkritische Ausführungsdetails: der genaue Subdomain-Name für den E-Mail-Empfang (`02-DEPLOYMENT.md`), sowie Lohnausweis-Versanddatum und Aufbewahrungsfrist Personaldossier (`08-MODULE-FINANCE.md`).

## Nächste Schritte

Der komplette Planungsfahrplan aus dem Master-Plan ist damit einmal vollständig durchlaufen. Sobald die Lohnabzugssätze mit dem Treuhänder abgestimmt sind, kann der eigentliche Bau (Phase 0) beginnen.
