# Account Setup Checklist

Referenz: `md/02-DEPLOYMENT.md` Abschnitt 2 & 8. Diese Checkliste ist für Danny (Ausführung) — jeder Account wird neu und dediziert unter Somos United angelegt, nie unter privaten oder Agentur-Accounts.

**Audit 2026-09-05:** Danny stellte fest, dass mehrere Zeilen hier als "offen" markiert waren, obwohl der jeweilige Account/Service längst lief (z.B. Vercel, Supabase, Sanity) — Claude hatte das nicht konsequent nachgetragen, als die Arbeit tatsächlich passierte. Diese Version wurde Zeile für Zeile gegen den echten Live-Zustand geprüft (Vercel-/Supabase-/Sanity-API direkt abgefragt, nicht nur angenommen), nicht nur gegen die eigene Erinnerung. **Regel ab jetzt: nach jedem Account-Setup-Schritt sofort hier nachtragen, nicht erst wenn es auffällt.**

**Vorher einmalig klären:**
- [x] `somosunited.ch` registriert — live, DNS zeigt auf Vercel.
- [x] `tech@somosunited.ch` eingerichtet — wird produktiv für GitHub/Google/etc. genutzt.
- [x] Rechnungsadresse/Billing-Entität **Verein Somos United** — durchgängig so verwendet.
- [ ] 2FA auf **jedem** Account — nicht einzeln durchgeprüft, keine API-Möglichkeit das von aussen zu verifizieren. Danny bitte selbst stichprobenartig prüfen.

## Reihenfolge (praktisch)

### 1. Passwort-Manager zuerst
- [ ] **Bitwarden Free Organization** — Status nicht verifiziert, keine API-Zugriffsmöglichkeit. Danny bitte bestätigen.

### 2. Code & Hosting
- [x] **GitHub** — Org `github.com/somos-united`, Repo `somos-united/somos-united`, Login `tech@somosunited.ch`. Erledigt 2026-08-25, seither durchgängig in Benutzung (jeder Deploy dieses Projekts läuft darüber).
- [x] **Vercel** — Team "Somos United" (`team_XboM1yeeo6MFV8WKSffCHwBe`), mit GitHub-Org verknüpft. Drei Projekte: `somos-united-web` (live, `www.somosunited.ch`), `somos-united-admin`, `somos-united-trainer`. **War hier fälschlich als offen markiert** — lief bereits seit Wochen aktiv, nur nie nachgetragen.

### 3. Daten & Content
- [x] **Supabase** — Projekt "Somos United Project" (`rrxgnhvhykapnrtzfsoy`), Region **Zürich (`eu-central-2`)** ✓, Status ACTIVE_HEALTHY, Postgres 17.6. **Vollständiges Schema bereits live** — alle 36 Tabellen aus `03-DATA-MODEL.md` (Buchung, Trainer, CRM, Finance — nicht nur die aktuelle Phase) existieren seit der Migration `init_schema` vom **2026-08-26**, inhaltlich 1:1 gegen die Doku geprüft (2026-09-05) und korrekt. **War hier fälschlich als offen markiert.** Noch zu prüfen/tun: `app_settings`-Default-Werte (z.B. `scarcity_seats_threshold_default`) noch nicht auf tatsächliche Zeilen geprüft; noch keine echten Datensätze (`locations` z.B. 0 Zeilen) — nichts zum Buchen vorhanden, bis mindestens ein Standort/eine Kursserie angelegt ist.
- [x] **Sanity** — Projekt "Somos United" (`ydbo6w2y`), erstellt 2026-08-25, Schema live seit 2026-09-01 (siehe `project_phase0_sanity_deployed`). **War hier fälschlich als offen markiert.**

### 4. Netzwerk & Sicherheit
- [ ] **Cloudflare** — bestätigt **nicht** aufgesetzt (direkt per DNS-Abfrage geprüft 2026-09-04: Nameserver zeigen auf Vercel, kein Cloudflare). Von Danny bewusst pausiert 2026-09-04 ("wir warten ein, zwei Tage").

### 5. Zahlungen & Kommunikation
- [x] **Stripe** — von Danny bestätigt eingerichtet 2026-09-05. **Nicht** über die Stripe-API gegengeprüft — der Stripe-MCP-Connector braucht eine Re-Autorisierung (`claude mcp` / `/mcp`), bisher nicht durchgeführt. Checkout-Code ist noch nicht geschrieben.
- [x] **Resend (transaktional)** — Domain `mail.somosunited.ch` verifiziert seit 2026-08-27 (Sending enabled). `RESEND_API_KEY` erzeugt und mit echtem Test-Versand (`pnpm test:resend-email`) verifiziert 2026-09-04, aktuell in Vercel-Projekt **Admin** eingetragen (nicht Web — beide brauchen ihn später separat, siehe `packages/lib/src/resend.ts`). Resend Inbound (Receiving, für `email_messages`/Kunden-E-Mail-Verlauf, `07-MODULE-CRM.md` Abschnitt 4) noch nicht aktiviert — separate spätere Ausbaustufe.
- [x] ~~Twilio~~ — **Blacklisted 2026-09-03, dauerhaft ausgeschlossen** (Danny: schwierig, ignoriert Schweizer Recht, kompliziertes Setup — siehe die Trust-Hub-Compliance-Odyssee vom 2026-09-01/02). Twilio-Konto/Absender bleiben ungenutzt stehen, kein weiterer Aufwand hier. Auth Token nicht rotiert (war versehentlich im Chat sichtbar) — egal, Konto wird nicht mehr verwendet.
- [x] **Bird (SMS)** — Account unter Somos United angelegt (`tech@somosunited.ch`), Pay-as-you-go, Wallet aufgeladen. `BIRD_API_KEY` in Vercel (Production) eingetragen und mit echtem Test-Versand (`pnpm test:bird-sms`) verifiziert 2026-09-04. Alphanumerische SMS-Absender-ID "SOMOSUnited" (11 Zeichen, Bird-Maximum) unter SMS → Senders eingerichtet 2026-09-04.
- [ ] **Bird (WhatsApp)** — separat von SMS, bewusst pausiert 2026-09-04 auf Dannys Wunsch. Noch offen, sobald wieder aufgenommen: Meta Business Manager + WhatsApp Business Account (WABA) für "Verein Somos United" verifizieren, dann `BIRD_WHATSAPP_FROM` (Absendernummer, E.164-Format) in Vercel eintragen.
- [ ] **Notion** — Status nicht verifiziert, kein MCP-Zugriff in dieser Session geprüft. Danny bitte bestätigen, ob der dedizierte Workspace existiert.

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
