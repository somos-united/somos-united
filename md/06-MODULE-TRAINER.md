---
title: Somos United — Modul Trainer-App
version: 0.1
status: Freigegeben durch Danny am 2026-08-18
date: 2026-08-18
audience: Claude Code (Umsetzung)
depends_on: 00-MASTER-PLAN.md Abschnitt 3 (Phase 3), 01-ARCHITECTURE.md Abschnitte 3-4, 03-DATA-MODEL.md Abschnitte 2.3-2.4, SECURITY.md
---

# Modul Trainer-App

Vertieft Phase 3. Zwei komplett getrennte Zugriffsarten auf dieselbe App (`apps/trainer`): persönlicher Login (für Trainer/Mitarbeiter) und Kiosk-Modus (für Tablets an Kursorten) — technische Basis bereits in `01-ARCHITECTURE.md` Abschnitt 4.3, hier die fachliche Ausgestaltung.

## 1. Persönlicher Trainer-Login — Übersicht

Nach dem Login (Magic Link + TOTP-2FA-Pflicht, siehe `SECURITY.md`) sieht ein Trainer:

1. **Einsatzplan** — alle eigenen `course_instances` (über `trainer_assignments`), chronologisch, mit Ort, Zeit, Modul, Teilnehmerzahl.
2. **Teilnehmerliste pro Termin** — Vorname + `allergies_notes`/`general_notes` der gebuchten Kinder. **Nie** Nachname, Kontaktdaten, Familienname — reines Need-to-know (bereits in `03-DATA-MODEL.md` Abschnitt 3 als RLS-Regel festgelegt, hier nur die UI-Konsequenz).
3. **Notizfunktion** — pro Kind oder pro Kurstermin (`trainer_notes`), sichtbar für **alle** Trainer (geteiltes Wissen, z.B. "reagiert empfindlich auf laute Musik"), aber nie für Clients. Bearbeitbar nur durch die verfassende Person, lesbar für alle.
4. **QR-Check-in** — Abschnitt 3.
5. **Stundenerfassung** — nur für `pay_model = hourly`-Trainer, Abschnitt 4.
6. **Abrechnungen** — in Phase 3 nur als UI-Platzhalter ("Deine Abrechnungen erscheinen hier, sobald sie freigegeben sind"), echte Daten/Berechnung erst mit Phase 5 (`08-MODULE-FINANCE.md`). Kein Scope-Vorgriff an dieser Stelle.

## 2. Kiosk-Modus — Übersicht

Eigener Account-Typ (kein persönlicher Login, an einen Ort statt an eine Person gebunden) — technische Basis bereits in `01-ARCHITECTURE.md` Abschnitt 4.3 festgelegt. Fachlich zeigt ein Kiosk-Tablet ausschliesslich:

- Die **heutigen** `course_instances` am eigenen `location_id` (gefiltert auf `start_at` = heute).
- Pro Termin die Teilnehmerliste mit Check-in-Status (Abschnitt 3) — Vorname, keine weiteren Personendaten.
- Sonst nichts — kein Einsatzplan anderer Trainer, keine Notizen, keine Abrechnungen, keine Navigation aus dem Check-in-Screen heraus.

Widerruf: `kiosk_devices.revoked_at` — sobald gesetzt, blockiert das Tablet beim nächsten Heartbeat (Vorschlag: Ping alle 60 Sekunden) sofort mit einer neutralen "Gerät gesperrt, bitte Admin kontaktieren"-Meldung. Kein Warten auf einen Session-Timeout.

## 3. QR-Check-in

- Jede `bookings`-Zeile bekommt bei Bestätigung einen zufälligen `checkin_token` (nicht die rohe `booking.id` — verhindert Erraten/Durchzählen fremder Buchungen). Die Bestätigungsmail (siehe `05-MODULE-BOOKING.md` Abschnitt 10) enthält einen QR-Code, der diesen Token codiert.
- **Am Kursort:** Trainer (persönliches Gerät) oder Kiosk-Tablet scannt den Code über die Kamera. System findet die passende `bookings`-Zeile über `checkin_token`, prüft, dass `course_instance_id` zum aktuellen/heutigen Termin passt, setzt `checked_in_at = jetzt` und `checked_in_by = eigene profile_id`.
- **Fallback ohne QR-Code** (nicht jede Familie hat den Code griffbereit, gerade bei jüngeren Kindern): manueller Check-in per Antippen des Namens in der Teilnehmerliste — funktional identisch, nur ohne Scan-Schritt.
- Doppel-Scan (Kind wird versehentlich zweimal gescannt) ist unkritisch: zweiter Scan verändert `checked_in_at` nicht erneut, keine Fehlermeldung nötig, nur eine kurze Bestätigung "bereits eingecheckt".
- **24h-Erinnerung an den Trainer** (aus dem Master-Plan-Stichwort "QR-Check-in inkl. 24h-Reminder"): 24 Stunden vor `course_instances.start_at` bekommt jeder zugewiesene Trainer (nicht die Kiosk-Geräte) eine kurze E-Mail mit Ort, Zeit, Teilnehmerzahl — reine Gedächtnisstütze, kein Handlungsbedarf. Getrackt über `trainer_assignments.reminder_sent_at`, ausgelöst über dieselbe tägliche Supabase Edge Function wie die Familien-Reminder (`05-MODULE-BOOKING.md` Abschnitt 10).

## 4. Stundenerfassung (nur `pay_model = hourly`)

- Nach einem Kurstermin kann der zugewiesene Trainer die effektiv geleisteten Stunden erfassen: `timesheets` (`trainer_id`, `course_instance_id`, `date`, `hours`).
- Status zunächst unbestätigt (`approved_by`/`approved_at` = `null`) — Freigabe passiert im Finance-Teil der Admin-App (Phase 5, `08-MODULE-FINANCE.md`), hier nur die Erfassungsseite.
- Trainer mit `pay_model = monthly` oder `per_course` sehen diesen Erfassungsschritt gar nicht — für sie ist die Vergütung nicht stundenbasiert (kein leeres/verwirrendes Formular anzeigen).

## 5. Sicherheits-Grundregeln (Verweis, nichts Neues)

Bereits in `SECURITY.md`/`01-ARCHITECTURE.md` festgelegt, hier nur zur Vollständigkeit referenziert: TOTP-2FA-Pflicht für persönliche Trainer-Logins (Kiosk ausgenommen, dafür physisch abgesichert + remote widerrufbar), RLS-Policy `trainer_notes` lesbar für alle Trainer/schreibbar nur vom Autor, Audit-Log bei Zugriff auf Kontaktdaten (betrifft Trainer nicht direkt, da sie ohnehin nie Kontaktdaten sehen).

## 6. Edge Cases

- **Trainer wird kurzfristig krank, Ersatz nötig:** Umbesetzung von `trainer_assignments` läuft über die Admin-App (CRM-Bereich, `07-MODULE-CRM.md`), nicht über die Trainer-App selbst — ein Trainer kann sich nicht selbst von einem Termin abmelden, das bleibt eine Admin-Entscheidung (Vertretung muss organisiert sein, bevor der Termin "frei" wird).
- **Kind erscheint ohne QR-Code und ist nicht in der Teilnehmerliste** (z.B. Buchung nicht durchgegangen): kein Check-in möglich, Trainer verweist an den Client-Konto-Bereich bzw. Support — keine Zahlungs-/Buchungslogik läuft über die Trainer- oder Kiosk-App.
- **Zwei Kiosk-Tablets am selben Ort** (z.B. Ersatzgerät): technisch unproblematisch, beide sind eigene Zeilen in `kiosk_devices`, beide können denselben Termin einchecken (Check-in ist idempotent, siehe Abschnitt 3).
- **Trainer sieht eigene Abrechnung, obwohl Phase 5 noch nicht live ist:** UI zeigt konsequent den Platzhalter-Zustand, kein Zugriff auf `payroll_statements`, solange diese Tabelle noch leer/nicht befüllt ist.

## 7. Offene Punkte — bitte kurz gegenlesen

1. ~~24h-Reminder-Kanal~~ — **angenommen wie vorgeschlagen** (Danny mit "next" weitergemacht): E-Mail für Phase 3, Push später ohne Schema-Änderung nachrüstbar.
2. ~~Heartbeat-Intervall Kiosk-Widerruf~~ — **angenommen: 60 Sekunden** (Abschnitt 2).

Kurz Bescheid geben, falls einer der beiden Werte doch anders sein soll — beides sind reine Konfigurationswerte, keine strukturellen Entscheidungen.

---
*Nächster Schritt: `07-MODULE-CRM.md`.*
