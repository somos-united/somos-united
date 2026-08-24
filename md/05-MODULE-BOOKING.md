---
title: Somos United — Modul Booking (Buchung & Abos)
version: 0.8
status: Freigegeben durch Danny am 2026-08-18 (Kern) und 2026-08-19 (Nachtrag Abo-Verlängerung, Abschnitt 8) — alle Offene Punkte geklärt
date: 2026-08-19
audience: Claude Code (Umsetzung)
depends_on: 00-MASTER-PLAN.md Abschnitt 3 (Phase 2), 03-DATA-MODEL.md Abschnitte 2.3 & 5, SECURITY.md
---

# Modul Booking

Vertieft `00-MASTER-PLAN.md` Phase 2. Betrifft `apps/web` (Client-Bereich), Teile von `apps/admin` (Kurs-Erstellung, Preis-/Stornostaffeln) sowie die Supabase-Tabellen `course_series`, `course_instances`, `price_tiers`, `bookings`, `subscriptions`, `cancellation_policy_tiers`, `reminders_log`.

## 0. Änderungshistorie (Feedback von Danny, 2026-08-18)

1. **Abo ist keine generische Wallet**, sondern an eine konkrete Kursserie gebunden — automatische Eintragung in die nächsten N Termine bei Kauf.
2. **Preise leben nicht im Stripe-Dashboard**, sondern in unserer eigenen DB, dynamisch an Stripe Checkout übergeben.
3. **Stornofristen gestaffelt** (20/30-Tage-Regel), admin-editierbar statt hart codiert.
4. **Warteliste benachrichtigt alle gleichzeitig** (First Come First Served).
5. **"Kiosk-Login" richtiggestellt:** normales Kundenkonto nach Magic-Link-Login, Vorbild Galaxus.ch — kein Zusammenhang mit dem Trainer-Kiosk-Tablet.
6. **Neu (diese Runde):** Alles muss modular/flexibel bleiben — Angebote und Preismodelle jederzeit ohne Deployment änderbar. Dynamische Preisstaffeln nach Airline-Prinzip (Early Bird/Last Minute), automatisierte FOMO-Hinweise (Urgency/Scarcity/Nudging) als Pills, und ein Kalender-basierter Workflow zum Anlegen von Kursserien (manuell wählbare Daten statt starrem Wochentag-Automatismus, wegen Ferien/Feiertagen).
7. **Neu (Nachtrag 2026-08-19):** Ein Abo verlängert sich künftig **automatisch** im gleichen Umfang, sobald der aktuelle Zyklus ausläuft — inklusive vorherigem Upsell-Angebot ("auf 12er wechseln und X% sparen") und der Möglichkeit, fristgerecht nicht zu verlängern. Details in neuem Abschnitt 8.

## 1. Grundprinzip: Was ist ein "Abo" bei Somos United

Ein Abo ist **keine allgemeine Gutschrift**, die gegen irgendeinen Kurs eingelöst werden kann. Ein Abo gilt für **eine konkrete, wiederkehrende Kursserie** (z.B. "Medienkompetenz, Gruppe A, Ort X, jeden Donnerstag"). Beim Kauf eines 6x/12x/24x-Abos für diese Serie wird die Familie **automatisch** für die nächsten 6/12/24 anstehenden Termine dieser Serie eingetragen — mit einer einzigen Zahlung.

Beispiel: Kauf am 1. eines Monats, erster Kurstermin am 1. Januar (wöchentlich) → ein 6x-Abo bucht automatisch 1. Jan, 8. Jan, 15. Jan, 22. Jan, 29. Jan, 5. Feb.

## 2. Kurs/Serie anlegen — Admin-Workflow (Kalender)

So entsteht eine `course_series` mit ihren `course_instances` — Grundlage für alles Weitere in diesem Dokument.

1. Admin wählt Modul (Sanity `module`), Ort (`location_id`), vergibt ein `cadence_label` (rein informativ, z.B. "wöchentlich").
2. Ein **Kalender-Picker öffnet sich** (Vorschau über mehrere Monate). Admin markiert **manuell jedes Datum**, an dem die Serie stattfindet — kein blinder "jeden Donnerstag"-Automatismus, damit Schulferien und Feiertage einfach ausgelassen werden können. Komfort-Starthilfe: eine Wochentag-Vorauswahl (z.B. "alle Donnerstage") vorschlagen, die der Admin danach frei nachjustiert (einzelne Daten entfernen/hinzufügen) — am Ende zählt nur, was effektiv markiert ist.
3. Für jedes gewählte Datum: Uhrzeit (Start/Ende), Kapazität (Default aus der Serie, pro Termin überschreibbar), optional Trainer-Zuweisung.
4. System erzeugt pro gewähltem Datum eine `course_instances`-Zeile mit `series_id` + `sequence_index` (chronologische Reihenfolge — Basis für "die nächsten N Termine" bei Abo-Käufen, Abschnitt 6).
5. **Derselbe Kalender ist die einzige Quelle für alle Reminder-Trigger** (10 Tage/1 Tag vor `start_at`, Abschnitt 9) — keine zweite, separate Terminverwaltung.
6. Nachträglich Termine hinzufügen/entfernen: möglich. Sind bereits Buchungen/Abo-Zuweisungen an einem Termin vorhanden, gibt es eine Warnung statt eines stillen Löschens — Admin entscheidet bewusst (analog zum manuellen Kulanzfall-Prinzip bei Storno).

**Wichtiger Hinweis zur Reihenfolge (bitte kurz bestätigen):** Laut `00-MASTER-PLAN.md` gehört die volle Admin-Oberfläche offiziell erst zu Phase 4 (`07-MODULE-CRM.md`). Damit Phase 2 (Buchung) aber überhaupt getestet werden kann, braucht es diesen Kurs-Erstellungs-Workflow — zumindest in einer schlanken Form — schon während Phase 2, nicht erst in Phase 4. Vorschlag: eine einfache interne Version dieses Workflows (ohne Politur) wird bereits in Phase 2 gebaut, die vollständige/schöne Admin-Oberfläche folgt dann in Phase 4. Ändert nichts an der Datenstruktur, nur am Zeitpunkt, wann welche UI-Politur passiert.

## 3. Buchungsflow

1. **Entdecken:** Besucher:in sieht Modul-Übersicht (Sanity-Content), wählt ein Modul.
2. **Termin/Serie wählen:** verfügbare `course_instances` zum Modul (nach Ort/Datum filterbar). Preis wird **dynamisch** angezeigt (Abschnitt 5), inklusive FOMO-Pills wo zutreffend (Abschnitt 6). Gehört ein Termin zu einer `course_series` mit `abo_enabled = true`, zeigt die Seite zusätzlich die verfügbaren Abo-Grössen (6x/12x/24x) mit ihrem jeweils aktuellen Preis — nur, wenn ab diesem Termin auch genug künftige Termine derselben Serie existieren (Abschnitt 13).
3. **Konto:** Magic-Link-Login (Supabase Auth). Neue Familie → Konto entsteht automatisch. Bestehende Familie → direkt eingeloggt, landet im Konto-Bereich (Abschnitt 4).
4. **Kind zuordnen:** bestehendes Kind wählen oder neues anlegen. Altersfilter gegen Modul-Zielgruppe als Warnhinweis, kein Hard-Block.
5. **Zahlungsart wählen:** Einzelbuchung oder Abo — Preis ist zu diesem Zeitpunkt bereits fixiert (der beim Ansehen gültige Tarif, kurze Reservierungslogik verhindert, dass sich der Preis mitten im Checkout ändert).
6. **AGB-Zustimmung:** Pflicht-Checkbox. Aktuell publizierte `legalDocument`-Version wird pro `bookings`-Zeile eingefroren.
7. **Zahlung:** Stripe Checkout, Preis dynamisch übergeben (Abschnitt 5).
8. **Bestätigung:** sofortige Bestätigungsmail (Resend) mit allen gebuchten Terminen inkl. ICS-Anhang. Pro Buchung ein `reminders_log`-Eintrag `type = confirmation`.

## 4. Client-Konto-Bereich (Selbstbedienung) — Benchmark Galaxus.ch

Danny hat Galaxus.ch als Vorbild geschickt: nach Login ein Konto-Menü mit Bestellungen, Rechnungen, Retouren, Einstellungen — selbst verwalten, ohne Anruf/Mail an den Verein. Übertragen auf Somos United:

| Galaxus (Vorbild) | Somos United | Quelle |
|---|---|---|
| Orders | **Buchungen** — alle Kurstermine der Familie, pro Kind gruppierbar, Status sichtbar | `bookings` |
| Invoices | **Rechnungen** — Zahlungsbelege als PDF | `invoices` (`related_type = family`), bereits vorhanden |
| Returns and delivery problems | **Storno & Rückerstattung** — Storno direkt aus einer Buchung heraus (Abschnitt 9), Abo nicht verlängern (Abschnitt 8) | `bookings`, `refunds`, `subscriptions` |
| Settings | **Einstellungen** — Kontaktdaten, Kinder verwalten, Login, Benachrichtigungen | `families`, `children` |

Kein separater Buchungsnummer-Flow, kein Zusammenhang mit dem Trainer-Kiosk-Tablet (das bleibt reine Check-in-Technik vor Ort, siehe `06-MODULE-TRAINER.md`).

## 5. Dynamische Preisgestaltung (Early Bird / Last Minute)

Umsetzung von Dannys Wunsch nach "Airline-Prinzip": Preise sind keine fixen Werte mehr, sondern eine **admin-editierbare Staffel** in der neuen Tabelle `price_tiers` — je näher der Kurstermin, desto höher (typischerweise) der Preis, komplett ohne Deployment änderbar.

- Jede Serie kann pro Buchungsart (`plan_type`: `single`/`6x`/`12x`/`24x`) eine eigene Staffel haben, z.B.:

| Zeitraum vor Kursbeginn | Beispiel-Tarif (Einzelbuchung) |
|---|---|
| Mehr als 30 Tage | CHF 25.– (Early Bird) |
| 10–30 Tage | CHF 30.– (Standard) |
| Weniger als 10 Tage | CHF 35.– (Last Minute) |

Diese Zahlen sind reine Platzhalter zur Illustration — die tatsächlichen Stufen/Beträge legt Danny im Admin-App fest, pro Serie unterschiedlich möglich.
- Bei einem Abo-Kauf gilt dieselbe Logik bezogen auf den **ersten** gebuchten Termin der Serie.
- Der zum Zeitpunkt der Buchung aktive Tarif wird in `bookings.price_paid_cents` bzw. `subscriptions.price_paid_cents` eingefroren — spätere Staffel-Änderungen wirken nie rückwirkend.
- **Manuelle Ausnahme:** `course_instances.price_override_cents` erlaubt es, für einen einzelnen Termin die Staffel komplett zu umgehen (z.B. ein Charity-Sondertermin zum Fixpreis) — Modularität, wie von Danny gewünscht.
- Technisch identisch zum bereits beschriebenen Checkout-Prinzip (Abschnitt 3 in v0.3): kein Stripe-Produktkatalog, der aktuell gültige Preis wird bei jedem Checkout dynamisch an Stripe übergeben.

## 6. FOMO-Pills: Urgency, Scarcity, Nudging

Automatisierte, kleine Hinweis-Badges ("Pills") auf der Buchungsseite — komplett aus bestehenden Daten abgeleitet, keine manuelle Pflege pro Termin nötig:

| Pill-Typ | Anzeigelogik | Beispieltext |
|---|---|---|
| **Scarcity** (Verknappung) | `capacity − bestätigte Buchungen ≤ course_series.scarcity_seats_threshold` (`null` = globaler Default aus `app_settings`, Schlüssel `scarcity_seats_threshold_default`, Startwert **5**, bestätigt von Danny — Tabelle neu seit 2026-08-19, siehe Abschnitt 8) | "Nur noch 3 Plätze frei" |
| **Urgency** (Dringlichkeit) | aktuell gültiger `price_tiers`-Tarif hat ein `days_before_max`-Ende, das näher rückt | "Aktueller Preis nur noch bis 12.9." |

Beide Pills sind pro Serie über `course_series.fomo_enabled` abschaltbar (manche Kurse — z.B. bewusst klein gehaltene — sollen keine Verknappungs-Botschaft zeigen). Da beide Pills rein aus vorhandenen Daten berechnet werden (Kapazität, Buchungsstand, aktive Preisstufe), braucht es **keine zusätzliche Pflege** durch Danny im Alltag — nur die Schwellenwerte sind editierbar. Bewusst modular gebaut: weitere Pill-Typen (z.B. Social Proof "X Familien haben sich diese Woche angemeldet") lassen sich später ergänzen, ohne bestehende Logik zu verändern.

## 7. Abo-Kauf im Detail

1. Familie wählt Serie + Abo-Grösse (6x/12x/24x) ab einem Start-Termin.
2. System ermittelt die nächsten N `course_instances` derselben `series_id` ab dem gewählten Start (sortiert nach `sequence_index`), prüft Kapazität pro Termin.
3. Preis: aktuell gültiger `price_tiers`-Tarif für `plan_type` passend zur Abo-Grösse, bezogen auf den ersten Termin (Abschnitt 5).
4. Nach erfolgreicher Zahlung: eine `subscriptions`-Zeile plus N `bookings`-Zeilen mit `status = confirmed` und `subscription_id`-Verweis — auf einen Schlag. Das Zahlungsmittel wird bei Stripe sicher für spätere automatische Verlängerungen hinterlegt (Setup Intent, Abschnitt 8).
5. Jede dieser N Buchungen läuft danach wie jede normale Buchung weiter (Reminder, Check-in, Stornomöglichkeit einzeln pro Termin — Abschnitt 9).

Kein `remaining_uses`- oder `expires_at`-Feld nötig — die Gültigkeit ergibt sich aus den fest zugeordneten Terminen. Was nach dem letzten dieser Termine passiert, regelt Abschnitt 8.

## 8. Abo-Verlängerung (automatisch) — Nachtrag Danny, 2026-08-19

Ein Abo läuft nicht einfach "aus", sondern verlängert sich **automatisch im gleichen Umfang**, ausser die Familie kündigt fristgerecht — Prinzip bekannter Abo-Dienste (Netflix/Spotify-Logik), inklusive Upsell-Angebot.

**Ablauf:**

1. **X Tage vor dem letzten bereits gebuchten Termin** des aktuellen Zyklus (letzter der N `course_instances` aus Abschnitt 7; X admin-editierbar, siehe "Vorlaufzeit und Versandtage" unten, Startwert 5) verschickt der tägliche Reminder-Job (Abschnitt 11) eine Erinnerung — E-Mail (+ SMS bei Opt-in) — mit zwei Informationen:
   - Das Abo verlängert sich automatisch im gleichen Umfang (z.B. weitere 6 Termine), falls nichts unternommen wird.
   - Ein Upsell-Angebot beim Wechsel auf die nächstgrössere Abo-Stufe — der Text kommt 1:1 aus `course_series.renewal_upsell_label` (neu, freier Text, admin-editierbar). **Bewusst nicht auf einen Rabatt-Prozentsatz festgelegt** (Danny, 2026-08-19): das Angebot kann ein Preisrabatt sein ("20% sparen"), aber genauso ein Sachbonus ("Gratis Somos-T-Shirt beim Upgrade") oder etwas ganz anderes — Admin trägt frei ein, was gerade gilt, kein Hardcoding auf einen bestimmten Angebotstyp.
2. **Familie reagiert nicht:** am Tag nach dem letzten Termin bucht das System automatisch die nächsten N Termine derselben Serie (gleiche Abo-Grösse wie bisher) und zieht den fälligen Betrag über das bei Kauf hinterlegte Zahlungsmittel automatisch ein (Stripe, Off-Session-Zahlung).
3. **Familie nimmt das Upgrade-Angebot an** (im Client-Konto-Bereich, Abschnitt 4): der nächste Zyklus startet mit der grösseren Abo-Grösse. Ist `course_series.renewal_upsell_discount_pct` gesetzt (das Angebot ist ein Preisrabatt), wendet das System ihn automatisch auf den Tarif der neuen Stufe an. Ist das Feld leer (das Angebot ist ein Sachbonus wie das T-Shirt), bleibt der Preis unverändert, aber das angenommene Angebot wird zum Zeitpunkt der Annahme in `subscriptions.upsell_reward_label` eingefroren — Admin sieht das im Kundenportfolio (`07-MODULE-CRM.md` Abschnitt 2) und markiert die Lieferung des Bonus manuell als erledigt (`upsell_reward_fulfilled_at`), da das keine automatisierbare Zahlungslogik ist.
4. **Familie kündigt fristgerecht** (im Client-Konto: "Abo nicht verlängern", jederzeit vor dem automatischen Verlängerungslauf möglich): kein neuer Zyklus wird gebucht. Bereits gebuchte/bezahlte Termine des laufenden Zyklus bleiben unverändert bestehen — es wird nur der *nächste* Zyklus nicht mehr angelegt.

**Zusammenspiel mit der Warteliste (Beispiel 2 von Danny):** Verlängert sich ein Abo nicht, entsteht für die kommenden Termine kein automatischer Buchungs-Block mehr für diese Familie — ein Platz, der sonst durch die Verlängerung belegt worden wäre, bleibt frei. Der bestehende Wartelisten-Mechanismus (Abschnitt 10) greift dabei **unverändert**: sobald ein Platz frei wird — egal ob durch klassische Einzel-Stornierung oder durch eine nicht verlängerte Abo — werden alle Familien auf der Warteliste gleichzeitig über ihren Opt-in-Kanal (SMS oder E-Mail) benachrichtigt, First Come First Served. Keine zusätzliche Logik nötig.

**Vorlaufzeit und Versandtage individuell steuerbar (Nachtrag Danny, 2026-08-19):** Weder die "X Tage vorher"-Zahl noch der Wochentag des Versands sollen im Code feststehen. Dafür führen wir eine neue, generische Einstellungstabelle **`app_settings`** ein (Schlüssel/Wert, admin-editierbar, siehe `03-DATA-MODEL.md` Abschnitt 2.6) — der zentrale Ort für plattformweite Standardwerte, die bisher nur als "Config" beschrieben waren (z.B. auch der Scarcity-Schwellenwert-Default aus Abschnitt 6, wird dort nachgezogen).

- **Vorlaufzeit:** globaler Default in `app_settings` (Schlüssel `renewal_reminder_days_before_default`, Startwert `5`), pro Serie überschreibbar über `course_series.renewal_reminder_days_before` (neu, nullable — `null` = globaler Default) — dasselbe Baukasten-Prinzip wie beim Scarcity-Schwellenwert.
- **Wochenend-Handling als Flag** (Nachtrag Danny, 2026-08-19: "wie bei den Banken" — Business-Day-Convention statt fester Regel): neuer globaler Schalter in `app_settings` (Schlüssel `communication_weekend_handling`), admin-editierbar mit drei Werten, die genau Dannys Vorgabe entsprechen:

  | Wert | Bedeutung | Beispiel (Versandtag fällt auf Sonntag) |
  |---|---|---|
  | `before_weekend` ("vor Weekend") | wird auf den letzten Werktag davor vorgezogen | Versand am Freitag |
  | `after_weekend` ("nach Weekend") | wird auf den nächsten Werktag danach verschoben | Versand am Montag |
  | `allow_weekend` ("+Weekend") | keine Anpassung, Versand wie berechnet, auch am Wochenende | Versand am Sonntag |

  Welche Tage als "Wochenende" zählen, kommt aus einem zweiten Schlüssel `communication_send_days` (Startwert Mo–Fr) — bewusst getrennt vom Handling-Flag, falls später z.B. auch Feiertage ausgeschlossen werden sollen, ohne die Verschiebe-Logik neu zu bauen.
  - **Vorschlag als Startwert** (jederzeit im Admin änderbar, keine Vorgabe, kein Deployment nötig): `after_weekend` — entspricht der in der Schweiz gebräuchlichsten Bank-Konvention ("nächster Bankwerktag").
  - **Geltungsbereich:** gilt für alle automatisierten Erinnerungen in Abschnitt 11 (10-Tage-, 1-Tage- und Abo-Verlängerungs-Reminder) — ein einziger Schalter statt einer Einzelfall-Entscheidung pro Reminder-Typ, damit es nicht inkonsistent wird (z.B. an einem Samstag ein Reminder-Typ verschickt, ein anderer nicht). Ausnahme bleibt die sofortige Buchungsbestätigung (Abschnitt 3) — die geht immer sofort nach der Zahlung raus, unabhängig vom Wochentag, das ist kein zeitgesteuerter Reminder.
  - **Edge Case bei `after_weekend` und dem 1-Tag-Reminder** (siehe auch Abschnitt 13): findet ein Kurs an einem Montag statt, würde der eigentliche 1-Tag-Reminder auf Sonntag fallen — eine Verschiebung auf "nach dem Wochenende" (Montag) käme dann am Kurstag selbst oder zu spät an. In diesem Sonderfall weicht das System automatisch auf `before_weekend`-Verhalten aus (Freitag), egal welcher globale Wert eingestellt ist — sonst würde die Vorwarnung ihren Zweck verfehlen.
- **Wichtig, bewusst getrennt:** Das betrifft nur den *Versand* von Nachrichten. Die automatische Verlängerung/Zahlung selbst (Punkt 2 oben) läuft unabhängig vom Wochentag weiter — sonst würde sich der ganze Abo-Zyklus verschieben, nur weil ein Wochenende dazwischenliegt. Falls gewünscht, dass auch die Verlängerung selbst auf Werktage verschoben wird, bitte kurz Bescheid geben — das wäre eine separate, bewusste Entscheidung.

**Datenmodell (neu, in `03-DATA-MODEL.md` nachgezogen):**
- `subscriptions`: `auto_renew boolean` (Default `true`), `renewal_reminder_sent_at` (nullable), `cancelled_at` (nullable — wann fristgerecht gekündigt wurde), `renewed_into_subscription_id` (nullable, → `subscriptions` — verweist auf den durch Verlängerung entstandenen Folgezyklus), `stripe_payment_method_id` (gespeichertes Zahlungsmittel für die automatische Anschlusszahlung), `upsell_reward_label` (neu, 2026-08-19, nullable — eingefrorener Text des angenommenen Upsell-Angebots), `upsell_reward_fulfilled_at` (neu, nullable — Admin markiert manuell, sobald ein nicht-monetärer Bonus geliefert wurde; bleibt leer bei reinen Preisrabatten, die automatisch über den Preis abgewickelt werden).
- `course_series`: `renewal_upsell_label` (neu, 2026-08-19, freier Text, admin-editierbar — das aktuell gültige Angebot, egal welcher Art), `renewal_upsell_discount_pct` (neu, nullable — nur gesetzt, wenn das Angebot tatsächlich ein Preisrabatt ist; bleibt leer bei Sachboni, dann ist `renewal_upsell_label` reine Information ohne automatische Preiswirkung), `renewal_reminder_days_before` (neu, 2026-08-19, nullable — Serie-spezifische Vorlaufzeit, `null` = globaler Default aus `app_settings`).
- Neue, generische Tabelle **`app_settings`** (neu, 2026-08-19): plattformweite, admin-editierbare Standardwerte — Schlüssel/Wert statt Hardcoding, siehe `03-DATA-MODEL.md` Abschnitt 2.6.
- `reminders_log`: neuer Wert für `type` (`abo_renewal_upsell`), plus neues Feld `subscription_id` (nullable, → `subscriptions`) — dieser Reminder hängt an einem Abo, nicht an einer einzelnen Buchung.

**Bitte zur Kenntnis nehmen (kein Code-Punkt, sondern ein Hinweis):** Damit die automatische Anschlusszahlung ohne erneute Karteneingabe funktioniert, muss die Zahlungsmethode beim Erstkauf sicher bei Stripe hinterlegt werden (nicht bei uns gespeichert). Schlägt eine automatische Zahlung fehl (abgelaufene Karte, 3-D-Secure-Pflicht), bekommt die Familie eine E-Mail mit Zahlungslink; das Abo bleibt bis zur Zahlung in einem Wartezustand, statt automatisch neue Termine zu blockieren. Das ist Standard-Vorgehen bei Abo-Diensten, braucht aber eine klare Klausel in den AGB (automatische Verlängerung + jederzeitiges Kündigungsrecht). **Geklärt (Danny, 2026-08-19):** dieser Passus wird direkt im bestehenden `legalDocument`-Schema in Sanity gepflegt (`03-DATA-MODEL.md` Abschnitt 1) — genau wie jede andere AGB-Änderung, versioniert, kein Code-Deployment nötig. Kein neuer Mechanismus, die bestehende Struktur deckt das bereits ab.

## 9. Stornierung & Rückerstattung

Gilt pro einzelnem Termin (Einzelbuchung oder Teil eines Abos) — abhängig von Tagen vor `course_instances.start_at`.

**Gestaffelte Regel, admin-editierbar über `cancellation_policy_tiers`, Seed-Werte:**

| Zeitpunkt der Stornierung | Rückerstattung |
|---|---|
| Mehr als 30 Tage vor Kursbeginn | 100% |
| 20–30 Tage vor Kursbeginn | 50% |
| Weniger als 20 Tage vor Kursbeginn | 0%, **ausser mit Arztzeugnis** |

Der zum Stornozeitpunkt gültige Prozentsatz wird pro Buchung in `bookings.cancellation_refund_pct` eingefroren.

**Arztzeugnis-Fall:** immer ein manueller Kulanzfall — Admin prüft, trägt manuell ein, landet im `audit_log`.

**Self-Service-Flow (im Client-Konto, Abschnitt 4, nach normalem Login):**
1. Familie öffnet "Buchungen", wählt die zu stornierende Buchung.
2. System zeigt sofort den zutreffenden Rückerstattungs-Prozentsatz.
3. Einfache Schritt-für-Schritt-Bestätigung.
4. Letzter Schritt: **auszahlen** (`refunds.outcome = refunded`) oder **spenden** (`refunds.outcome = donated`).

## 10. Warteliste

Wird ein Platz frei, erhalten **alle** Familien auf der Warteliste gleichzeitig eine Benachrichtigung — First Come First Served. Kapazitätsprüfung läuft transaktionssicher (Abschnitt 13). Gilt für jeden freiwerdenden Platz, auch den durch eine nicht verlängerte Abo (Abschnitt 8).

## 11. Erinnerungen & Kommunikation (Resend)

| `reminders_log.type` | Trigger | Kanal |
|---|---|---|
| `confirmation` | sofort nach erfolgreicher Buchung | E-Mail (+ ICS-Anhang) |
| `reminder_10d` | 10 Tage vor `course_instances.start_at` | E-Mail |
| `reminder_1d` | 1 Tag vor `start_at` | E-Mail, optional SMS falls `families.sms_opt_in = true` |
| `abo_renewal_upsell` (neu) | X Tage vor dem letzten Termin des aktuellen Abo-Zyklus (X admin-editierbar, Abschnitt 8) | E-Mail, optional SMS falls `families.sms_opt_in = true` |

Der Kalender aus Abschnitt 2 (`course_instances.start_at`) ist die einzige Quelle für diese Trigger. Alle Trigger laufen über eine geplante Supabase Edge Function (täglicher Cron) — derselbe Job löst auch die automatische Abo-Verlängerung aus (Abschnitt 8). **Neu (2026-08-19):** `reminder_10d`, `reminder_1d` und `abo_renewal_upsell` respektieren zusätzlich `app_settings.communication_weekend_handling` (`before_weekend`/`after_weekend`/`allow_weekend`, Details Abschnitt 8) — fällt der berechnete Versandtag auf einen Tag aus `communication_send_days`, wird er je nach Einstellung vor- oder nachgezogen oder unverändert gelassen. `confirmation` ist davon ausgenommen und geht immer sofort raus.

## 12. Datenmodell-Ergänzungen (bereits in `03-DATA-MODEL.md` nachgezogen)

- **`course_series`**: keine Preisfelder mehr, dafür `fomo_enabled`, `scarcity_seats_threshold`, `renewal_upsell_label`/`renewal_upsell_discount_pct` (neu), `renewal_reminder_days_before` (neu).
- Neue, generische Tabelle **`app_settings`** (neu, Abschnitt 8) — plattformweite admin-editierbare Standardwerte (u.a. `renewal_reminder_days_before_default`, `communication_send_days`, `communication_weekend_handling`, `scarcity_seats_threshold_default`).
- **`course_instances`**: `price_cents` ersetzt durch `price_override_cents` (nur für manuelle Ausnahmen).
- Neue Tabelle **`price_tiers`** — dynamische, admin-editierbare Preisstaffel pro Serie und `plan_type`.
- **`bookings`**/**`subscriptions`**: neu mit `price_paid_cents` (eingefrorener Preis zum Buchungszeitpunkt).
- **`subscriptions`** (neu, Abschnitt 8): `auto_renew`, `renewal_reminder_sent_at`, `cancelled_at`, `renewed_into_subscription_id`, `stripe_payment_method_id`, `upsell_reward_label`, `upsell_reward_fulfilled_at`.
- **`reminders_log`** (neu, Abschnitt 8): `subscription_id`, Wert `abo_renewal_upsell` für `type`.
- Bereits aus v0.3: `course_series`/`course_instances`-Serienstruktur, `cancellation_policy_tiers`, `bookings.cancellation_refund_pct`, `refunds.outcome`.

## 13. Edge Cases

- **Zu wenig künftige Termine für die gewählte Abo-Grösse:** Option wird nicht angeboten, Admin muss zuerst weitere Termine anlegen (Abschnitt 2). Gilt auch für die automatische Verlängerung (Abschnitt 8): reichen die künftigen Termine der Serie nicht aus, wird kein automatischer Zyklus gebucht, die Familie erhält stattdessen eine Info-Mail statt eines stillen Fehlschlags.
- **Preisänderung während des Checkouts:** die Preisstaffel wird beim Öffnen der Buchungsseite fixiert und für die Dauer der Checkout-Session gehalten (dieselbe kurze Reservierung wie bei der Kapazitätsprüfung) — niemand zahlt einen anderen Preis, als ihm angezeigt wurde.
- **Doppelbuchung:** Unique Constraint `child_id + course_instance_id` bei Status `confirmed`/`pending`/`waitlist`.
- **Race Condition bei Kapazität:** Prüfung/Reservierung innerhalb derselben DB-Transaktion wie die Stripe-Checkout-Session.
- **Abo-Kauf mit Storno der ersten Buchung sofort danach:** einzelne Buchung folgt normalen Stornoregeln, übrige Termine bleiben gebucht.
- **Automatische Zahlung schlägt fehl** (Abschnitt 8): kein automatischer Buchungs-Block, Familie erhält Zahlungslink-Mail, Abo bleibt im Wartezustand statt Termine ohne Zahlung zu blockieren.
- **1-Tag-Reminder würde durch `after_weekend`-Verschiebung zu spät ankommen** (Abschnitt 8, neu 2026-08-19): findet der Kurs an einem Montag statt, fiele der 1-Tag-Reminder auf Sonntag — bei globaler Einstellung `after_weekend` würde er sonst auf Montag (Kurstag) rutschen. Sonderregel: in diesem Fall wird immer auf `before_weekend` (Freitag) ausgewichen, unabhängig vom globalen Wert, damit die Vorwarnung ihren Zweck nicht verfehlt.
- **Kind wechselt Familie / Erfassungsfehler:** Korrektur nur über `apps/admin`.

## 14. Admin-Eingriffe (Vorgriff auf `07-MODULE-CRM.md`)

Admin mit Permission `crm` sieht/storniert Buchungen, pflegt den Kurs-Kalender (Abschnitt 2), markiert nicht-monetäre Upsell-Boni als geliefert (`upsell_reward_fulfilled_at`). Admin mit Permission `finance` zusätzlich: Preisstaffeln (`price_tiers`), Stornoregeln (`cancellation_policy_tiers`), FOMO-Einstellungen (`fomo_enabled`, `scarcity_seats_threshold`), das Upsell-Angebot (`renewal_upsell_label`/`renewal_upsell_discount_pct`, neu) pro Serie sowie die plattformweiten `app_settings` (Vorlaufzeiten, Wochenend-Handling, neu) bearbeiten, Rückerstattungen/Kulanzfälle auslösen. Jede Aktion landet im `audit_log`.

## 15. Offene Punkte — bitte kurz gegenlesen

1. ~~Reihenfolge Kurs-Erstellungs-Workflow~~ — **angenommen wie vorgeschlagen** (Danny hat mit "next" weitergemacht, ohne Einwand): schlanke interne Version schon in Phase 2, volle Admin-Politur erst Phase 4.
2. ~~Scarcity-Schwellenwert-Default~~ — **bestätigt: 5** (siehe Abschnitt 6).
3. ~~Preisstaffel-Beispielzahlen~~ — **bestätigt**, reine Illustration, keine Vorgabe.
4. ~~Upsell-Angebot starr auf Rabatt-Prozentsatz~~ — **entschieden (Danny, 2026-08-19): bleibt dynamisch/frei**, kein fixer Rabattsatz. `course_series.renewal_upsell_label` trägt einen beliebigen Angebotstext (Rabatt, Sachbonus wie ein T-Shirt, oder etwas anderes), `renewal_upsell_discount_pct` ist optional und nur bei tatsächlichen Preisrabatten gesetzt. Die konkreten Angebote pro Serie legt Danny/Admin im Tagesbetrieb fest, das ist keine Planungsfrage mehr.
5. ~~Genauer Verlängerungszeitpunkt~~ — **bestätigt (Danny, 2026-08-19): "Tag nach dem letzten Termin des Zyklus"**, wie vorgeschlagen (Abschnitt 8). Vorlaufzeit ("X Tage vorher") ist jetzt admin-editierbar statt fix 5 Tage (global über `app_settings`, pro Serie überschreibbar).
6. ~~AGB-Klausel automatische Verlängerung~~ — **entschieden (Danny, 2026-08-19): Text kommt ins bestehende `legalDocument`-Schema in Sanity**, wie jede andere AGB-Anpassung — kein neuer Mechanismus nötig, kein Hardcoding. Der eigentliche juristische Wortlaut bleibt trotzdem offen (kein Teil dieses technischen Dokuments), aber die Ablage-Frage ist geklärt.
7. ~~Wochenend-Handling für automatisierte Erinnerungen~~ — **entschieden (Danny, 2026-08-19): als Flag lösen, analog zur Bank-Value-Date-Konvention.** `app_settings.communication_weekend_handling` mit den drei Werten `before_weekend`/`after_weekend`/`allow_weekend` (Abschnitt 8), gilt einheitlich für alle Reminder-Typen. Startwert-Vorschlag `after_weekend`, jederzeit im Admin änderbar — keine Planungsfrage mehr, reine Betriebseinstellung.

Alle Punkte geklärt — Dokument abgeschlossen.

---
*Nächster Schritt: `08-MODULE-FINANCE.md` final gegenlesen lassen, danach ist der komplette Kern-Fahrplan durch.*
