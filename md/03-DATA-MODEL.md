---
title: Somos United — Data Model
version: 0.1
status: Freigegeben durch Danny am 2026-08-22
date: 2026-08-22
audience: Claude Code (Umsetzung)
depends_on: 00-MASTER-PLAN.md, 01-ARCHITECTURE.md, SECURITY.md
---

# Data Model

Vollständiges Schema: Sanity (redaktioneller Content) + Supabase (operative/personenbezogene Daten). Grundsatz aus `00-MASTER-PLAN.md` Abschnitt 1 gilt strikt: **ein Datentyp lebt genau in einem System**, nie dupliziert gepflegt. Verknüpfung zwischen den Systemen läuft über IDs als einfache Textfelder (kein Fremdschlüssel über Systemgrenzen hinweg möglich).

## 1. Sanity — Content-Schemas

| Schema | Zweck | Wichtige Felder |
|---|---|---|
| `module` | Ein Kurs/Modul (z.B. "Medienkompetenz") | `title`, `slug`, `language` (i18n), `description` (Portable Text), `category` (Medienkompetenz / Respekt / Gewaltprävention / psychische Belastung / Orientierung / Social Media), `ageRange`, `heroImage`, `onboardingTooltip` (Text, beim ersten Erscheinen des Moduls gezeigt), `status` (draft/published), `notionSourceId` (nullable, siehe `01-ARCHITECTURE.md` Abschnitt 8) |
| `page` | Generische Marketing-Seiten (Startseite, Über uns, …) | `title`, `slug`, `language`, `sections` (flexibler Block-Aufbau fürs Bento-Layout) |
| `blogPost` | News/Blog | `title`, `slug`, `language`, `publishedAt`, `body` |
| `legalDocument` | AGB, Datenschutzerklärung | `type`, `language`, `version`, `effectiveFrom`, `body` — **versioniert**, weil eine Buchung immer gegen die zum Buchungszeitpunkt gültige Version verweist (`legalDocumentVersion` in `bookings`, siehe unten). Deckt auch den Passus zur automatischen Abo-Verlängerung ab (Danny, 2026-08-19, siehe `05-MODULE-BOOKING.md` Abschnitt 8) — reine Content-Pflege in Sanity, kein Code nötig |
| `siteSettings` | Globale Einstellungen | Social-Links, Footer, Kontakt, Standard-Locale |
| `translation.metadata` | i18n-Verknüpfung (Sanity-i18n-Plugin) | verbindet `de`/`en`(/später `fr`/`it`)-Varianten eines Dokuments |

Alle Schemas: kein Hardcoding von Preisen — Preisreferenz liegt in Supabase/Stripe, nicht in Sanity (Content und Transaktion bleiben getrennt).

## 2. Supabase — Tabellen

### 2.1 Identität & Zugriff

- **`profiles`** (1:1 zu `auth.users`): `id`, `role` (`admin`|`superuser`|`trainer`|`client`), `permissions text[]` (nur admin: `crm`/`finance`/`users`), `location_id` (nullable, nur Kiosk), `is_kiosk boolean`, `locale_pref`, `created_at`.
- **`locations`** (Veranstaltungsorte): `id`, `name`, `address`, `lat`, `lng` (für MapLibre/OSM), `capacity`, `notes`, `rent_amount_cents` (neu, nullable — nicht jeder Ort hat Miete), `rent_cycle` (neu, z.B. `monthly`, freier Text statt starrem Enum, siehe `08-MODULE-FINANCE.md`), `rent_active boolean` (neu, Default `false`).
- **`kiosk_devices`**: `id`, `location_id`, `device_label`, `last_seen_at`, `revoked_at` — ermöglicht das in `SECURITY.md` Abschnitt 1 zugesagte Remote-Widerrufen eines verlorenen Tablets.

### 2.2 Familien & Kinder (Client-DB)

- **`families`**: `id`, `profile_id` (→ auth), `contact_name`, `email`, `phone`, `address`, `sms_opt_in boolean`, `newsletter_opt_in boolean`, `source` (Herkunft der Anmeldung, für CRM), `created_at`, `anonymized_at` (nullable — siehe `SECURITY.md` Abschnitt 5).
- **`children`**: `id`, `family_id`, `first_name`, `birth_year` (bewusst nur Jahrgang, kein volles Geburtsdatum — Datenminimierung, reicht für Alterszuordnung zu Modulen), `allergies_notes text`, `general_notes text`.

### 2.3 Kurse, Serien, Preise & Buchungen

**Neu gefasst (2026-08-18) nach Klärung der Abo-Logik in `05-MODULE-BOOKING.md`:** ein Abo gilt für eine konkrete, wiederkehrende Kursserie und bucht beim Kauf automatisch die nächsten N Termine. **Erweitert (2026-08-18, zweite Runde):** Preise sind nicht mehr fix pro Serie/Instanz, sondern über eine admin-editierbare Preisstaffel dynamisch (Early-Bird/Last-Minute-Prinzip). **Erneut erweitert (2026-08-19):** Abos verlängern sich automatisch (Netflix-Prinzip) mit vorherigem Upsell-Angebot, ausser fristgerechter Kündigung — Details/Begründung in `05-MODULE-BOOKING.md` Abschnitt 8.

- **`course_series`** (neu): fasst wiederkehrende Termine derselben Kurs-Gruppe zusammen. `id`, `module_ref` (Sanity `_id`), `location_id`, `cadence_label` (z.B. "wöchentlich", nur informativ), `abo_enabled boolean`, `fomo_enabled boolean` (Default `true` — steuert, ob Urgency/Scarcity-Pills für diese Serie angezeigt werden), `scarcity_seats_threshold` (nullable int — ab wie vielen freien Plätzen die "Nur noch X Plätze"-Pill erscheint; `null` = globaler Default aus `app_settings`, Schlüssel `scarcity_seats_threshold_default`), `renewal_upsell_label` (neu, 2026-08-19, freier Text, admin-editierbar — aktuell gültiges Upsell-Angebot beim Abo-Upgrade zur automatischen Verlängerung, kann ein Rabatt sein oder ein Sachbonus wie z.B. ein Gratis-T-Shirt, siehe `05-MODULE-BOOKING.md` Abschnitt 8), `renewal_upsell_discount_pct` (neu, 2026-08-19, nullable — nur gesetzt, wenn das Angebot tatsächlich ein Preisrabatt ist, sonst leer), `renewal_reminder_days_before` (neu, 2026-08-19, nullable int — Serie-spezifische Vorlaufzeit für den Abo-Verlängerungs-Reminder, `null` = globaler Default aus `app_settings`). Keine Preisfelder mehr direkt hier — siehe `price_tiers`.
- **`course_instances`** (Kurstermine): `id`, `series_id` (nullable, → `course_series` — Einzeltermine ausserhalb einer Serie sind erlaubt), `sequence_index` (Position innerhalb der Serie, chronologisch — Grundlage für "die nächsten N Termine" und für den Kalender-Erstellungsworkflow, siehe `05-MODULE-BOOKING.md`), `module_ref` (Sanity `_id`), `location_id`, `start_at`, `end_at`, `capacity`, `price_override_cents` (nullable — manuelle Ausnahme für genau diesen Termin, umgeht die Preisstaffel komplett, wenn gesetzt).
- **`price_tiers`** (neu): admin-editierbare, dynamische Preisstaffel ("Airline-Prinzip"). `id`, `series_id` (→ `course_series`), `plan_type` (`single`|`6x`|`12x`|`24x` — jede Buchungsart hat ihre eigene Staffel), `days_before_min`, `days_before_max` (nullable = offenes Ende, typischerweise die "Early Bird"-Stufe), `price_cents`, `label` (optional, z.B. "Early Bird"/"Standard"/"Last Minute", nur zur Übersicht im Admin-App), `updated_by`, `updated_at`. Änderungen landen im `audit_log`. Der zum Buchungszeitpunkt aktive Tarif wird in `bookings.price_paid_cents` eingefroren.
- **`trainer_assignments`**: `course_instance_id`, `trainer_id` (→ profiles), `role` (Haupt-/Co-Trainer), `reminder_sent_at` (nullable — 24h-Vorab-Erinnerung an den Trainer, siehe `06-MODULE-TRAINER.md`).
- **`bookings`**: `id`, `family_id`, `child_id`, `course_instance_id`, `status` (`pending`|`confirmed`|`waitlist`|`cancelled`), `subscription_id` (nullable, → `subscriptions`, gesetzt wenn Teil eines Abo-Kaufs), `price_paid_cents` (eingefrorener Preis zum Buchungszeitpunkt, aus `price_tiers` oder `price_override_cents`), `payment_status`, `stripe_payment_intent_id`, `legal_document_version` (welche AGB-Version galt bei Buchung), `cancellation_refund_pct` (eingefroren zum Stornozeitpunkt, siehe `05-MODULE-BOOKING.md` Abschnitt 8), `checkin_token` (zufälliger String, Inhalt des QR-Codes — nie die rohe `booking.id`, um Erraten/Durchzählen zu verhindern), `checked_in_at` (nullable, QR- oder manueller Check-in), `checked_in_by` (nullable, → profiles — welcher Trainer/Kiosk-Account den Check-in ausgelöst hat), `created_at`.
- **`subscriptions`** (Abos): `id`, `family_id`, `child_id`, `series_id` (→ `course_series` — ein Abo gilt für genau eine Serie), `plan_type` (`6x`|`12x`|`24x`), `purchase_date`, `price_paid_cents`, `stripe_payment_intent_id`. Erzeugt bei Kauf automatisch `plan_type`-viele `bookings`-Zeilen für die nächsten verfügbaren Termine der Serie. Kein `remaining_uses`/`expires_at` mehr — Gültigkeit ergibt sich aus den fest zugeordneten Terminen. **Neu (2026-08-19, automatische Abo-Verlängerung, siehe `05-MODULE-BOOKING.md` Abschnitt 8):** `auto_renew boolean` (Default `true`), `renewal_reminder_sent_at` (nullable), `cancelled_at` (nullable — fristgerechte Kündigung der Verlängerung, laufende Termine bleiben davon unberührt), `renewed_into_subscription_id` (nullable, → `subscriptions` — Verweis auf den durch Verlängerung entstandenen Folgezyklus), `stripe_payment_method_id` (gespeichertes Zahlungsmittel für die automatische Anschlusszahlung, via Stripe Setup Intent bei Erstkauf hinterlegt), `upsell_reward_label` (nullable — eingefrorener Text des beim Upgrade angenommenen Angebots), `upsell_reward_fulfilled_at` (nullable — Admin markiert manuell, sobald ein nicht-monetärer Bonus geliefert wurde; bleibt leer bei reinen Preisrabatten).
- **`cancellation_policy_tiers`** (neu): admin-editierbare Stornostaffel. `id`, `days_before_min`, `days_before_max` (nullable = offenes Ende), `refund_percentage`, `requires_doctor_note boolean`, `updated_by`, `updated_at`. Änderungen landen im `audit_log`. Seed-Werte siehe `05-MODULE-BOOKING.md` Abschnitt 9.
- **`reminders_log`**: `booking_id` (nullable, → `bookings`), `subscription_id` (neu, 2026-08-19, nullable, → `subscriptions` — für Abo-Verlängerungs-Reminder ohne Bezug zu einer einzelnen Buchung; genau eines der beiden IDs ist gesetzt), `type` (`confirmation`|`reminder_10d`|`reminder_1d`|`abo_renewal_upsell` (neu)), `sent_at`, `channel` (`email`|`sms`).

### 2.4 Trainer-Dossier & Personaldossier (HR)

**Neu gefasst (2026-08-18):** Lohnansätze sind keine festen Felder auf `trainers` mehr, sondern eine **Historie mit Gültigkeitsdatum** (Danny: "1.1.2026–31.08.2026 CHF 30/h, ab 1.9.2026 CHF 1000/Monat netto") — dieselbe Staffel-Logik wie bei `price_tiers`/`cancellation_policy_tiers`, hier auf Personaldaten angewendet. Dazu kommt ein vollständiges Personaldossier (angefordert von Danny: eigenes "HR-Tool").

- **`trainers`**: `profile_id`, `emergency_contact`, `iban` (verschlüsselt/eingeschränkter Zugriff). **Keine Lohnfelder mehr direkt hier** — siehe `trainer_pay_rates`.
- **`trainer_pay_rates`** (neu): Lohnansatz-Historie pro Trainer. `id`, `trainer_id`, `pay_model` (`hourly`|`monthly`|`per_course`), `rate_cents`, `amount_type` (`gross`|`net` — Danny hat explizit einen Netto-Monatslohn als Beispiel genannt, das System muss Netto-Lohn-Vereinbarungen unterstützen, siehe `08-MODULE-FINANCE.md` Abschnitt 1), `valid_from`, `valid_to` (nullable = aktuell gültig), `created_by`, `created_at`. Mehrere Zeilen pro Trainer über die Zeit, nie überschrieben — historische Abrechnungen bleiben nachvollziehbar korrekt.
- **`payroll_deduction_types`** (neu, erweitert 2026-08-22): admin-editierbare Abzugsarten. Nicht jeder Abzug ist ein Prozentsatz — Danny nennt als Beispiele AHV/IV/EO 5.3%, ALV 1.1%, Pensionskasse (variiert je Plan), Nichtbetriebsunfall (NBU) 0.355%, UVG-Zusatz 0.0079%, Krankentaggeld (KTG, variiert je Plan) als prozentuale Abzüge, aber auch GAV-Positionen oder Arbeitskleidung, die als **Fixbetrag** statt als Prozentsatz abgezogen werden. Damit das Datenmodell keinen der beiden Fälle hartcodiert, trägt die Tabelle beide Varianten nebeneinander: `id`, `code` (freier Text, z.B. `AHV_IV_EO`), `label`, `amount_type` (`percentage`|`fixed_amount` — bestimmt, welches der beiden folgenden Felder gilt), `percentage` (nullable, nur gesetzt wenn `amount_type = percentage`), `amount_cents` (nullable, nur gesetzt wenn `amount_type = fixed_amount`), `valid_from`, `valid_to` (nullable), `active boolean`. Genau eines von `percentage`/`amount_cents` ist pro Zeile gesetzt, nie beide. Bei jeder Payroll-Generierung werden die zum Zeitpunkt gültigen Zeilen herangezogen und in `payroll_statements.deductions_json` eingefroren (gleiches Prinzip wie überall sonst im Projekt: zum Zeitpunkt gültiger Wert wird fixiert, spätere Änderungen wirken nie rückwirkend). Die konkreten Sätze/Beträge sind reine Dateneingabe im Admin-App, keine Code-Änderung — siehe `08-MODULE-FINANCE.md` Abschnitt 1 und 3.
- **`trainer_documents`** (neu, Personaldossier): angeforderte/erhaltene Dokumente. `id`, `trainer_id`, `document_type` (freier Text, z.B. "Strafregisterauszug", "Arbeitsvertrag", "Vereinbarung" — admin-definierbar, kein festes Enum), `file_url` (privater Supabase-Storage-Bucket), `requested_at`, `received_at` (nullable), `expires_at` (nullable — z.B. Strafregisterauszug muss periodisch erneuert werden), `uploaded_by`.
- **`annual_tax_statements`** (neu, Lohnausweise): `id`, `trainer_id`, `year`, `pdf_url`, `generated_at`, `sent_at`. Automatisch generiert (siehe `08-MODULE-FINANCE.md` Abschnitt 5).
- **`trainer_notes`**: `id`, `author_trainer_id`, `child_id` oder `course_instance_id`, `note text`, `created_at` — sichtbar für andere Trainer (wie im Briefing gefordert), nie für Clients. Bewusst getrennt von `trainer_documents`/Personaldossier (fachliche Notizen zu Kursen, nicht HR-Daten).
- **`timesheets`** (Stundenerfassung): `trainer_id`, `course_instance_id`, `date`, `hours`, `approved_by`, `approved_at`.

### 2.5 Finance (Admin-App)

- **`payroll_statements`** (Abrechnungen): `id`, `trainer_id`, `period` (Format `YYYY-MM`), `gross_amount_cents`, `deductions_json` (Aufschlüsselung Sozialleistungen etc.), `net_amount_cents`, `pdf_url`, `status` (`draft`|`released`), `released_at` — Trainer-App zeigt einer/m Trainer **nur** eigene Zeilen mit `status = released` (Selbstbedienung wie in `00-MASTER-PLAN.md` Abschnitt 9 zugesagt).
- **`payroll_line_items`** (neu, siehe `08-MODULE-FINANCE.md`): Transparenz-Aufschlüsselung des Brutto-Betrags (nicht nur der Abzüge). `id`, `payroll_statement_id`, `description`, `amount_cents`, `source_type` (`timesheet`|`course`|`manual`), `source_id` (nullable, → `timesheets`/`course_instances`).
- **`invoices`** (Rechnungen/Quittungen): `id`, `related_type` (`family`|`trainer`|`vendor`), `related_id`, `amount_cents`, `status`, `pdf_url`, `due_date`, `cost_center_id`.
- **`expenses`** (Spesen): `submitted_by`, `amount_cents`, `category`, `receipt_url`, `approved_by`, `approved_at`.
- **`venue_rents`** (Saalmieten): `location_id`, `period`, `amount_cents`, `status`.
- **`refunds`** (Rückvergütungen): `booking_id`, `amount_cents`, `outcome` (`refunded`|`donated` — Familie kann den rückerstattungsfähigen Betrag statt Auszahlung auch spenden, siehe `05-MODULE-BOOKING.md` Abschnitt 5), `reason`, `processed_by` (`system` bei Self-Service oder Admin-Kürzel), `processed_at`.
- **`cost_centers`**: `id`, `name`, `code` — Referenz auf `invoices`/`expenses`/`venue_rents` für P&L-Auswertung, CSV-exportierbar.

### 2.6 CRM & Kommunikation

- **`sms_log`** / **`newsletter_log`**: `recipient_family_id`, `campaign_id`, `sent_at`, `status`.
- **`crm_saved_filters`** (neu, siehe `07-MODULE-CRM.md`): gespeicherte Segment-Definitionen, kein Redundanz-Speicher der Mitgliederliste selbst. `id`, `name`, `filter_json` (strukturierte Kriterien, z.B. Opt-in-Status, letzte Aktivität, Abo-Status), `created_by`, `created_at`. CRM-Segmente selbst bleiben **Views/Live-Abfragen** über `families`/`bookings` — ein gespeicherter Filter ist nur das wiederverwendbare Kriterien-Set, keine Mitgliederliste.
- **`crm_notes`** (neu): interne Admin-Notizen pro Familie (Kundenbeziehung, z.B. "hat sich über Warteliste beschwert") — getrennt von `trainer_notes` (die sind kind-/kursbezogen und für Trainer gedacht). `id`, `family_id`, `author_admin_id` (→ profiles), `note`, `created_at`. Nur mit Permission `crm` sichtbar, landet im `audit_log` wie jeder Kontaktdaten-Zugriff.
- `families.last_login_at` (aktualisiert bei Magic-Link-Login) für die "last Login"-Kennzahl aus dem Briefing.
- **`dashboard_metrics_cache`** (neu, siehe `07-MODULE-CRM.md` Abschnitt 6): generischer Cache für extern bezogene Dashboard-Kennzahlen (aktuell Google Analytics/Search Console). `id`, `source` (`ga4`|`search_console`), `metric_key`, `metric_date`, `value`, `fetched_at`. Täglich per Supabase Edge Function befüllt — das Admin-Dashboard liest ausschliesslich hieraus, nie live von Google, damit alle Admins denselben Stand sehen und keine Rate-Limits drohen. Bewusst generisch (kein Feld pro Kennzahl), damit neue Kennzahlen später ohne Schema-Änderung dazukommen.
- **`app_settings`** (neu, 2026-08-19, siehe `05-MODULE-BOOKING.md` Abschnitt 8): generische, plattformweite Einstellungstabelle — Schlüssel/Wert statt Hardcoding, für Standardwerte, die mehrere Module betreffen oder sich ohne Deployment ändern lassen sollen. `key` (text, Primärschlüssel, z.B. `renewal_reminder_days_before_default`, `communication_send_days`, `communication_weekend_handling` — Werte `before_weekend`/`after_weekend`/`allow_weekend`, analog zur Bank-Value-Date-Konvention, siehe `05-MODULE-BOOKING.md` Abschnitt 8 —, `scarcity_seats_threshold_default`), `value` (jsonb — deckt Zahl/Text/Bool/Liste einheitlich ab), `description` (Klartext, im Admin-App als Hilfetext angezeigt), `updated_by` (→ profiles), `updated_at`. Löst ab, was bisher nur als "globaler Default aus Config" beschrieben war (z.B. der Scarcity-Schwellenwert). Bewusst generisch, damit neue plattformweite Einstellungen später ohne Schema-Änderung dazukommen — gleiches Prinzip wie `dashboard_metrics_cache`.
- **`email_messages`** (neu, 2026-08-19, siehe `07-MODULE-CRM.md` Abschnitt 4): Kunden-E-Mail-Verlauf, ein- und ausgehend, empfangen über Resend Inbound (eigene Subdomain, z.B. `mail.somosunited.ch`). `id`, `family_id` (nullable, solange nicht zugeordnet — Admin ordnet unbekannte Absender manuell zu), `direction` (`inbound`|`outbound`), `from_address`, `to_address`, `subject`, `body_text`, `body_html`, `resend_id`, `attachments_json`, `created_by` (nullable, → profiles — gesetzt bei manuellem Admin-Versand, leer bei automatisierten Trigger-Mails), `sent_at`/`received_at`. Admin-Anzeige kombiniert diese Tabelle mit `reminders_log`/`newsletter_log` zu einem durchgehenden Thread pro Familie, ohne Datenduplikation.

### 2.7 Notion-Sync & Audit

- **`notion_sync_log`**: `notion_page_id`, `sanity_draft_id`, `synced_at`, `status`, `error_message` — Nachvollziehbarkeit des Flows aus `01-ARCHITECTURE.md` Abschnitt 8.
- **`audit_log`**: `actor_id`, `action`, `target_table`, `target_id`, `accessed_at` — die in `01-ARCHITECTURE.md` Abschnitt 4.4 zugesagte Protokollierung jedes Zugriffs auf Client-Kontaktdaten.

## 3. RLS-Grundmuster (Beispiele)

Alle Tabellen: `ENABLE ROW LEVEL SECURITY`, keine Policy = kein Zugriff (deny-by-default, siehe `01-ARCHITECTURE.md` Abschnitt 3).

- **`children`**: `client` sieht nur Zeilen der eigenen `family_id`; `trainer` sieht nur Vorname + `allergies_notes` von Kindern in eigenen `course_instances`, nie Nachname/Kontakt (steht ohnehin nicht in dieser Tabelle); `admin` mit Permission `crm` sieht alles.
- **`payroll_statements`**: `trainer` sieht nur eigene Zeilen mit `status = released`; nur `admin` mit Permission `finance` darf `status` auf `released` setzen.
- **`trainer_notes`**: lesbar für alle `trainer`-Profile (geteiltes Wissen wie gefordert), schreibbar nur vom `author_trainer_id` selbst.
- **`trainer_pay_rates`**: schreibbar nur `admin` mit Permission `users` (Personaldossier-Pflege); lesbar zusätzlich von `admin` mit Permission `finance` (braucht die aktuellen Sätze für die Payroll-Generierung), nie vom Trainer selbst (sensible Lohndaten, keine Selbstbedienung).
- **`trainer_documents`**: schreibbar/lesbar `admin` mit Permission `users`; der betroffene Trainer selbst darf eigene Zeilen lesen und angeforderte Dokumente hochladen (Self-Service, siehe `06-MODULE-TRAINER.md`), aber keine bereits hochgeladenen Dokumente löschen.
- **`bookings`**: `client` sieht nur eigene `family_id`-Zeilen; `admin` mit `crm` sieht alle; `admin` mit `finance` zusätzlich Zahlungsfelder.
- **`email_messages`** (neu, 2026-08-19): nur `admin` mit Permission `crm` sichtbar (wie `crm_notes`), nie vom `client` selbst einsehbar. Jeder Zugriff ein `audit_log`-Eintrag (Kontaktdaten-Zugriff).
- **`app_settings`** (neu, 2026-08-19): schreibbar nur `admin` mit Permission `finance` (gleiche Stufe wie `price_tiers`/`cancellation_policy_tiers`, da vergleichbare globale Geschäftsregeln), lesbar von allen `admin`-Rollen (wird von mehreren Modulen ausgelesen, z.B. Booking und CRM).

## 4. Aufbewahrung/Löschung — Umsetzung im Schema

Konkretisiert `SECURITY.md` Abschnitt 5:
- `families.anonymized_at` — bei Löschwunsch wird `contact_name`/`email`/`phone`/`address` überschrieben, Zeile bleibt für `invoices`/`bookings`-Referenzintegrität (Buchhaltungspflicht) bestehen.
- `children` wird bei Anonymisierung der Familie vollständig gelöscht (keine Aufbewahrungspflicht für Kinderdaten).
- `invoices`/`payroll_statements`/`annual_tax_statements` bleiben 10 Jahre unangetastet (OR Art. 958f), unabhängig vom Familien-/Trainer-Status.
- `trainer_documents`/`trainer_pay_rates`: Aufbewahrungsdauer nach Ende eines Arbeitsverhältnisses ist eine offene Detailfrage für `08-MODULE-FINANCE.md` (Personalakten-Aufbewahrung folgt in der Schweiz oft ähnlichen Fristen wie Buchhaltungsunterlagen, ist aber kein Automatismus wie bei `invoices`).

## 5. Offene Detailfragen für die Modul-Dokumente

Bewusst nicht hier entschieden, sondern in den jeweiligen Modul-Dokumenten:
- Abo-/Stornologik: geklärt und im Schema umgesetzt, Details in `05-MODULE-BOOKING.md`.
- Exakte Formel für Sozialleistungen/Ferienanspruch im `deductions_json` → `08-MODULE-FINANCE.md`.
- CRM-Segment-Definitionen im Detail → `07-MODULE-CRM.md`.

---
*Nächster Schritt: Danny liest gegen (v.a. Abschnitt 2.4 Personaldossier, neu), dann ist der Kern-Fahrplan aus `00-MASTER-PLAN.md` Abschnitt 8 vollständig durch.*
