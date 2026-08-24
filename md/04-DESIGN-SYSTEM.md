---
title: Somos United — Design System
version: 0.3 (Farben kräftiger, eigenständig zur Stripe-Referenz)
status: Freigegeben durch Danny am 2026-08-18
date: 2026-08-17
audience: Claude Code (Umsetzung)
depends_on: 00-MASTER-PLAN.md Abschnitt 4
---

# Design System

## 0. Herkunft & Grundsatz

Drei Runden haben dieses Dokument geprägt:

1. Alpino (`assets/fonts/alpino/`) wurde zunächst als Marken-Schrift vorgeschlagen, **von Danny verworfen** ("passt nicht"). Verbindliche Schrift ist **Supreme** (Fontshare) — siehe Abschnitt 2.
2. Die vorhandenen Benchmarks (`DESIGN-stripe.md`, "StellarGrowth"-Mockups) sind strukturell wertvoll (Raster, Typografie-Disziplin, Komponenten-Aufbau), aber ursprünglich zu kühl/fintech-artig im Ton. Danny wählte daraus die Grundrichtung **"Calm Clarity"** (Apple/Stripe-nah, ruhig, poliert, pastellener Gradient statt hartem Fintech-Indigo).
3. **Korrektur (2026-08-17, zweite Runde):** Nach Ansicht der vollen Stripe-Analyse nochmals — Core- und Akzentfarben müssen **kräftiger/gesättigter** sein, näher an der Energie des Benchmarks. Gleichzeitig **keine 1:1 Kopie** — eigenständig auf Somos United angepasst. Abschnitt 1 unten ist entsprechend überarbeitet: sowohl `primary` als auch die Akzentfarben sind jetzt deutlich satter. Struktur (Abschnitt 3–5) bleibt unverändert, das war nie die Frage.

## 1. Farben

### Marke & Aktion — kräftig, AA-lesbar
| Token | Wert | Verwendung |
|---|---|---|
| `primary` | `#5B21F0` | **Der Arbeits-Ton**: gefüllte Buttons, Links, Icons, Text auf Weiss. Deutlich satter als die erste Fassung — kontrastgeprüft **7.2:1 mit Weiss** (übertrifft WCAG AAA), lesbar UND kräftig zugleich. |
| `primary-bright` | `#7B3FFF` | Hellere, noch lebendigere Variante für grosse Flächen, Illustration, Gradient-Akzente, Chart-Highlights. Nicht für kleinen Fliesstext (Kontrast). |
| `primary-press` | `#4517C4` | Pressed-State. |
| `primary-subdued-bg` | `#EDE4FF` | Tag-/Chip-Hintergrund. |
| `ink` | `#1B2430` | Standard-Textfarbe, weicher als reines Schwarz. |
| `ink-secondary` | `#3E4A5A` | Sekundärtext. |
| `ink-mute` | `#6B7385` | Hilfstext, Captions. |
| `on-primary` | `#FFFFFF` | Text auf gefüllten Buttons/dunklen Flächen. |

Zur Einordnung: Stripes Primary (`#533afd`) ist ein sattes Blau-Violett. Unser `primary` (`#5B21F0`) ist bewusst **röter/wärmer gemischt** (mehr Richtung Purpur als Blau) — vergleichbar kräftig, aber auf den ersten Blick unterscheidbar, nicht kopiert.

### Akzent — bewusst zwei kräftige Zweitfarben statt Stripes Ruby/Magenta
| Token | Wert | Verwendung |
|---|---|---|
| `accent-coral` | `#FF5A36` | Warmer, energiegeladener Hauptakzent — Icons, Illustration, grosse Badges, Highlights. Ersetzt Stripes kühles Ruby/Magenta durch einen wärmeren, zur Zielgruppe (Familien/Jugendliche) passenden Ton. |
| `accent-coral-deep` | `#C93D1A` | Kontrastreichere Variante für Text/kleine Elemente auf hellem Coral. |
| `accent-coral-subtle-bg` | `#FFE4DA` | Chip-/Tag-Hintergrund warm. |
| `accent-teal` | `#12B3A8` | Zweiter kräftiger Akzent (kühles Gegengewicht zu Coral) — Tags, Icons, Links auf dunklem Grund. |
| `accent-teal-deep` | `#0B7A72` | Kontrastreichere Variante für Text auf hellem Teal/Mint. |

**Warum zwei Akzente statt einem:** Stripe nutzt Ruby *und* Magenta als Duo neben Indigo. Wir übernehmen dieses Prinzip (Duo-Akzent macht ein System lebendiger als eine Einzelfarbe), aber mit eigener, wärmerer Farbfamilie (Koralle + Teal statt Pink + Magenta).

### Flächen & Gradient-Mesh (unverändert — bewusst weich als Kontrast zu den kräftigen Akzenten)
| Token | Wert | Verwendung |
|---|---|---|
| `canvas` | `#FFFFFF` | Standard-Hintergrund. |
| `canvas-soft` | `#F7F7FB` | Feature-Bänder unterhalb des Hero. |
| `canvas-peach` | `#FDEBDD` | Gradient-Stop 1 (warm). |
| `canvas-lavender` | `#E8E4FF` | Gradient-Stop 2 (Marke). |
| `canvas-mint` | `#E3F5EE` | Gradient-Stop 3 (kühl/frisch). |
| `hairline` | `#E7E7EF` | 1px-Rahmen auf Karten/Tabellen. |

**Design-Logik dahinter:** kräftige, gesättigte Buttons/Icons/Akzente auf einem weichen, pastellenen Hintergrund — die Fläche bleibt ruhig (passt zu sensiblen Themen wie Gewaltprävention/psychische Belastung), während CTAs und interaktive Elemente durch die Sättigung klar hervorstechen und Zuversicht/Energie ausstrahlen. Würden auch die Flächen kräftig, kippt der Ton zurück Richtung Fintech-Härte — genau das wollten wir vermeiden.

### Ampelsystem (KPI-Dashboards, Admin-App) — bewusst weiterhin gedämpft
| Zustand | Hintergrund | Text/Icon |
|---|---|---|
| Gut (grün) | `#E4F7EC` | `#1E7A45` |
| Achtung (gelb) | `#FDF1DC` | `#97600A` |
| Kritisch (rot) | `#FBE7E7` | `#B23434` |

Diese drei bleiben bewusst **nicht** so kräftig wie Primary/Akzent — Ampelfarben müssen auf einen Blick eindeutig, aber in einem dichten Dashboard nicht ermüdend sein. Konsequent als weiche Badge (Hintergrund + dunklerer Text), nie als grelle Vollfläche.

**Kontrast-Hinweis:** `primary` ist jetzt selbst der lesbare Arbeits-Ton (7.2:1 mit Weiss) — die frühere Aufteilung in ein helles "nur dekoratives" Primary und ein separates "primary-deep" für Text entfällt, weil das neue `primary` beides kann. `primary-bright` bleibt rein dekorativ (grosse Flächen/Illustration), nicht für kleinen Text. Vor Phase-2-Launch: vollständiger Kontrast-Audit (Skill `accessibility-review`) über alle drei Apps.

## 2. Typografie

**Schrift: Supreme** ([Fontshare](https://www.fontshare.com/fonts/supreme), kostenlos für kommerzielle Nutzung). 8 Schnitte (Thin 100 bis ExtraBold 800, je mit Kursiv) + echter Variable Font. Self-hosting: WOFF2-Dateien lokal ablegen (`assets/fonts/supreme/`), kein Fontshare-CDN-Link zur Laufzeit — Performance und keine Abhängigkeit von Drittanbietern (passt zu "Security First"). Claude Code lädt die Dateien im Zuge von Phase 0 von Fontshare herunter.

| Rolle | Schnitt | Grösse (Desktop) | Verwendung |
|---|---|---|---|
| `display-hero` | ExtraBold (800) | 48–56px | Hero-Headline ("Stark ins Leben.") |
| `display-section` | ExtraBold (800) | 32–36px | Section-Opener |
| `heading-lg` | Bold (700) | 22–24px | Karten-/Modul-Titel |
| `heading-md` | SemiBold (600) | 18px | Sub-Überschriften |
| `body` | Regular (400) | 15–16px, line-height 1.5 | Standard-Fliesstext |
| `body-tabular` | Regular (400) + `font-variant-numeric: tabular-nums` | 14px | Geld/Zahlen in Finance & CRM (Admin-App) |
| `button` | SemiBold (600) | 14–16px | Button-Label |
| `caption` | Medium (500) | 12–13px | Hilfstext, Tags, Tabellen-Labels |

**Warum nicht Stripes ultra-dünne 300er-Displaygrösse:** passt zu einer Finanz-Marke, nicht zu einem Jugend-Empowerment-Verein. Supreme ExtraBold auf den Headlines gibt Zuversicht/Energie ("Stark ins Leben" soll auch so aussehen), während Body-Text bei Regular + grosszügigem Zeilenabstand ruhig und lesbar bleibt.

## 3. Spacing, Radius, Elevation (übernommene Struktur-DNA)

Bewusst 1:1 aus der Stripe-Analyse übernommen — das ist reine Struktur, keine Markenfrage.

- **Spacing (8px-Basis):** `xxs` 2 · `xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `xxl` 32 · `huge` 64px.
- **Radius:** `xs` 4 · `sm` 6 · `md` 8 · `lg` 12 · `xl` 16 · `pill` 9999px.
- **Elevation:** Level 0 flach · Level 1 `0 1px 3px rgba(27,36,48,.08)` (Karten) · Level 2 `0 8px 24px rgba(27,36,48,.08)` (schwebende Panels).

## 4. Liquid-Glass & Gradient-Mesh (iOS-27-Ästhetik)

- **Hero-Gradient:** weicher, verwischter Übergang `canvas-peach → canvas-lavender → canvas-mint`, organisch (SVG/Blob) — bewusst weich, damit die kräftigen `primary`/`accent-coral`/`accent-teal`-Elemente darauf hervorstechen (siehe Design-Logik in Abschnitt 1).
- **Glass-Panel** (Component, für Nav/Onboarding-Tooltips/Kiosk-Overlay): `background: rgba(255,255,255,0.6)`, `backdrop-filter: blur(20px)`, 1px `hairline`-Rand, Radius `lg`.
- Einsatz sparsam: Nav-Bar über dem Hero, Onboarding-Tooltip-Karten, Modal-Overlays.

## 5. Bento-Grid

Homepage/Modul-Übersicht als asymmetrisches Bento-Raster: ein grosses Feature-Feld (2×2), mittlere Modul-Karten (1×1 oder 2×1), kleine Stat-/Quote-Kacheln (1×1). Grid-Gap durchgehend `spacing.lg` (16px), Radius durchgehend `rounded.lg` (12px). Bricht auf Mobile zu einer einspaltigen Stapelung (grosses Feld zuerst).

## 6. Komponenten

- **`button-primary-pill`**: Fill `primary`, Text `on-primary`, `rounded.pill`, Padding 10px 20px, Schrift `button`.
- **`button-secondary`**: Transparent, 1.5px Rand `primary`, Text `primary`, sonst identisch.
- **`button-accent`** (neu): Fill `accent-coral`, Text `on-primary` bei grossen/fetten Labels, sonst `ink` — für sekundäre CTAs, die trotzdem auffallen sollen (z.B. "Jetzt anmelden" neben "Mehr erfahren").
- **`module-card`**: Bento-Karte für ein Modul — Bild/Illustration oben, `category`-Chip (siehe unten), `heading-lg`-Titel, kurzer Teaser, Alterspanne, verlinkt zum Onboarding-Tooltip beim ersten Erscheinen.
- **`category-chip`**: `primary-subdued-bg`, Text `primary`, `caption`-Schrift, `rounded.pill` — je Modul-Kategorie (Medienkompetenz, Respekt, …), alternierend mit `accent-coral-subtle-bg`/`accent-coral-deep` für visuelle Abwechslung zwischen Kategorien.
- **`status-badge`** (Admin-KPIs): Ampelsystem-Farben wie oben, `rounded.pill`, Icon + kurzer Text.
- **`kpi-tile`**: Karte mit `body-tabular`-Zahl gross, `caption`-Label darunter, optionaler `status-badge` in der Ecke — Grundbaustein aller Admin-Dashboards.
- **`kiosk-checkin-button`**: sehr grosses Touch-Target (≥ 64×64px), `button-primary-pill` skaliert, hoher Kontrast — auf 2 Meter Abstand lesbar (Tablet am Kursort).
- **`glass-panel`**: siehe Abschnitt 4.
- **`text-input`**: `canvas`-Fill, 1px `hairline`-Rand, Radius `sm`, Fokus-Rand `primary`.
- **`footer-light`**: `canvas`-Fill, `ink-mute`-Text, `caption`-Schrift, grosszügiges Padding (`huge` oben/unten).

## 7. Ausprägung pro App

- **`web`** (Marketing + Client): volle Bento-/Gradient-/Glass-Wirkung, wärmster Ton, kräftige `primary`/`accent-coral`/`accent-teal`-Elemente auf weichem Gradient-Grund.
- **`admin`**: ruhiger, dichter — viel `canvas`/`canvas-soft`, `kpi-tile` und `status-badge` dominieren, Gradient-Mesh nur dezent (z.B. Login-Screen). Kräftige Akzente sparsam einsetzen (Primär-Buttons, wichtige KPI-Highlights) — sonst wird ein Arbeitswerkzeug schnell unruhig.
- **`trainer`**: funktional, grosse Touch-Targets, im Kiosk-Modus maximaler Kontrast und minimale Elemente (nur `kiosk-checkin-button` + Status), kein Bento, keine Ablenkung.

## 8. Bildsprache

Noch kein eigenes Fotomaterial vorhanden. Für den Start: **Illustration statt Stock-Fotografie** — die "StellarGrowth"-Benchmarks nutzen Desk-/Tech-Stockfotos, das passt nicht zu einem Jugend-Verein. Empfehlung: einfache, warme Icon-/Illustrationssprache pro Modul-Kategorie, bis echtes Foto-/Videomaterial von Kursen vorliegt.

**Wichtiger Hinweis (Security-Bezug):** Sobald echte Fotos von Kindern/Jugendlichen verwendet werden, braucht es pro Kind eine explizite Einverständniserklärung der Eltern (Foto-Opt-in, separat vom SMS-/Newsletter-Opt-in aus `03-DATA-MODEL.md`).

## 9. Do's & Don'ts

**Do:** Supreme ExtraBold für Zuversicht auf Headlines · `primary` und `accent-coral`/`accent-teal` kräftig und gesättigt einsetzen, wo Aufmerksamkeit gewollt ist (Buttons, Icons, Highlights) · Ampelsystem bewusst gedämpft lassen · Glass-Panels sparsam für den "Liquid"-Moment · gleiche Tokens in allen drei Apps (`packages/ui`), nur Dichte/Wärme variiert.

**Don't:** `primary-bright` nie als Fliesstext oder auf kleinen Buttons (Kontrast) · Ampelsystem nicht "aufpeppen" — die müssen ruhig bleiben, auch wenn der Rest kräftiger ist · keine harten Farbverläufe ohne Weichzeichnung auf der Fläche · keine Stock-Fotos, die wie eine andere Marke aussehen · Kiosk-Modus nie mit Bento-Verspieltheit überladen.

---
*Nächster Schritt: Danny prüft die aktualisierte Design-Analyse (HTML), dann entsteht `05-MODULE-BOOKING.md`.*
