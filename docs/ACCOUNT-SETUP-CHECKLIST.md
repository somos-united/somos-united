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
- [ ] **GitHub** — Organisation `somos-united` (nicht privates Repo)
- [ ] **Vercel** — Team-Account, mit GitHub-Org verknüpfen (ermöglicht automatische Preview-Deploys pro PR)

### 3. Daten & Content
- [ ] **Supabase** — Organisation, Projekt-Region **Zürich (`eu-central-2`)** explizit wählen
- [ ] **Sanity** — Organisation, Plan **Free** zum Start

### 4. Netzwerk & Sicherheit
- [ ] **Cloudflare** — Account (DNS-Zone erst aufschaltbar, sobald Domain registriert ist)

### 5. Zahlungen & Kommunikation
- [ ] **Stripe** — Account, Verein als Rechtsträger hinterlegen
- [ ] **Resend** — Account (transaktionale Mails; später auch Resend Inbound für den Kunden-E-Mail-Verlauf, siehe `07-MODULE-CRM.md` Abschnitt 4)
- [ ] **Twilio** — Account (SMS; alphanumerische Absender-ID "SOMOS" einrichten)
- [ ] **Notion** — dedizierter Workspace, **nicht** geteilt mit anderen Projekten

### 6. Security-Scanning (CI)
- [ ] **Snyk** — Account/Org
- [ ] **Socket** — Account/Org

### 7. Analytics
- [ ] **Google** — Search Console + Analytics unter `tech@somosunited.ch`

### 8. Social (kein neuer Account)
- [ ] Instagram/LinkedIn: bestehende Somos-United-Profile per offizieller API/App-Berechtigung anbinden (kein Passwort-Teilen) — relevant erst ab Phase 4/Beta, siehe `07-MODULE-CRM.md` Abschnitt 5

## Danach

- [ ] Alle Accounts in `memory/CHANGELOG.md` als erledigt abhaken
- [ ] Zugangsdaten/Keys mir (Claude Code) für die jeweiligen `.env`-Blöcke geben — siehe `.env.example` im Repo-Root, nie Klartext im Repo committen. Vercel-seitige Secrets trägst du direkt in den Vercel-Projekteinstellungen ein (pro Environment getrennt), nicht über mich.
- [ ] Cloudflare: Domain aufschalten, WAF + Access konfigurieren, sobald DNS steht

---
*Nicht Teil dieser Checkliste: die tatsächlichen Lohnabzugssätze (Treuhänder-Abstimmung, siehe `08-MODULE-FINANCE.md` Abschnitt 12) — das ist reine Dateneingabe später im Admin-App, keine Account-Frage.*
