/**
 * Shared Tailwind preset — the single Tailwind-level source of truth for
 * Somos United's design tokens (04-DESIGN-SYSTEM.md §1–3). Every app
 * (`apps/web`, `apps/admin`, `apps/trainer`) extends this preset instead of
 * redefining colors/spacing/radius locally (00-MASTER-PLAN.md §4: "Ein
 * zentrales CSS/Token-System ... keine Insel-Styles pro App/Modul").
 *
 * The same values are re-exported as TS constants and CSS custom properties
 * from `@somos/ui` (`packages/ui/src/tokens.ts` / `tokens.css`) for use
 * outside of Tailwind class names (e.g. inline styles, JS-driven theming).
 * Keep both in sync with 04-DESIGN-SYSTEM.md if the source doc changes.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Marke & Aktion (§1)
        primary: {
          DEFAULT: "#5B21F0",
          bright: "#7B3FFF",
          press: "#4517C4",
          "subdued-bg": "#EDE4FF",
        },
        ink: {
          DEFAULT: "#1B2430",
          secondary: "#3E4A5A",
          mute: "#6B7385",
        },
        "on-primary": "#FFFFFF",

        // Akzente (§1)
        accent: {
          coral: {
            DEFAULT: "#FF5A36",
            deep: "#C93D1A",
            "subtle-bg": "#FFE4DA",
          },
          teal: {
            DEFAULT: "#12B3A8",
            deep: "#0B7A72",
          },
        },

        // Flächen & Gradient-Mesh (§1)
        canvas: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F7FB",
          peach: "#FDEBDD",
          lavender: "#E8E4FF",
          mint: "#E3F5EE",
        },
        hairline: "#E7E7EF",

        // Ampelsystem — KPI-Dashboards, Admin-App (§1), bewusst gedämpft
        status: {
          good: { bg: "#E4F7EC", text: "#1E7A45" },
          warn: { bg: "#FDF1DC", text: "#97600A" },
          critical: { bg: "#FBE7E7", text: "#B23434" },
        },
      },

      fontFamily: {
        // Supreme (Fontshare), self-hosted — 01-ARCHITECTURE.md keeps
        // secrets/CDN deps out of the runtime, so no Fontshare CDN link.
        // System-font fallback stack keeps builds/previews unblocked if the
        // WOFF2 files are ever missing locally.
        sans: [
          "Supreme",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },

      // Typografie-Rollen (§2) — Grösse/Zeilenhöhe/Gewicht als benannte Tailwind-Utilities
      fontSize: {
        "display-hero": ["48px", { lineHeight: "1.08", fontWeight: "800" }],
        "display-hero-lg": ["56px", { lineHeight: "1.05", fontWeight: "800" }],
        "display-section": ["32px", { lineHeight: "1.15", fontWeight: "800" }],
        "display-section-lg": ["36px", { lineHeight: "1.12", fontWeight: "800" }],
        "heading-lg": ["22px", { lineHeight: "1.3", fontWeight: "700" }],
        "heading-lg-alt": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        "heading-md": ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["15px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-lg": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-tabular": [
          "14px",
          { lineHeight: "1.5", fontWeight: "400", fontVariantNumeric: "tabular-nums" },
        ],
        button: ["14px", { lineHeight: "1.2", fontWeight: "600" }],
        "button-lg": ["16px", { lineHeight: "1.2", fontWeight: "600" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "500" }],
        "caption-lg": ["13px", { lineHeight: "1.4", fontWeight: "500" }],
      },

      // Spacing — 8px-Basis (§3)
      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        xxl: "32px",
        huge: "64px",
      },

      // Radius (§3)
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "9999px",
      },

      // Elevation (§3)
      boxShadow: {
        "elevation-1": "0 1px 3px rgba(27, 36, 48, 0.08)",
        "elevation-2": "0 8px 24px rgba(27, 36, 48, 0.08)",
      },

      // Liquid-Glass & Gradient-Mesh (§4)
      backdropBlur: {
        glass: "20px",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #FDEBDD 0%, #E8E4FF 50%, #E3F5EE 100%)",
      },
    },
  },
  plugins: [],
};
