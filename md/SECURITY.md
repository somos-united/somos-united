---
title: Somos United — Security
version: 0.1
status: Freigegeben durch Danny am 2026-08-22
date: 2026-08-22
audience: Claude Code (Umsetzung) + Danny (Owner/Consultant-Review)
scope: Gilt quer zu allen drei Apps und allen Phasen ab Phase 0. Ergänzt 01-ARCHITECTURE.md.
---

# Security

Dieses Dokument bündelt alle sicherheitsrelevanten Entscheidungen an einem Ort, statt sie über mehrere Dokumente zu verstreuen — Konsistenz-Check, damit nichts vergessen geht. Ausgangspunkt: Danny hat gefragt, ob ein zusätzlicher Security-Layer nötig ist. Antwort: ja, zwei — plus ein paar Punkte, die noch nicht geregelt waren.

## 1. Zugriffs-Ebenen (Defense in Depth)

Für Admin- und Trainer-App gilt neu ein mehrstufiger Zugriff, nicht nur der App-Login:

1. **Cloudflare WAF** — vor allen drei Apps, filtert offensichtlichen Angriffs-Traffic.
2. **Cloudflare Access (neu, Zero Trust)** — nur vor `admin.somosunited.ch` und `team.somosunited.ch`. Nur eingeladene E-Mail-Adressen kommen überhaupt bis zur Login-Seite; alle anderen sehen gar nichts. Kostenlos bis 50 Nutzer:innen — für unsere Teamgrösse reicht das Free-Tier locker.
3. **App-Login (Supabase Magic Link)** — wie in `01-ARCHITECTURE.md` beschrieben.
4. **TOTP-Zwei-Faktor-Pflicht (neu)** — zusätzlich zum Magic Link, für **admin** und **trainer**, umgesetzt über **Supabase Auths native MFA-Funktion** (kein Eigenbau, pro Rolle erzwingbar). Begründung: Magic Link allein = "was du hast" (Zugriff aufs E-Mail-Postfach). Bei Finanz- und Kinderdaten reicht ein einzelner Faktor nicht. Für **Clients** (Eltern) bleibt es bewusst bei Magic Link only — dort zählt niedrige Hürde mehr, die Daten sind pro Familie ohnehin nur die eigenen.
5. **Row-Level-Security + granulare Permissions** — wie in `01-ARCHITECTURE.md` Abschnitt 3–4.
6. **Audit-Log** — jeder Zugriff auf Client-Kontaktdaten wird protokolliert (siehe `01-ARCHITECTURE.md` Abschnitt 4.4).

Kiosk-Geräte (Abschnitt 4.3 in `01-ARCHITECTURE.md`) sind von der 2FA-Pflicht ausgenommen (kein persönlicher Login), aber physisch abgesichert (Tablet-Kiosk-Modus) und jederzeit remote widerrufbar, falls ein Gerät verloren geht oder gestohlen wird.

## 2. Datenstandort

- **Supabase-Projekt-Region: Zürich (`eu-central-2`).** Alle operativen/personenbezogenen Daten (Client-DB, Trainer-Dossiers, Finance, Buchungen) liegen damit physisch in der Schweiz — ein starkes Argument gegenüber Eltern und Verein.
- **Sanity:** Content liegt aktuell fix in Belgien (EU), keine Regionwahl möglich, auch nicht auf höheren Plänen. Unkritisch: dort liegt nur redaktioneller Content (Kurstexte, Seiten), keine Personendaten.
- **Vercel:** Frontend/Edge läuft global verteilt (CDN), Server-Functions können auf eine EU-nahe Region gepinnt werden — Details in `02-DEPLOYMENT.md`.
- **Twilio (SMS/WhatsApp):** US-Anbieter, keine Schweizer Datenresidenz — einzige bewusste Ausnahme zur sonstigen CH/EU-Linie dieses Projekts. Verarbeitete Daten sind auf Telefonnummer + kurzen Nachrichtentext während des Versands beschränkt, keine dauerhafte Personendaten-Speicherung. Abwägung (Preis/WhatsApp-Support vs. Konsistenz) und der jederzeit mögliche Teilwechsel (nur SMS, kein WhatsApp) auf den Schweizer Anbieter SMSup.ch stehen in `07-MODULE-CRM.md` Abschnitt 3.

## 3. Zahlungen (PCI)

Wir nutzen ausschliesslich **Stripe Checkout** (Stripes gehostete Zahlungsseite) — nie eigene Kreditkarten-Eingabefelder bauen. Damit bleiben wir im niedrigsten PCI-Compliance-Aufwand (SAQ A), Stripe trägt die Kartenverarbeitung.

## 4. Backup & Wiederherstellung

- Supabase: automatische tägliche Backups + Point-in-Time-Recovery aktivieren, sobald echte Kundendaten live gehen (Feature ist planabhängig — im Free-/Starter-Tier eingeschränkt, vor Phase-2-Launch prüfen und ggf. Plan upgraden).
- Vor dem ersten Produktiv-Go-Live: ein **Restore einmal wirklich testen** (nicht nur Backup-Häkchen setzen).
- Sanity-Content: Versionshistorie ist im CMS selbst eingebaut (kein Zusatzaufwand).

## 5. Aufbewahrung & Löschung

Zwei Fristen, die sich nicht widersprechen dürfen:

- **Buchhaltungsdaten:** 10 Jahre Aufbewahrungspflicht nach Schweizer Obligationenrecht (Art. 958f OR) — Rechnungen, Zahlungen, Lohnabrechnungen.
- **Personendaten (Kontaktdaten, Kinder-Infos wie Allergien):** sollen löschbar sein, wenn eine Familie das wünscht oder die Beziehung endet. Vorschlag: automatische Lösch-Erinnerung 2 Jahre nach letzter Aktivität, finale Entscheidung liegt bei Danny/Verein.
- **Lösung:** Finanzdaten werden bei Löschung eines Kontos **anonymisiert statt komplett gelöscht** (Beträge/Belege bleiben für die Buchhaltungspflicht, Name/Kontakt wird entfernt). Genaue Regeln kommen in `03-DATA-MODEL.md`.

## 6. Vorgehen bei einer Datenpanne

Bevor etwas passiert, nicht erst danach festlegen:

- Klarer erster Ansprechpartner intern (Danny + technische Verantwortung) bei Verdacht auf eine Datenpanne.
- Bei hohem Risiko für Betroffene besteht in der Schweiz eine Meldepflicht an den EDÖB (Eidg. Datenschutz- und Öffentlichkeitsbeauftragter) — Frist beachten, sobald ein Fall eintritt, nicht erst dann recherchieren.
- Eine einfache Kommunikationsvorlage (an betroffene Familien) liegt bereit, bevor sie gebraucht wird.

## 7. Externe Integration: Notion → Sanity

Neu (siehe `01-ARCHITECTURE.md` Abschnitt 8): Notion als zusätzliches Erfassungs-Tool für redaktionellen Content. Sicherheitsrelevant:

- **Least Privilege:** Der Notion-Integration-Token wird nur mit der einen dafür vorgesehenen Datenbank geteilt, nie mit dem ganzen Workspace — technisch von Notion so vorgesehen (Integrationen sehen nur explizit freigegebene Inhalte).
- **Kein Auto-Publish:** Was aus Notion kommt, landet immer als Draft in Sanity, nie direkt live. Eine Person prüft vor Veröffentlichung.
- **Signatur-Prüfung:** Eingehende Webhook-Events werden per HMAC-Signatur verifiziert, bevor irgendetwas verarbeitet wird — verhindert gefälschte Aufrufe an den Sync-Endpunkt.
- **Secrets:** Notion-Token folgt derselben Regel wie alle anderen Secrets (Abschnitt 5 in `01-ARCHITECTURE.md`) — nur in Vercel/Supabase Environment Variables, nie im Repo.
- **Keine Personendaten über Notion:** Diese Anbindung ist ausschliesslich für redaktionellen Content gedacht — Kontaktdaten, Kinder-Infos, Zahlungsdaten haben in Notion nichts verloren. Diese Grenze bewusst einhalten, sonst verwässert sich die klare Trennung Sanity/Supabase/Notion.

## 8. Vor jedem Produktiv-Go-Live (Checkliste, wächst mit jeder Phase)

- Snyk/Socket-Scan grün (laufend, siehe `01-ARCHITECTURE.md`).
- Zusätzlich vor **Phase 2** (erste echten Kundendaten): externer Security-Review/Penetrationstest — Dependency-Scan allein reicht nicht, das prüft nur bekannte Schwachstellen in Libraries, nicht die eigene Logik.
- RLS-Policies stichprobenartig gegengetestet (kann Nutzer X wirklich nicht auf Daten von Y zugreifen?).
- Backup-Restore erfolgreich getestet (Abschnitt 4).

---
*Bezug: ergänzt `01-ARCHITECTURE.md` Abschnitte 3–4 und `00-MASTER-PLAN.md` Abschnitt 0 (Leitplanke "Security First"). Wird bei jeder neuen Phase (siehe Master-Plan Abschnitt 3) auf Vollständigkeit geprüft.*
