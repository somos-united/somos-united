---
title: Somos United — Architecture
version: 0.1
status: Freigegeben durch Danny am 2026-08-22
date: 2026-08-22
audience: Claude Code (Umsetzung)
depends_on: 00-MASTER-PLAN.md
---

# Architecture

Technische Vertiefung von `00-MASTER-PLAN.md`, Abschnitt 1. Dieses Dokument ist die verbindliche Referenz für Repo-Konventionen, Auth und Berechtigungen. Für Deployment/CI-Details siehe `02-DEPLOYMENT.md` (folgt), für das Datenschema `03-DATA-MODEL.md` (folgt).

## 1. Monorepo-Konventionen

- **Package Manager:** pnpm (Workspaces), gesteuert über Turborepo.
- **Node-Version:** aktuelle LTS, per `.nvmrc` im Repo-Root fixiert — jede Umgebung (lokal, CI, Vercel) nutzt dieselbe Version.
- **TypeScript strict** überall, kein `any` ohne Kommentar-Begründung.
- **Namenskonvention Packages:** `@somos/ui`, `@somos/config`, `@somos/lib`, `@somos/types` (Scope einheitlich, kein App-Name im Package-Namen).
- **Lint/Format:** ein gemeinsames ESLint- + Prettier-Preset in `packages/config`, von allen Apps referenziert — keine abweichenden Regeln pro App.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, …). Jeder Merge auf `main`, der auf Staging landet, erzeugt einen Eintrag in `memory/CHANGELOG.md` (Format folgt in `02-DEPLOYMENT.md`).
- **Kein Hardcoding:** Texte, Preise, Modul-Beschreibungen kommen aus Sanity; Konfigurationswerte (Feature-Flags, Locale-Liste) aus `packages/config`, nicht verstreut im Code.

## 2. Die drei Apps

| App | Zweck | Nutzer | Domain (Vorschlag) | Deploy |
|---|---|---|---|---|
| `apps/web` | Marketing-Site + Client-Bereich (Buchung, Konto) | Öffentlich + Clients | `somosunited.ch` | Eigenes Vercel-Projekt |
| `apps/admin` | Backoffice: CRM, Finance, User-DB, MA-Erfassung | Admin/SuperUser (permission-gated) | `admin.somosunited.ch` | Eigenes Vercel-Projekt, kein öffentlicher Zugang (siehe 4) |
| `apps/trainer` | Persönlicher Trainer-Login + Kiosk-Modus | Trainer/Mitarbeiter | `team.somosunited.ch` | Eigenes Vercel-Projekt |

Drei getrennte Vercel-Projekte statt einer Multi-Zone-App: sauberere Zugriffskontrolle, unabhängige Deploys (ein Bugfix im Trainer-Bereich löst keinen Redeploy der Marketing-Site aus), separates Rate-Limiting/WAF pro Subdomain über Cloudflare.

Gemeinsame Basis über `packages/ui`, `packages/lib`, `packages/types` — Änderungen an Kernkomponenten (Buttons, Tokens, Buchungslogik) wirken automatisch in allen drei Apps, Turborepo cached und baut nur, was sich geändert hat.

## 3. Auth-Architektur

Ein Supabase-Projekt, eine `auth.users`-Tabelle, für alle drei Apps. Kein separates Auth-System pro App.

- **`profiles`-Tabelle** (1:1 zu `auth.users`): `role` (`admin` | `superuser` | `trainer` | `client`), `permissions` (Array, nur relevant bei `admin`/`superuser`, z.B. `['crm', 'finance']`), `location_id` (nur bei Kiosk-Accounts, siehe 4.3).
- **Client (`web`):** Self-Signup über Magic Link (Supabase Auth), Rolle wird automatisch `client`.
- **Trainer (`trainer`):** Kein Self-Signup. Account wird im Admin-App angelegt (siehe Master-Plan, Abschnitt 9), Trainer erhält Einladung mit Magic Link zur Erstanmeldung.
- **Admin (`admin`):** Kein Self-Signup, keine offene Registrierung. Accounts werden manuell von einem SuperUser angelegt. Zusätzlich zwei weitere Schutzschichten (bestätigt, Details in `SECURITY.md`): Cloudflare Access davor (nur eingeladene E-Mails kommen überhaupt bis zum Login) + TOTP-Zwei-Faktor-Pflicht für admin und trainer — **über Supabase Auths eingebaute MFA-Funktion** (native TOTP-Unterstützung, pro Rolle erzwingbar), kein Eigenbau nötig. Quelle: [supabase.com/auth](https://supabase.com/auth).
- **Hinweis für später:** Supabase Auth unterstützt auch natives Enterprise-SSO (SAML 2.0, OIDC) — falls Somos United später z.B. eine Google-Workspace-Anmeldung für Admins will, ist das ohne Zusatz-Tooling möglich. Nicht Teil des aktuellen Scopes, nur als Option vermerkt.
- **Row-Level-Security (RLS):** Standard = deny-by-default. Jede Tabelle bekommt explizite Policies basierend auf `role`/`permissions` aus `profiles`, nie auf Client-seitig gesetzten Werten.
- **Hosting-Region Supabase:** Zürich (`eu-central-2`) — echte Schweizer Datenresidenz für alle operativen/personenbezogenen Daten. Details/Begründung in `SECURITY.md`.

## 4. Berechtigungsmodell

### 4.1 Rollen
`admin`, `superuser`, `trainer`, `client`. `superuser` = technisch wie `admin`, aber mit allen Permissions fix vergeben (kein granulares Einschränken möglich) — für Geschäftsleitung/Gründer:innen.

### 4.2 Granulare Permissions (nur `admin`-App)
Bereiche: `crm`, `finance`, `users`. Ein `admin`-Profil kann eine, mehrere oder alle drei Permissions haben. UI blendet Bereiche ohne Berechtigung komplett aus (nicht nur deaktiviert) — niemand sieht, was er nicht sehen darf, auch nicht als gesperrtes Menü.

### 4.3 Kiosk-Modus (Trainer-App)
Eigener Account-Typ, kein persönlicher Trainer-Login: `role = trainer`, aber mit `location_id` gesetzt und einem Flag `is_kiosk = true`. Ein Kiosk-Account ist an einen Veranstaltungsort gebunden, nicht an eine Person.

- Anmeldung einmalig auf dem Tablet vor Ort (durch Admin oder Trainer), danach dauerhaft eingeloggte Session (kein wiederholtes Login nötig).
- UI zeigt ausschliesslich den QR-Check-in-Screen, keine Navigation, kein Zugriff auf Notizen, Einsatzpläne oder Abrechnungen anderer Trainer.
- Empfehlung: Browser im echten Kiosk-Modus (z.B. iPad "Guided Access" / Android "Screen Pinning") zusätzlich zur App-seitigen Sperre — App-Sperre allein verhindert nicht, dass jemand das Tablet verlässt und im Browser navigiert.
- Session-Timeout bewusst lang (Ganztagesbetrieb an einem Kursort), aber täglicher Auto-Logout um Mitternacht als Sicherheitsnetz.

### 4.4 Realitäts-Check: "Kein Screenshot/Download" (aus dem Briefing)
Wichtig als Experten-Hinweis: Screenshots technisch zuverlässig zu verhindern ist im Web (Browser) **nicht möglich** — das kann jedes Betriebssystem umgehen. Was wir stattdessen umsetzen:
- Keine Download-/Export-Buttons ausserhalb der explizit erlaubten CSV-/PDF-Exports (Finance, CRM-Listen, Trainer-Abrechnungen).
- Sensible Listen serverseitig paginiert statt als komplette Tabelle im DOM (erschwert Copy-Paste grosser Datenmengen).
- Audit-Log: jeder Zugriff auf Client-Kontaktdaten wird protokolliert (wer hat wann was gesehen) — das ist die wirksame Massnahme, nicht die Screenshot-Verhinderung selbst.
- Diese Realität kurz mit Danny absprechen, damit die Erwartung stimmt (Abschnitt "Security First" im Briefing meinte vermutlich eher "kein einfacher Massenexport", das decken wir ab).

## 5. Environment-Variablen (Konvention)

- `.env.example` im Repo-Root mit allen benötigten Keys (ohne echte Werte) — Pflicht bei jeder neuen Integration.
- Echte Secrets nur in Vercel Environment Variables (pro Projekt/Environment getrennt: Preview/Staging/Production), nie im Repo.
- Naming: `NEXT_PUBLIC_*` ausschliesslich für Werte, die im Browser sichtbar sein dürfen (z.B. Sanity Project ID, Supabase Anon Key). Alles andere ohne Prefix, nur serverseitig verfügbar.
- Pro Service ein Block: `SANITY_*`, `SUPABASE_*`, `STRIPE_*`, `RESEND_*`, `TWILIO_*` (SMS-Versand, siehe `07-MODULE-CRM.md`), `CLOUDFLARE_*`, `GOOGLE_*` (Analytics/Search Console), `SNYK_*`/`SOCKET_*` (nur CI).

## 6. Mehrsprachigkeit — technische Basis

- Sanity-Content ist von Anfang an lokalisiert aufgebaut (Locale-Feld pro Dokument bzw. Sanity-i18n-Plugin), Start mit `de-CH` (Standard) und `en`.
- URL-Struktur: `/de/...` und `/en/...`, kein Locale-Präfix = Redirect auf Default (`de`).
- Datenmodell so offen gebaut, dass `fr-CH`/`it-CH` später als reine Content-Ergänzung möglich sind, ohne Schema- oder Code-Änderung. Timing dafür ist laut Master-Plan aktuell offen (Danny: "noch unklar").

## 8. Notion → Sanity Content-Sync

Notion dient als alternative Erfassungsoberfläche für redaktionellen Content (Kurstexte, Modul-Beschreibungen, Seiten) für Team-Mitglieder, denen Notion vertrauter ist als Sanity Studio. Sanity bleibt trotzdem das alleinige System of Record für live-gehende Inhalte — Notion ist ein Eingangs-Tablett, kein Parallel-CMS.

**Fluss (Notion → Sanity, einseitig, nie umgekehrt):**

1. Redakteur:in pflegt einen Eintrag in einer dedizierten Notion-Datenbank ("Content-Erfassung"), Felder gespiegelt zu den wichtigsten Sanity-Feldern (Titel, Sprache `de`/`en`, Text, Modul-Zuordnung) + ein Status-Feld (`Entwurf` / `Bereit zur Übernahme`).
2. Erst bei Status `Bereit zur Übernahme` löst die Änderung etwas aus — verhindert, dass halbfertige Notizen versehentlich synct werden.
3. Notion sendet ein signiertes Webhook-Event (`page.content_updated`) an einen Supabase Edge Function-Endpunkt (`notion-sync`) — kein zusätzliches Deployment nötig, läuft in der bestehenden Supabase-Infrastruktur.
4. Der Endpunkt verifiziert die HMAC-Signatur, lädt den vollen Seiteninhalt über die Notion-API nach, wandelt Notion-Blöcke in Sanity Portable Text um.
5. Ergebnis wird als **Draft-Dokument in Sanity** angelegt/aktualisiert — nie automatisch veröffentlicht. Eine Redaktion prüft und publiziert manuell in Sanity Studio.
6. Bei Fehlern (z.B. fehlendes Pflichtfeld) bekommt die Notion-Seite einen Kommentar/Status zurück statt eines stillen Fehlschlags.

**Scoping (siehe auch `SECURITY.md`):** Die Notion-Integration (interner Integration-Token) wird ausschliesslich mit der einen Content-Datenbank geteilt, nicht mit dem gesamten Workspace — Notion-Integrationen sehen grundsätzlich nur, was ihnen explizit freigegeben wurde.

## 9. Sicherheits-Grundregeln

- Snyk + Socket als CI-Gate: Merge nach `main` blockiert bei kritischen Findings.
- Cloudflare WAF vor allen drei Vercel-Projekten, Rate-Limiting auf Auth-Endpunkte (Magic-Link-Anfragen, Login-Versuche admin/trainer).
- RLS deny-by-default (siehe 3.), keine Ausnahmen "nur zum Testen" — auch nicht in Staging.
- Keine echten Kundendaten in Preview-Deployments oder lokalen Dev-Umgebungen — dafür synthetische Seed-Daten (`scripts/`).

---
*Nächster Schritt: Danny liest gegen, dann entsteht `02-DEPLOYMENT.md` (Staging/Production-Regeln, CI/CD, Changelog-Format).*
