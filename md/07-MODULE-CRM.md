---
title: Somos United — Modul CRM & Marketing (Admin-App)
version: 0.3
status: Freigegeben durch Danny am 2026-08-18 (Kern) und 2026-08-22 (Nachtrag E-Mail-Korrespondenz, Abschnitt 4) — offen bleibt nur die technische Detailfrage Subdomain-Name/DNS (Abschnitt 12)
date: 2026-08-22
audience: Claude Code (Umsetzung)
depends_on: 00-MASTER-PLAN.md Abschnitte 3 (Phase 4) & 5, 01-ARCHITECTURE.md Abschnitt 4, 03-DATA-MODEL.md Abschnitt 2.6, 05-MODULE-BOOKING.md, 06-MODULE-TRAINER.md, SECURITY.md Abschnitt 7
---

# Modul CRM & Marketing

Vertieft `00-MASTER-PLAN.md` Phase 4 — der erste inhaltliche Bereich von `apps/admin`. Betrifft die Supabase-Tabellen `families`, `bookings`, `sms_log`, `newsletter_log`, `crm_notes`, `crm_saved_filters`, `email_messages`, `trainers`, `kiosk_devices`.

## 0. Änderungshistorie (Nachtrag Danny, 2026-08-19)

Danny wollte wissen, wie E-Mail-Verlauf mit Kunden am besten gelöst wird (Mandrill/HubSpot-Style, im Konto zugeordnet) und was mit den übrigen Mails (info@/tech@ etc.) passiert. Antwort dazu neu in Abschnitt 4. Alle bisherigen Abschnitte ab 4 verschieben sich um eins nach hinten (neue Nummerierung 5–12).

## 1. Kundenliste & Segmente

- Standard-Liste: alle `families`, mit Kernspalten (Name, letzte Aktivität `last_login_at`, Anzahl Kinder, aktives Abo ja/nein, Opt-in-Status SMS/Newsletter).
- **Segmente sind Live-Abfragen**, keine separat gepflegte Mitgliederliste (siehe `03-DATA-MODEL.md` Abschnitt 2.6) — ein Segment ist immer aktuell, nie veraltet.
- Beispiel-Segmente (illustrativ, im Admin-App frei kombinierbar): "Aktive Abonnenten", "Inaktiv seit 6 Monaten" (`last_login_at` älter als X), "Neu diese Woche", "Auf Warteliste", "SMS-Opt-in ohne aktuelle Buchung".
- Häufig gebrauchte Filterkombinationen lassen sich als **`crm_saved_filters`** speichern (Name + Kriterien) — spart wiederholtes Neu-Zusammenklicken, ohne dass eine Mitgliederliste synchron gehalten werden müsste.

## 2. Kundenportfolio (pro Familie)

Eine Detailansicht pro Familie bündelt:
- Kontaktdaten, Kinder (aus `children`).
- Vollständige Buchungs-History (`bookings`, alle Status) und Abo-History (`subscriptions`).
- Rechnungen (`invoices`, `related_type = family`) — dieselbe Datenquelle wie im Client-Konto (`05-MODULE-BOOKING.md` Abschnitt 4), nur mit Admin-Sicht statt Selbstbedienung.
- **`crm_notes`** (neu) — interne Admin-Notizen zur Kundenbeziehung, z.B. "hat sich über Warteliste beschwert", "spendet regelmässig". Bewusst getrennt von `trainer_notes`, die kind-/kursbezogen sind und primär für Trainer gedacht sind — unterschiedliche Zielgruppe, unterschiedlicher Zweck.
- Jeder Aufruf einer Kundendetailansicht ist ein Kontaktdaten-Zugriff → `audit_log`-Eintrag (bereits in `SECURITY.md` Abschnitt 1 zugesagt).

## 3. Kommunikation: SMS-Alerts & Newsletter

- **Newsletter:** Versand über Resend an `families` mit `newsletter_opt_in = true`, gefiltert nach Segment (Abschnitt 1). Jeder Versand ein `newsletter_log`-Eintrag.
- **SMS-Alerts:** Versand an `families` mit `sms_opt_in = true`. Jeder Versand ein `sms_log`-Eintrag.
- **SMS/WhatsApp-Provider: Twilio** (Entscheidung 2026-08-18, kurz zwischenzeitlich auf SMSup.ch umgestellt am 2026-08-31, dann am selben Tag zurück auf Twilio — siehe unten). Kurzer Vergleich, den Danny angefragt hatte:

  | | SMSup.ch | Twilio |
  |---|---|---|
  | Preis/SMS (CH) | CHF 0.087–0.114 je nach Volumen | ≈ CHF 0.07 (USD 0.0769) |
  | WhatsApp-Unterstützung | Nein, nur SMS | Ja |
  | Absender-Konfiguration | — | Alphanumerische Absender-ID ("SOMOSUnited") kostenlos, keine Rufnummer nötig |
  | Herkunft/Billing | Schweizer Anbieter, CHF | US-Anbieter, USD-Abrechnung (EU/Irland-Datenverarbeitungsoption vorhanden) |
  | Abrechnungsmodell | Guthaben/Kredite, kein Abo | Pay-as-you-go-Guthaben, kein Abo |
  | Bei Somos United bereits im Einsatz? | Ja, für `cms.neonstudio.ch` | Nein, neu |

  Twilio ist günstiger, unterstützt zusätzlich WhatsApp (von Danny gewünscht, SMSup kann das nicht), und beide Anbieter arbeiten mit Guthaben statt Abo — **keine monatliche Gebühr bei Twilio**, nur Kosten pro tatsächlich versendeter Nachricht. Kurzzeitig auf SMSup zurückgestuft, weil die Twilio-Absender-ID-Registrierung ein "Upgrade" vom Trial-Konto verlangt — das wurde fälschlich als kostenpflichtiges Abo missverstanden; tatsächlich ist es nur die Umstellung von Trial-Limits auf ein finanziertes Pay-as-you-go-Konto, keine wiederkehrende Gebühr. Danny hat das nach Klärung bestätigt: zurück zu Twilio. **Ein Hinweis dazu, weil es zur bisherigen Linie des Projekts passt:** Somos United legt sonst durchgehend Wert auf echte Schweizer Datenresidenz (deshalb z.B. Supabase Region Zürich für alle Personendaten). SMS-/WhatsApp-Inhalte sind zwar flüchtig (keine dauerhafte Speicherung von Personendaten bei Twilio, nur Telefonnummer + kurzer Text während des Versands), aber es ist trotzdem ein US-Anbieter statt eines Schweizer. Wenn dir die Konsistenz später wichtiger wird als WhatsApp-Unterstützung, ist SMSup jederzeit ohne Aufwand austauschbar (nur fürs SMS-Alerts, kein WhatsApp-Ersatz) — die Anbindung ist bewusst so gebaut (`sms_log` kennt keine Provider-Details), dass ein Wechsel später keine Datenmodell-Änderung braucht.
  - Env-Variablen-Block `TWILIO_*` ergänzt in `01-ARCHITECTURE.md` Abschnitt 5.
  - **WhatsApp braucht zusätzlich:** ein Meta Business Manager + verifiziertes WhatsApp Business Account (WABA) für "Verein Somos United", separat vom Twilio-Konto-Funding. Eigener Schritt, noch offen.

## 4. E-Mail-Korrespondenz (Kunden-Postfach im Konto) — Nachtrag Danny, 2026-08-19

Danny möchte die E-Mail-Korrespondenz mit einer Familie direkt im jeweiligen Konto sehen, "Mandrill/HubSpot-Style". Lösung: **kein zusätzliches Drittanbieter-Tool**, sondern eine Erweiterung von **Resend** — bereits im Stack für Bestätigungs-/Reminder-Mails, kann inzwischen auch E-Mails empfangen ("Resend Inbound"). Vorteil: keine Zusatzkosten, keine weitere Insel-Lösung, Daten bleiben in unserer eigenen Supabase-DB (Zürich) statt bei einem weiteren Anbieter.

**Ablauf:**

1. Eine eigene Subdomain (Vorschlag `mail.somosunited.ch`) nimmt eingehende Mails entgegen — das bestehende CYON-Postfach (info@/tech@) bleibt komplett unberührt, keine Kollision. DNS-Einrichtung wird in `02-DEPLOYMENT.md` nachgetragen.
2. Eingehende Mails treffen als Webhook bei einer Supabase Edge Function ein, Signatur wird geprüft (gleiches Prinzip wie beim Notion-Webhook, `SECURITY.md` Abschnitt 7), dann gespeichert in einer neuen Tabelle `email_messages`.
3. **Zuordnung zur Familie:** primär per Absenderadresse gegen `families.email` abgeglichen. Unbekannte Absender landen in einem "nicht zugeordnet"-Posteingang im Admin — Admin ordnet manuell zu, kein automatisches Rätselraten bei mehrdeutigen Fällen.
4. **Ausgehende Mails:** Admin kann direkt aus dem Kundenportfolio (Abschnitt 2) heraus frei antworten (nicht nur automatisierte Trigger wie Buchungsbestätigung/Reminder) — läuft ebenfalls über Resend, wird in derselben Tabelle als `direction = outbound` protokolliert.
5. **Anzeige im Admin:** neuer Reiter "E-Mail-Verlauf" im Kundenportfolio — zeigt `email_messages` chronologisch, ergänzt um die bereits automatisch versendeten Mails aus `reminders_log`/`newsletter_log` (reine Anzeige-Kombination, keine doppelte Datenhaltung) — ein durchgehender Thread wie bei Mandrill/HubSpot.

**Datenmodell (neu, in `03-DATA-MODEL.md` nachgezogen):** neue Tabelle `email_messages` — `id`, `family_id` (nullable, solange nicht zugeordnet), `direction` (`inbound`|`outbound`), `from_address`, `to_address`, `subject`, `body_text`, `body_html`, `resend_id`, `attachments_json`, `created_by` (nullable — Admin bei manuellem Versand, leer bei automatisierten Trigger-Mails), `sent_at`/`received_at`.

**RLS:** wie `crm_notes` — nur mit Permission `crm` sichtbar, jeder Zugriff ein `audit_log`-Eintrag (Kontaktdaten-Zugriff, wie in `SECURITY.md` Abschnitt 1 zugesagt).

**Bewusst nicht Teil dieser Lösung — "alle anderen Mails":** allgemeine Postfächer (info@/tech@, Lieferanten, interne Kommunikation) gehören nicht ins Kunden-CRM. Entscheidung mit Danny (2026-08-19): **vorerst beim bestehenden CYON-Postfach bleiben**, kein neues Tool. Bei wachsendem Mail-Volumen später mit einem günstigen Shared-Inbox-Tool (z.B. Missive, ca. CHF 14/Person/Monat) nachrüstbar — eigenständige, spätere Entscheidung, kein Teil der Plattform-Architektur.

## 5. Social-Posting (Instagram/LinkedIn)

**Entschieden (2026-08-18):**

- **Jetzt (V1, Phase 4):** ein Content-Kalender im Admin-App — Posts mit Text/Bild/Datum planen, Status (`Entwurf`/`Bereit`/`Veröffentlicht`), aber **kein automatischer Versand**. Am geplanten Tag bekommt die verantwortliche Person eine Erinnerung und postet manuell (Copy-Paste-Hilfe: Text + Bild bereits vorbereitet). Kein OAuth, keine App-Freigabe bei Meta/LinkedIn nötig — schnell umsetzbar.
- **BACKLOG, Beta-Phase:** volle API-Anbindung mit automatischem Direkt-Veröffentlichen — **für Meta (Instagram)** gesichert, **für LinkedIn "wenn möglich"** (Dannys Formulierung — LinkedIns Publishing-API ist restriktiver vergeben, daher kein Versprechen, nur der Versuch). Instagram verlangt einen Business-Account + Meta-App-Review-Prozess, LinkedIn ein eigenes Partner-Programm für Publishing-Rechte — beides realistischerweise erst, wenn die Plattform über den Alpha-Test hinaus ist und im Beta-Betrieb läuft, nicht vorher.

**Zeitliche Einordnung:** "Alpha"/"Beta" sind Dannys Begriffe für die Testreife, nicht identisch mit den nummerierten Phasen 0–6 aus `00-MASTER-PLAN.md` Abschnitt 3. Grobe Zuordnung: Alpha ≈ Phasen 0–4 (Plattform intern/mit Testfamilien im Einsatz, aber noch nicht breit beworben), Beta ≈ ab Phase 5/6 (breiterer, öffentlicher Betrieb). Diese Zuordnung wird spätestens beim Erreichen von Phase 4 nochmals kurz mit Danny bestätigt, da sie hier zum ersten Mal auftaucht.

Damit ist für Phase 4 nur der Planungs-Kalender (V1) zu bauen, die echte API-Anbindung (Meta gesichert, LinkedIn versuchsweise) landet als Backlog-Eintrag für die Beta-Phase (wird dann ein eigenes kleines Dokument, kein Teil dieses hier).

## 6. Dashboard & KPIs (Ampelsystem, Google als Single Source of Truth)

Startseite der Admin-App — Ampelsystem (Grün/Gelb/Rot) statt Zahlenwüste, wie in `00-MASTER-PLAN.md` Abschnitt 5 festgelegt.

**Google-Daten (entschieden, 2026-08-18):** Google Analytics (GA4) und Google Search Console werden **vollständig ins Dashboard eingebunden**, nicht nur verlinkt — Single Source of Truth heisst, Danny (oder wer auch immer das Dashboard nutzt) muss nie ein externes Google-Tool öffnen, um den Überblick zu haben. Technisch:

- Eine tägliche Supabase Edge Function ruft die relevanten Kennzahlen über die GA4 Data API und die Search Console API ab und schreibt sie in eine neue, bewusst generische Tabelle **`dashboard_metrics_cache`** (`source`, `metric_key`, `metric_date`, `value`, `fetched_at`) — dasselbe Baukasten-Prinzip wie bei den FOMO-Pills in `05-MODULE-BOOKING.md`: neue Kennzahlen später ergänzen, ohne das Schema zu ändern.
- Das Dashboard liest ausschliesslich aus diesem Cache, nie live von Google aus — schnell, kein Rate-Limit-Risiko, und die Zahlen sind für alle Admin-Nutzer:innen konsistent (alle sehen denselben Stand).
- Voraussetzung (einmalige Einrichtung, siehe `02-DEPLOYMENT.md`): ein Google-Cloud-Projekt mit aktivierter GA4-Data-API und Search-Console-API, ein Service-Account mit Lesezugriff auf die GA4-Property und die Search-Console-Property von somosunited.ch. Env-Variablen-Block `GOOGLE_*` ist bereits in `01-ARCHITECTURE.md` Abschnitt 5 vorgesehen.

**Resend-Daten (Ergänzung, 2026-09-01, Danny-Wunsch):** Resend bietet inzwischen eine eigene Metrics-API (`GET /emails/metrics`, siehe [Resend-Doku](https://resend.com/docs/api-reference/emails/get-metrics)) mit Zustellungs- und Engagement-Kennzahlen direkt von Resend selbst (`delivered`, `bounced`, `opened`, `unique_opened`, `clicked`, `complained`, `unsubscribed`, plus berechnete Raten wie `delivery_rate`/`open_rate`/`click_rate`/`bounce_rate`) — genauer als die bisherige Berechnung aus `newsletter_log`. Nach demselben Baukasten-Prinzip wie bei Google einzubinden: dieselbe tägliche Edge Function ruft zusätzlich die Resend-Metrics-API ab (Bearer-Auth mit dem bestehenden `RESEND_API_KEY`, kein neuer Key nötig) und schreibt in denselben **`dashboard_metrics_cache`** (`source = 'resend'`). Ersetzt/ergänzt die bisherige `newsletter_log`-Berechnung, sobald gebaut — noch nicht umgesetzt, nur als Entscheidung festgehalten für die Dashboard-Bauphase.

Beispiel-Kacheln (illustrativ):

- **Auslastung laufende Kurse** — Grün: gut gebucht, Gelb: mittel, Rot: fast leer/gefährdet (Schwellenwerte pro Serie später frei konfigurierbar, analog zum Scarcity-Schwellenwert aus `05-MODULE-BOOKING.md`).
- **Warteliste-Länge gesamt** — informativ, kein Ampel-Wert nötig.
- **Website-Traffic** (aus `dashboard_metrics_cache`, Quelle GA4) und **Suchperformance** (Quelle Search Console) — direkt im Dashboard, nicht nur verlinkt.
- **Newsletter-Öffnungsrate/Klickrate/Bounce-Rate** (aus `dashboard_metrics_cache`, Quelle Resend Metrics API), **SMS-Opt-in-Rate** — aus `families` berechnet.

Konkrete Ampel-Schwellenwerte (was zählt als "Grün") sind bewusst nicht hier festgelegt — die legt Danny im Betrieb fest, sobald erste echte Zahlen da sind. Technisch: Kacheln sind unabhängige Bausteine, einzeln erweiterbar, ohne bestehende KPIs zu berühren.

## 7. Mitarbeiter-Erfassung (Trainer-Accounts & Kiosk-Geräte)

- Admin (Permission `users`) legt einen neuen Trainer an: `profiles`-Zeile (`role = trainer`) + `trainers`-Zeile (Pay-Model, Stundensatz etc., siehe `03-DATA-MODEL.md` Abschnitt 2.4). System verschickt eine Einladung mit Magic Link zur Erstanmeldung (kein Self-Signup, wie in `01-ARCHITECTURE.md` Abschnitt 3 festgelegt).
- **Kiosk-Geräte** werden ebenfalls hier verwaltet: neuen Eintrag in `kiosk_devices` anlegen (gebunden an eine `location_id`), Gerät vor Ort einmalig einloggen (siehe `06-MODULE-TRAINER.md` Abschnitt 2). Widerruf (`revoked_at` setzen) ebenfalls von hier aus — der zentrale Ort, um ein verlorenes/gestohlenes Tablet sofort zu sperren.
- Zuweisung von Trainern zu Kursterminen (`trainer_assignments`) passiert ebenfalls hier bzw. direkt am Kurs-Kalender (Abschnitt 8).

## 8. Buchungsverwaltung & Kurs-Kalender (Verweis)

Beide Bereiche sind bereits in `05-MODULE-BOOKING.md` spezifiziert und werden hier nicht dupliziert, nur eingeordnet:
- **Buchungen einsehen/stornieren:** Permission `crm` (`05-MODULE-BOOKING.md` Abschnitt 14).
- **Kurs-Kalender pflegen** (Serien anlegen, Termine hinzufügen/entfernen): Permission `crm`, technischer Ablauf in `05-MODULE-BOOKING.md` Abschnitt 2 — inklusive der dort offenen Frage, ob eine schlanke Version schon in Phase 2 statt erst Phase 4 gebaut wird (mittlerweile mit Danny geklärt: ja, schlanke Version schon in Phase 2).
- **Preisstaffeln, Stornoregeln, FOMO-Einstellungen, Rückerstattungen, Abo-Verlängerung/Upsell-Rabatt:** Permission `finance` (`05-MODULE-BOOKING.md` Abschnitt 14).

## 9. Berechtigungen — Zusammenfassung

Konkretisiert `01-ARCHITECTURE.md` Abschnitt 4.2 für dieses Modul:

| Permission | Zugriff in diesem Modul |
|---|---|
| `crm` | Kundenliste, Kundenportfolio, `crm_notes`, E-Mail-Verlauf (`email_messages`), Segmente/gespeicherte Filter, Newsletter/SMS-Versand, Social-Posting-Kalender, Buchungen einsehen/stornieren, Kurs-Kalender pflegen |
| `finance` | Zusätzlich: Preisstaffeln, Stornoregeln, FOMO-Einstellungen, Rückerstattungen (siehe `05-MODULE-BOOKING.md`) |
| `users` | Mitarbeiter-Erfassung, Kiosk-Geräte-Verwaltung, Trainer-Zuweisung |

Ein Admin-Profil kann mehrere Permissions gleichzeitig haben (siehe `01-ARCHITECTURE.md` Abschnitt 4.2) — die Aufteilung oben ist die Grundlage, nicht exklusiv.

## 10. Datenmodell-Ergänzungen (bereits in `03-DATA-MODEL.md` nachgezogen)

- Neue Tabelle **`crm_saved_filters`** — gespeicherte Segment-Kriterien, keine Mitgliederliste.
- Neue Tabelle **`crm_notes`** — interne Admin-Notizen pro Familie, getrennt von `trainer_notes`.
- Neue Tabelle **`dashboard_metrics_cache`** — generischer Cache für Google-Analytics-/Search-Console-Kennzahlen (Abschnitt 6), täglich per Edge Function befüllt.
- Neue Tabelle **`email_messages`** (Abschnitt 4, neu 2026-08-19) — Kunden-E-Mail-Verlauf (ein-/ausgehend), verknüpft mit `family_id`.

## 11. Edge Cases

- **Familie storniert Newsletter-/SMS-Opt-in mitten in einer laufenden Kampagne:** nächster Versandlauf berücksichtigt automatisch den aktuellen Opt-in-Stand (Live-Abfrage, kein Snapshot) — niemand bekommt versehentlich weiter Nachrichten.
- **Trainer-Account wird versehentlich doppelt angelegt:** Admin kann Profile zusammenführen/deaktivieren; keine automatische Dedupe-Logik für den Start, da selten und mit Sorgfalt behandelt werden sollte statt automatisiert.
- **Kiosk-Gerät wird widerrufen, während gerade eingecheckt wird:** laufender Check-in-Vorgang wird nicht rückwirkend ungültig (bereits gesetzte `checked_in_at`-Werte bleiben), nur weitere Aktionen auf dem Gerät werden ab dem nächsten Heartbeat blockiert.
- **Eingehende Mail lässt sich keiner Familie zuordnen** (Abschnitt 4): landet im "nicht zugeordnet"-Posteingang, keine automatische Zuordnung per Rätselraten — Admin ordnet manuell zu oder ignoriert (z.B. Spam).
- **Familie antwortet von einer anderen Adresse als der hinterlegten:** gleiche Behandlung wie oben — manuelle Zuordnung statt stiller Fehlzuordnung.

## 12. Offene Punkte — bitte kurz gegenlesen

1. ~~SMS-Provider-Wahl~~ — **entschieden: Twilio** (Abschnitt 3).
2. ~~Social-Posting-Scope~~ — **entschieden: V1 (Planungs-Kalender) in Phase 4, volle API-Anbindung für Meta (gesichert) und LinkedIn (wenn möglich) als Backlog-Eintrag für die Beta-Phase** (Abschnitt 5).
3. ~~Google-Dashboard-Einbindung~~ — **entschieden: vollständige Einbindung als Single Source of Truth** über einen täglichen Cache (Abschnitt 6), kein reiner Link zu externen Google-Tools.
4. ~~E-Mail-Korrespondenz-Ansatz (Abschnitt 4)~~ — **von Danny bestätigt (2026-08-22): "Ja, so umsetzen"** — Resend Inbound, eigene Subdomain, `email_messages`-Tabelle, keine externe CRM-/Helpdesk-Software. Das ist eine Entscheidung, kein offener Punkt mehr. **Reine Ausführungsdetails, noch nicht entschieden:** genauer Subdomain-Name (Vorschlag `mail.somosunited.ch`) und DNS-Einrichtung — wird in `02-DEPLOYMENT.md` nachgetragen.
5. ~~"Alle anderen Mails" (Abschnitt 4)~~ — **von Danny bestätigt (2026-08-22): "Bei CYON bleiben"** — vorerst bewusst kein neues Tool. Spätere Aufrüstung auf ein Shared-Inbox-Tool (z.B. Missive) bleibt bei Bedarf möglich, eigenständige Entscheidung ausserhalb dieser Plattform, kein offener Punkt hier.

Alle inhaltlichen Punkte sind geklärt — offen bleibt nur die technische Ausführungsfrage Subdomain-Name/DNS (Punkt 4), die in `02-DEPLOYMENT.md` landet.

---
*Nächster Schritt: Subdomain-Name/DNS-Details in `02-DEPLOYMENT.md` nachtragen, danach ist dieses Dokument vollständig abgeschlossen.*
