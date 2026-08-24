---
title: Somos United — Deployment & Account-Governance
version: 0.1
status: Freigegeben durch Danny am 2026-08-22
date: 2026-08-22
audience: Claude Code (Umsetzung) + Danny (Owner/Consultant-Review)
depends_on: 00-MASTER-PLAN.md, 01-ARCHITECTURE.md, SECURITY.md
---

# Deployment & Account-Governance

Technische Vertiefung von `00-MASTER-PLAN.md` Abschnitt 0.6 (volle Eigenständigkeit) und Abschnitt 7 (Changelog). Regelt: welche Accounts neu entstehen, wie Staging/Production funktionieren, und wie jeder Schritt dokumentiert wird.

## 1. Domain

**`somosunited.ch`** — wird von Danny in den nächsten Tagen registriert. Bis dahin arbeiten alle Umgebungen mit den automatischen Vercel-Vorschau-URLs (`*.vercel.app`); Subdomain-Struktur (`admin.somosunited.ch`, `team.somosunited.ch`) wird aktiviert, sobald die Domain steht und bei Cloudflare als DNS-Zone eingerichtet ist.

## 2. Konten & Zugangsdaten (neu, dediziert)

Grundsatz aus dem Master-Plan: **jede App, jede API, jedes Tool bekommt einen eigenen, neuen Account unter Somos United** — nichts läuft über private Accounts oder die Agentur.

- **Account-Halter-E-Mail:** `tech@somosunited.ch` (neu einzurichten über CYON, sobald die Domain steht). Wird für alle Service-Signups unten verwendet — bei Bedarf jederzeit umbenennbar, das ist ein Vorschlag, kein fixer Zwang.
- **Passwort-Manager: Bitwarden Free Organization** (bestätigt, muss gratis sein). Faktencheck dazu: Proton Pass fällt raus — im Free-Plan sind dort 0 Vaults teilbar, nicht mal mit einer zweiten Person. Bitwarden Free Organization erlaubt Teilen mit genau 1 weiteren Person (2 Personen total, dauerhaft gratis) — reicht, da nur 2 Personen (Danny + 1) direkten Zugriff brauchen. Falls später mehr Personen Zugriff brauchen: Bitwarden Families (~40 CHF/Jahr, bis 6 Personen) ist der günstige nächste Schritt, kein Wechsel des Tools nötig.
- **Bewusst kein Eigenbau:** Ein selbst gebauter Zugangsdaten-Tresor im Admin-Teil von somosunited wurde erwogen, davon rate ich ab. Zwei Gründe: Henne-Ei-Problem — die Zugänge zu Supabase/Vercel/GitHub müssten existieren, bevor der Admin-Teil überhaupt gebaut und live ist, müssten also vorher schon irgendwo liegen. Und: läge der Tresor selbst auf unserer eigenen Infrastruktur, hinge der Zugriff auf alle anderen Zugangsdaten am Leben genau der einen App, die er eigentlich absichern soll — fällt Supabase aus oder wird kompromittiert, sind alle anderen Passwörter mitbetroffen. Ein unabhängiges, dediziertes Tool ist bewusst getrennte Infrastruktur.
- **Rechnungsadresse/Billing-Entität überall:** Verein Somos United (nicht Privatperson, nicht Agentur) — wichtig für Eigentumsfrage bei allen kostenpflichtigen Diensten.
- **2FA-Pflicht** auf jedem einzelnen der folgenden Accounts, nicht optional.

**Liste der neu anzulegenden Accounts** (Checkliste, wird in `memory/CHANGELOG.md` abgehakt sobald erledigt):

| Dienst | Account-Typ | Zweck |
|---|---|---|
| GitHub | Organisation `somos-united` (nicht privates Repo) | Code, CI/CD-Trigger |
| Vercel | Team-Account, verknüpft mit GitHub-Org | Hosting aller 3 Apps |
| Supabase | Organisation | DB, Auth, Edge Functions (Region Zürich) |
| Sanity | Organisation | CMS |
| Cloudflare | Account | DNS, WAF, Access |
| Stripe | Account (Verein als Rechtsträger) | Zahlungen |
| Notion | Workspace (dediziert, **nicht** geteilt mit anderen Projekten) | Content-Erfassung |
| Resend | Account | Transaktions-E-Mails |
| Snyk | Account/Org | Security-Scans (CI) |
| Socket | Account/Org | Security-Scans (CI) |
| Google | Search Console + Analytics, unter `tech@somosunited.ch` | KPIs im Admin-Dashboard |
| Bitwarden | Free Organization (2 Personen) | Aufbewahrung aller obigen Zugangsdaten |

Instagram/LinkedIn: keine neuen Accounts, sondern Anbindung der bestehenden Somos-United-Profile über offizielle API/App-Berechtigung (kein privater Zugriff via Passwort-Teilen).

## 3. Environments

- **`preview`** — automatisch bei jedem Pull Request (Vercel), eigene URL pro PR, nutzt Test-/Seed-Daten, nie echte Kundendaten (siehe `SECURITY.md` Abschnitt 4).
- **`staging`** — automatischer Deploy bei jedem Merge auf `main`. Zusätzlich durch Cloudflare Access geschützt (nur Team, siehe `SECURITY.md` Abschnitt 1) — ist inhaltlich ein Spiegel von Production, aber nicht öffentlich.
- **`production`** — **kein Auto-Deploy.** Wird bewusst manuell freigegeben (siehe Abschnitt 5), erst nachdem auf Staging getestet und von Danny (oder einer von ihm benannten Person) abgenommen wurde.

## 4. CI/CD-Pipeline (GitHub Actions + Vercel + Turborepo)

Bei jedem Pull Request:
1. Turborepo baut nur, was sich geändert hat (Remote Caching).
2. Lint + Typecheck + Tests müssen grün sein.
3. Snyk/Socket-Scan (siehe `SECURITY.md` Abschnitt 8) — blockiert bei kritischen Findings.
4. Vercel erstellt automatisch eine Preview-URL zum Gegenchecken.

Erst wenn all das grün ist, kann ein PR auf `main` gemergt werden → löst den Staging-Deploy aus.

## 5. Staging → Production (Release-Ablauf)

1. Auf Staging testen (Danny/Team prüfen die konkrete Änderung anhand der Preview- bzw. Staging-URL).
2. Bei Freigabe: Release-Tag setzen (z.B. `v0.3.0`), das löst den Production-Deploy aus — nie ein stiller Auto-Deploy.
3. Sofort danach: Eintrag in `memory/CHANGELOG.md` (Format Abschnitt 7).
4. Bei Problemen: Vercel-Rollback auf den vorherigen Production-Stand ist ein Klick (Instant Rollback) — Supabase-Migrationen werden deshalb grundsätzlich rückwärtskompatibel geschrieben (kein Feature-Release, der eine alte Version bricht).

## 6. Datenbank-Migrationen (Supabase)

- Migrationen liegen versioniert in `supabase/migrations/`, laufen automatisch beim Staging-Deploy.
- Production-Migrationen laufen nur zusammen mit einem Release-Tag (Abschnitt 5), nie manuell "schnell zwischendurch".
- Vor jeder Production-Migration: Backup-Zeitpunkt notieren (siehe `SECURITY.md` Abschnitt 4).

## 7. Changelog-Format (`memory/CHANGELOG.md`)

Ein Eintrag pro Release, neueste zuerst:

```
## v0.3.0 — 2026-09-01 — Production
Was: Buchungsflow für Phase 2 live geschaltet (Stripe Checkout, Bestätigungsmails)
Getestet auf Staging: 2026-08-30
Freigegeben von: Danny
Rollback-Referenz: v0.2.4
```

Ziel: Danny kann jederzeit ohne Code-Kenntnisse nachvollziehen, was wann auf Staging vs. Live lief.

## 8. Reihenfolge der Einrichtung (praktisch, für Claude Code)

1. Alle Accounts aus Abschnitt 2 anlegen, 2FA aktivieren, in den Passwort-Manager eintragen.
2. GitHub-Org + leeres Repo, Turborepo-Grundgerüst gemäss `01-ARCHITECTURE.md`.
3. Vercel-Team mit GitHub-Org verknüpfen, drei Projekte anlegen (web/admin/trainer), Preview-Deploys testen.
4. Supabase-Projekt (Region Zürich) + Sanity-Projekt anlegen, Env-Variablen gemäss `01-ARCHITECTURE.md` Abschnitt 5 setzen.
5. Cloudflare: Domain aufschalten (sobald registriert), WAF + Access konfigurieren.
6. Restliche Dienste (Stripe, Notion, Resend, Snyk, Socket, Google) anbinden.
7. Ersten Staging-Deploy auslösen, Checkliste in Abschnitt 2 als erledigt markieren.

---
*Nächster Schritt: Danny liest gegen (insbesondere Account-Halter-E-Mail und Passwort-Manager-Wahl), dann entsteht `03-DATA-MODEL.md`.*
