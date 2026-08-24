---
title: Somos United — Modul Finance & Personaldossier (Admin-App)
version: 0.3
status: Entwurf zur Freigabe durch Danny
date: 2026-08-22
audience: Claude Code (Umsetzung)
depends_on: 00-MASTER-PLAN.md Abschnitte 3 (Phase 5) & 6, 01-ARCHITECTURE.md Abschnitt 4, 03-DATA-MODEL.md Abschnitte 2.1 & 2.4-2.5, 05-MODULE-BOOKING.md, 06-MODULE-TRAINER.md, SECURITY.md
---

# Modul Finance & Personaldossier

Vertieft `00-MASTER-PLAN.md` Phase 5 — der Finance-Bereich von `apps/admin`, jetzt erweitert um ein vollständiges Personaldossier (HR), wie von Danny gefordert. Aktiviert damit auch die echte Abrechnungs-Ansicht in der Trainer-App, die in `06-MODULE-TRAINER.md` Abschnitt 1 bisher nur als Platzhalter beschrieben war. Betrifft die Supabase-Tabellen `trainer_pay_rates`, `trainer_documents`, `payroll_deduction_types`, `payroll_statements`, `payroll_line_items`, `annual_tax_statements`, `invoices`, `expenses`, `venue_rents`, `refunds`, `cost_centers`, `locations`, `timesheets`.

## 0. Änderungen zu v0.1 (Feedback von Danny, 2026-08-18) und v0.2 (Nachtrag Danny, 2026-08-22)

1. **Lohnansätze sind eine Historie, kein fixer Wert** — Danny hat ein konkretes Beispiel gegeben (1.1.–31.8.2026 CHF 30/Stunde, ab 1.9.2026 CHF 1000/Monat **netto**). Feste Felder auf `trainers` (aus v0.1) sind dafür ungeeignet, ersetzt durch `trainer_pay_rates` mit Gültigkeitszeitraum.
2. **Personaldossier/HR-Tool:** Dokumente wie Strafregisterauszug, Arbeitsvertrag, Vereinbarungen werden pro Trainer verwaltet — neu: `trainer_documents`.
3. **Abzüge (AHV etc.) leben in der DB**, nicht im Code — neu: `payroll_deduction_types`, admin-editierbar, ebenfalls mit Gültigkeitszeitraum.
4. **Automatisierung ausdrücklich gewünscht** ("Automatisation!") — Lohnabrechnungen UND Lohnausweise (Jahres-Steuerauszüge) sollen automatisch erstellt und verschickt werden, nicht nur die Abrechnungen.
5. **Saalmieten werden am Location-Eintrag hinterlegt**, nicht separat erfasst — Automatisierung analog zur Payroll.
6. **Grundsatz "no hardcoding"** gilt auch hier: Dokumenttypen und Abzugsarten sind freier Text/DB-Zeilen, keine festen Enums im Code.
7. **Neu (Nachtrag Danny, 2026-08-22): Abzüge sind nicht immer Prozentsätze.** Danny hat konkrete Schweizer Beispiele genannt — AHV/IV/EO 5.3%, ALV 1.1%, Pensionskasse (je nach Plan), Nichtbetriebsunfall (NBU) 0.355%, UVG-Zusatz 0.0079%, Krankentaggeld (KTG, je nach Plan) 0.36% sind alles Prozentsätze, aber GAV-Positionen oder Arbeitskleidung können ein **fixer Frankenbetrag** sein, kein Prozentsatz. `payroll_deduction_types` wurde entsprechend erweitert (`amount_type` `percentage`|`fixed_amount`, siehe `03-DATA-MODEL.md` Abschnitt 2.4), und die Netto→Brutto-Rückrechnung in Abschnitt 3 berücksichtigt jetzt beide Abzugsarten gleichzeitig. Danny hat diesen Grundsatz ausdrücklich zum **obersten Gebot** erklärt: kein Business-Wert, der sich ändern kann (Preis, Rabatt, Abzug, AGB-Text, Miete, Adresse, Telefonnummer), darf im Code stehen — alles lebt in der Datenbank bzw. im CMS und ist im Admin-App editierbar.

## 1. Der wichtigste Grundsatz bleibt

Die **Struktur** für Lohnansätze und Abzüge steht mit diesem Dokument. Die **tatsächlichen Zahlen** (welche Abzugsarten mit welchem Prozentsatz aktuell gelten) trägt Danny bzw. sein Treuhänder direkt in `payroll_deduction_types` ein, sobald Phase 5 ansteht — das ist jetzt eine reine Dateneingabe im Admin-App, keine Code-Änderung mehr. Damit ist die in `00-MASTER-PLAN.md` Abschnitt 6 verlangte "kurze Abstimmung zu den genauen Lohnansätzen" weiterhin nötig, aber sie betrifft nur noch Zahlen in einer Tabelle, nicht mehr die Architektur.

## 2. Personaldossier (HR)

Pro Trainer ein Dossier im Admin-App (Permission `users` — passt zur bestehenden Zuordnung "Mitarbeiter-Erfassung" aus `07-MODULE-CRM.md` Abschnitt 6):

- **Lohnansatz-Historie** (`trainer_pay_rates`): jede Zeile ein Gültigkeitszeitraum (`valid_from`/`valid_to`, `valid_to = null` heisst "aktuell gültig"). Neue Zeile bei einer Lohnänderung, alte Zeile bleibt für die Vergangenheit unverändert stehen — genau wie Dannys Beispiel (Stundenlohn bis 31.8., danach Monatslohn ab 1.9., zwei Zeilen, nicht eine überschriebene). Feld `amount_type` (`gross`/`net`) hält fest, ob der Betrag brutto oder netto vereinbart ist (Berechnung dazu in Abschnitt 3).
- **Dokumente** (`trainer_documents`): frei benennbare Dokumenttypen (Strafregisterauszug, Arbeitsvertrag, Vereinbarungen, was auch immer gebraucht wird — kein festes Enum, Admin trägt den Typ als Text ein). Pro Dokument: angefordert am, erhalten am (falls schon da), Ablaufdatum (falls das Dokument periodisch erneuert werden muss, z.B. Strafregisterauszug alle paar Jahre), die Datei selbst in einem privaten Storage-Bucket.
- **Self-Service-Ergänzung für Trainer:** in der Trainer-App (`06-MODULE-TRAINER.md`) sieht ein Trainer eine einfache Liste "Von dir angeforderte Unterlagen" und kann fehlende Dokumente direkt hochladen, statt sie per Mail hin- und herzuschicken — reduziert Aufwand auf beiden Seiten. Trainer sieht nur den Status (angefordert/erhalten), nicht die Lohnansatz-Historie (die bleibt bewusst nur für `users`/`finance` sichtbar, keine Selbstbedienung bei Lohndaten).

## 3. Lohnabrechnung — drei Modelle, mit Brutto/Netto

Trainer haben eines von drei `pay_model`-Werten, jetzt aus der aktuell gültigen Zeile in `trainer_pay_rates` gelesen (nicht mehr aus einem festen Feld):

- **`hourly`** (Stundenlohn): Summe der genehmigten `timesheets.hours` im Abrechnungszeitraum × `rate_cents` der zum jeweiligen Datum gültigen `trainer_pay_rates`-Zeile. Nur `approved_by`-gesetzte Stundenzettel zählen — offene werden im Vorschau-Schritt (Abschnitt 4) als "noch offen" markiert.
- **`monthly`** (Festanstellung): fixer Betrag pro Periode aus der aktuell gültigen Zeile.
- **`per_course`** (Pauschale pro Kurs): Satz × Anzahl im Zeitraum durchgeführter, zugewiesener `course_instances`.
- **Brutto vs. Netto:** ist `amount_type = gross`, ist der eingetragene Betrag der Ausgangspunkt, Abzüge (`payroll_deduction_types`) werden davon subtrahiert — sowohl die prozentualen als auch die fixen. Ist `amount_type = net` (Dannys Beispiel: CHF 1000/Monat netto), rechnet das System **rückwärts**: der Bruttobetrag wird so bestimmt, dass nach Abzug aller zum Zeitpunkt gültigen Abzüge (Prozentsätze **und** Fixbeträge) genau der vereinbarte Netto-Betrag herauskommt. Da Fixbeträge unabhängig vom Bruttobetrag sind, werden sie zuerst zum Netto addiert, bevor die Prozentsätze aufgelöst werden:

  **`brutto = (netto + Summe der Fixbeträge) ÷ (1 − Summe der Abzugsprozentsätze)`**

  Ohne Fixbeträge (Summe = 0) ist das exakt die bisherige, einfachere Formel — die Erweiterung bricht also nichts Bestehendes, deckt aber jetzt auch Fälle wie "CHF 50/Monat Arbeitskleidung" ab. Das ist eine in der Schweiz gängige "Nettolohnvereinbarung" — technisch unproblematisch, sobald die Abzüge in `payroll_deduction_types` eingetragen sind (Abschnitt 1).

  **Illustratives Rechenbeispiel** (rein zur Veranschaulichung der Formel — die tatsächlichen Sätze sind Dateneingabe, siehe Abschnitt 1, nicht Teil dieses Dokuments):

  | Abzugsart | `amount_type` | Wert |
  |---|---|---|
  | AHV/IV/EO | percentage | 5.3% |
  | ALV | percentage | 1.1% |
  | Nichtbetriebsunfall (NBU) | percentage | 0.355% |
  | UVG-Zusatz | percentage | 0.0079% |
  | Krankentaggeld (KTG) | percentage | 0.36% |
  | Pensionskasse | percentage | je nach Plan (Beispiel: 4%) |
  | Arbeitskleidung | fixed_amount | z.B. CHF 20/Monat |

  Bei einer Nettolohn-Vereinbarung von CHF 1000/Monat ergäbe das (Summe Prozentsätze ≈ 11.12%, Summe Fixbeträge = CHF 20): `brutto = (1000 + 20) ÷ (1 − 0.1112) ≈ CHF 1147.75`. Alle Werte in dieser Tabelle sind Platzhalter — die verbindlichen Sätze trägt Danny bzw. der Treuhänder in `payroll_deduction_types` ein (Abschnitt 1, Offene Punkte Abschnitt 12).

## 4. Ablauf einer Abrechnungsperiode

1. **Monatlich automatisch:** eine Supabase Edge Function erzeugt am 1. jedes Monats für den Vormonat pro aktivem Trainer einen `payroll_statements`-Entwurf (`status = draft`), unter Verwendung der zum jeweiligen Datum gültigen `trainer_pay_rates`- und `payroll_deduction_types`-Zeilen.
2. **Line Items für Transparenz:** pro Entwurf entstehen `payroll_line_items` — bei `hourly` eine Zeile pro genehmigtem Stundenzettel, bei `per_course` eine Zeile pro durchgeführtem Kurstermin, bei `monthly` eine einzelne Zeile. Grundlage für eine nachvollziehbare Abrechnung ("wofür genau bezahlt"), nicht nur ein nackter Endbetrag.
3. **Admin-Review (Permission `finance`):** offene Stundenzettel werden als Warnhinweis angezeigt. Admin kann `payroll_line_items` manuell ergänzen (z.B. Bonus, Korrektur).
4. **Freigabe:** Admin setzt `status = released`, PDF wird generiert. Erst dann sichtbar in der Trainer-App.
5. **Unveränderlich nach Freigabe:** Korrekturen laufen über eine neue, separat ausgewiesene Zeile in der Folgeperiode, nie rückwirkendes Überschreiben.

## 5. Jahres-Lohnausweis (automatisch)

Danny wünscht ausdrücklich Automatisierung nicht nur für die monatliche Abrechnung, sondern auch für den **Lohnausweis** (das amtliche Schweizer Formular für die Steuererklärung, das jede/r Arbeitgeber:in jährlich ausstellen muss — das ist vermutlich mit "Steuerauszüge" gemeint):

- Zu Jahresbeginn (Vorschlag: Mitte Januar, sobald der Dezember-Lohnlauf abgeschlossen ist) fasst eine Supabase Edge Function alle `released`-`payroll_statements` eines Trainers aus dem Vorjahr zusammen, erzeugt das Lohnausweis-PDF nach dem Schweizer Standardformular und legt es in `annual_tax_statements` ab.
- Automatischer Versand per E-Mail an den Trainer, zusätzlich abrufbar im Self-Service-Bereich der Trainer-App (Ergänzung zu `06-MODULE-TRAINER.md` Abschnitt 1: "Abrechnungen" zeigt künftig auch den Jahres-Lohnausweis, sobald verfügbar).
- **Genaues Versanddatum ist eine offene Detailfrage** (Abschnitt 11) — die gesetzliche gängige Praxis liegt meist vor der Steuererklärungsfrist Ende März, das genaue Datum am besten kurz mit dem Treuhänder abstimmen, gleicher Kanal wie die Abzugsprozentsätze.

## 6. Spesen (Expenses)

- Trainer oder Admin reicht eine Spesenposition ein (`expenses`: Betrag, Kategorie, Beleg-Foto/PDF via `receipt_url`).
- Admin mit Permission `finance` genehmigt oder lehnt ab.
- Genehmigte Spesen fliessen in die Kostenstellen-Auswertung (Abschnitt 8), nicht in `payroll_statements` — Spesenersatz ist keine Lohnzahlung, bleibt buchhalterisch getrennt.

## 7. Saalmieten (am Location-Eintrag)

**Neu (Danny):** Miet-Konditionen werden direkt am Veranstaltungsort hinterlegt, nicht separat erfasst: `locations.rent_amount_cents`, `rent_cycle` (z.B. "monthly", freier Text statt starrem Enum), `rent_active`. Ein Ort ohne Mietkosten lässt diese Felder einfach leer.

- Dieselbe monatliche Edge Function, die Payroll-Entwürfe erzeugt (Abschnitt 4), legt für jeden Ort mit `rent_active = true` automatisch einen `venue_rents`-Entwurf für die Periode an.
- Admin bestätigt/passt an (z.B. bei einmaligen Zusatzkosten), dann Status auf bezahlt/verbucht — gleiches Freigabe-Prinzip wie bei Payroll, nur ohne den Umweg über eine eigene "Entwurf"-Tabelle, da `venue_rents.status` das bereits abdeckt.
- Ändert sich die Miete, wird `rent_amount_cents` am Location-Eintrag direkt angepasst — der nächste automatische Lauf verwendet den neuen Wert. Für rückwirkende Nachvollziehbarkeit reicht hier (anders als bei Löhnen) die einzelne `venue_rents`-Zeile pro Periode, eine eigene Historie-Tabelle ist nicht nötig, da jede Periode ohnehin ihre eigene Zeile bekommt.

## 8. Kostenstellen & P&L

- `cost_centers` bündelt `invoices`/`expenses`/`venue_rents` für eine Gewinn-/Verlust-Auswertung pro Kostenstelle und Periode.
- **Bewusst kein Ampelsystem hier** — anders als das CRM-Dashboard (`07-MODULE-CRM.md` Abschnitt 5), das für den schnellen Überblick vereinfacht, zeigt die Finance-Ansicht echte Zahlen, weil hier Genauigkeit vor Verständlichkeit geht.
- CSV-Export für Kostenstellen-Auswertungen, Rechnungslisten und Lohn-Summen (bereits in `01-ARCHITECTURE.md` Abschnitt 4.4 als erlaubte Ausnahme vorgesehen). Jeder Export ein `audit_log`-Eintrag.

## 9. Rechnungen, Quittungen & Rückvergütungen (Verweis)

- **Rechnungen/Quittungen** (`invoices`): Familien-Rechnungen bereits über Client-Konto (`05-MODULE-BOOKING.md` Abschnitt 4) und CRM-Kundenportfolio (`07-MODULE-CRM.md` Abschnitt 2) sichtbar — hier nur die Finance-seitige Verwaltung (Status, Fälligkeit, Kostenstellen-Zuordnung).
- **Rückvergütungen** (`refunds`): vollständig in `05-MODULE-BOOKING.md` Abschnitt 8 spezifiziert, hier keine Wiederholung.
- **Zahlungsabgleich:** täglicher Abgleich Stripe ↔ intern, Auffälligkeiten werden gelistet, nie automatisch korrigiert.

## 10. Aufbewahrung

`invoices`/`payroll_statements`/`annual_tax_statements` bleiben 10 Jahre unangetastet (OR Art. 958f), unabhängig vom Anonymisierungs-Status. Für `trainer_documents`/`trainer_pay_rates` (Personalakten nach Ende eines Arbeitsverhältnisses) gibt es keine automatische Regel im Schema — Frist wird in Abschnitt 11 als offener Punkt geklärt, danach hier ergänzt.

## 11. Edge Cases

- **Lohnansatz ändert sich mitten in einer Abrechnungsperiode:** die Periode wird anhand der `valid_from`/`valid_to`-Grenzen automatisch aufgeteilt — zwei `payroll_line_items` mit je anteiliger Berechnung statt einer vermischten Zahl, keine manuelle Nacharbeit nötig.
- **Netto-Lohn, aber Abzugsprozentsätze ändern sich rückwirkend gültig** (selten, aber möglich bei Gesetzesänderungen): betrifft nur künftige Berechnungen, bereits freigegebene Abrechnungen werden nicht neu gerechnet (gleiches Prinzip wie überall: freigegeben heisst fixiert).
- **Dokument läuft ab** (`trainer_documents.expires_at` überschritten): Personaldossier zeigt einen Hinweis, aber keine automatische Sperrung des Trainer-Zugangs — das wäre eine harte Konsequenz, die Admin bewusst manuell entscheiden soll, nicht das System automatisch.
- **Kurs fällt aus, `per_course`-Trainer war zugewiesen:** keine automatische Auszahlung, Admin kann bei Bedarf manuell eine `payroll_line_items`-Zeile mit `source_type = manual` ergänzen.

## 12. Offene Punkte — bitte gegenlesen

1. ~~Datenmodell für Abzüge~~ — **erledigt (2026-08-22):** `payroll_deduction_types` unterstützt jetzt sowohl Prozentsätze als auch Fixbeträge (`amount_type`), siehe Abschnitt 0/3. **Weiterhin offen bleibt die reine Zahlen-Lücke:** die tatsächlich gültigen Sätze/Beträge (`payroll_deduction_types`, Abschnitt 1) — braucht kurze Abstimmung mit Danny/Treuhänder vor Phase-5-Go-live. Das ist ab jetzt reine Dateneingabe im Admin-App, keine Architektur-Frage mehr.
2. **Lohnausweis-Versanddatum** (Abschnitt 5): genauer Zeitpunkt im Januar/Februar — am besten zusammen mit Punkt 1 klären.
3. **Aufbewahrungsfrist Personaldossier** (Abschnitt 10): wie lange bleiben `trainer_documents`/`trainer_pay_rates` nach Ende eines Arbeitsverhältnisses gespeichert?

---
*Nächster Schritt: Danny liest gegen (v.a. Abschnitt 1/12), dann ist der Kern-Fahrplan aus `00-MASTER-PLAN.md` Abschnitt 8 vollständig durch.*
