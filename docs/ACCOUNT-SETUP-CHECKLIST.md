# Account Setup Checklist

Referenz: `md/02-DEPLOYMENT.md` Abschnitt 2 & 8. Diese Checkliste ist für Danny (Ausführung) — jeder Account wird neu und dediziert unter Somos United angelegt, nie unter privaten oder Agentur-Accounts.

**Vorher einmalig klären:**
- [ ] `somosunited.ch` registriert? (Domain-Registrierung ist Voraussetzung für `tech@somosunited.ch` und alle Subdomains)
- [ ] `tech@somosunited.ch` bei CYON eingerichtet (Account-Halter-E-Mail für alle Signups unten)
- [ ] Rechnungsadresse/Billing-Entität bei jedem kostenpflichtigen Dienst: **Verein Somos United** (nicht Privatperson, nicht Agentur)
- [ ] 2FA ist auf **jedem** Account unten Pflicht, nicht optional

## Reihenfolge (praktisch)

### 1. Passwort-Manager zuerst
- [ ] **Bitwarden Free Organization** — 2 Personen (Danny + 1). Alle folgenden Zugangsdaten sofort hier eintragen, nicht in Notizen/Mail zwischenlagern.

### 2. Code & Hosting
- [x] **GitHub** — Organisation `somos-united` (nicht privates Repo). Erledigt 2026-08-25: Org unter `github.com/somos-united`, Rechtsträger "Verein Somos United", Login `tech@somosunited.ch`. Repo `somos-united/somos-united` erstellt und gepusht, CI grün.
- [ ] **Vercel** — Team-Account, mit GitHub-Org verknüpfen (ermöglicht automatische Preview-Deploys pro PR)

### 3. Daten & Content
- [ ] **Supabase** — Organisation, Projekt-Region **Zürich (`eu-central-2`)** explizit wählen
- [ ] **Sanity** — Organisation, Plan **Free** zum Start

### 4. Netzwerk & Sicherheit
- [ ] **Cloudflare** — Account (DNS-Zone erst aufschaltbar, sobald Domain registriert ist)

### 5. Zahlungen & Kommunikation
- [ ] **Stripe** — Account, Verein als Rechtsträger hinterlegen
- [ ] **Resend** — Account (transaktionale Mails; später auch Resend Inbound für den Kunden-E-Mail-Verlauf, siehe `07-MODULE-CRM.md` Abschnitt 4)
- [x] ~~Twilio~~ — **Blacklisted 2026-09-03, dauerhaft ausgeschlossen** (Danny: schwierig, ignoriert Schweizer Recht, kompliziertes Setup — siehe die Trust-Hub-Compliance-Odyssee vom 2026-09-01/02). Twilio-Konto/Absender bleiben ungenutzt stehen, kein weiterer Aufwand hier. Auth Token nicht rotiert (war versehentlich im Chat sichtbar) — egal, Konto wird nicht mehr verwendet.
- [x] **Bird (SMS)** — Account unter Somos United angelegt (`tech@somosunited.ch`), Pay-as-you-go, Wallet aufgeladen. `BIRD_API_KEY` in Vercel (Production) eingetragen und mit echtem Test-Versand (`pnpm test:bird-sms`) verifiziert 2026-09-04. Alphanumerische SMS-Absender-ID "SOMOSUnited" (11 Zeichen, Bird-Maximum) unter SMS → Senders eingerichtet 2026-09-04.
- [ ] **Bird (WhatsApp)** — separat von SMS, noch offen: Meta Business Manager + WhatsApp Business Account (WABA) für "Verein Somos United" verifizieren, dann `BIRD_WHATSAPP_FROM` (Absendernummer, E.164-Format) in Vercel eintragen.
- [ ] **Notion** — dedizierter Workspace, **nicht** geteilt mit anderen Projekten

### 6. Security-Scanning (CI)
- [x] **Snyk** — Org "Somos United Switzerland" verbunden mit `somos-united/somos-united`, alle 9 package.json-Manifeste im Monorepo importiert (root, packages/*, apps/web+trainer+admin, studio) 2026-09-01. `turbo.json`-Importfehler ist unschädlich (kein Dependency-Manifest, wird ignoriert). Snyk öffnete automatisch 3 Fix-PRs (next 14.2.15 → 14.2.35, behebt 3 kritische CVEs pro App: Improper Authorization, Directory Traversal, Insecure Automated Optimizations). Alle 3 PRs hatten eine veraltete `pnpm-lock.yaml` (Snyk aktualisiert nur `package.json`, nicht das Lockfile) — lokal gefixt und gepusht, jetzt alle CI-Checks grün (Lint/Typecheck/Test/Build, E2E, Snyk, Socket, Vercel). PRs #1 (trainer), #2 (web), #3 (admin) bereit zum Mergen, wartet auf Danny. Socket- und Snyk-Status-Checks sind jetzt für die Branch-Protection-Regel auswählbar (liefen auf diesen PRs) — **noch zu tun:** in GitHub Branch-Protection-Regel als required hinzufügen.
- [x] **Socket** — Org "Sonos United Switz..." verbunden mit `somos-united/somos-united` Repo (GitHub App), scannt aktiv (1315 Dependencies, 50 CVEs/0 reachable/0 kritisch). Branch-Protection-Regel für `main` erstellt (Pull Request + Status-Checks erforderlich) 2026-09-01. **Noch offen:** Socket postet erst nach der ersten echten PR einen Status-Check — dann diesen Check in der Branch-Protection-Regel als required hinzufügen.

### 7. Analytics
- [x] **Google** — Search Console + Analytics unter `tech@somosunited.ch` eingerichtet 2026-09-01. GA4-Property "Somos United" (Measurement ID `G-RL5EQ21Q8H`, Stream `https://www.somosunited.ch`), Search Console Domain-Property `somosunited.ch` verifiziert (DNS TXT, Root-Domain). **Noch offen, erst beim Bau des Dashboards (`07-MODULE-CRM.md` Abschnitt 6):** Google-Cloud-Projekt + GA4-Data-API/Search-Console-API aktivieren, Service-Account mit Lesezugriff anlegen, `GOOGLE_*` in Vercel eintragen. Bewusst noch nicht gemacht, um keine ungenutzten Credentials anzulegen.

### 8. Social (kein neuer Account)
- [ ] Instagram/LinkedIn: bestehende Somos-United-Profile per offizieller API/App-Berechtigung anbinden (kein Passwort-Teilen) — relevant erst ab Phase 4/Beta, siehe `07-MODULE-CRM.md` Abschnitt 5

## Danach

- [ ] Alle Accounts in `memory/CHANGELOG.md` als erledigt abhaken
- [ ] Zugangsdaten/Keys mir (Claude Code) für die jeweiligen `.env`-Blöcke geben — siehe `.env.example` im Repo-Root, nie Klartext im Repo committen. Vercel-seitige Secrets trägst du direkt in den Vercel-Projekteinstellungen ein (pro Environment getrennt), nicht über mich.
- [ ] Cloudflare: Domain aufschalten, WAF + Access konfigurieren, sobald DNS steht

---
*Nicht Teil dieser Checkliste: die tatsächlichen Lohnabzugssätze (Treuhänder-Abstimmung, siehe `08-MODULE-FINANCE.md` Abschnitt 12) — das ist reine Dateneingabe später im Admin-App, keine Account-Frage.*

## Bekannter Vercel-Fallstrick (2026-09-02)

Das per Skript-Kommando konfigurierte "Ignored Build Step" (`git diff HEAD^ HEAD --quiet -- ./apps/X`) hat mindestens einmal einen echten Deploy fälschlicherweise als "keine Änderungen" übersprungen (Commit `9e8fcb6`, änderte nachweislich 8 Dateien in `apps/web`, wurde trotzdem gecancelt). Für `somos-united-web` deshalb auf Vercels eingebautes "Automatic"-Verhalten zurückgestellt (überspringt nur bereits deployte Commit-SHAs, kein fehleranfälliger Pfad-Diff). `somos-united-admin`/`somos-united-trainer` haben noch die alte Konfiguration — bei Bedarf gleich umstellen, falls dort ein ähnlich stiller Fehlschlag auftritt.

**Nachtrag (2026-09-02):** Auch mit "Automatic" wurde ein `--allow-empty`-Retrigger-Commit (identischer Datei-Baum wie sein bereits gecancelter Vorgänger) sofort ohne Build-Log übersprungen — Vercel scheint Commits mit identischem Datei-Baum zu deduplizieren, unabhängig vom Build-Ergebnis des Vorgängers. Für einen echten Test ist ein Commit mit tatsächlicher Inhaltsänderung nötig, kein leerer Commit.
