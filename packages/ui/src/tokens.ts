/**
 * Design tokens as typed TS constants — source: 04-DESIGN-SYSTEM.md §1–3.
 *
 * This is the TS-side twin of `tokens.css` (CSS custom properties) and of
 * the Tailwind theme extension in `@somos/config/tailwind/preset.js`. All
 * three must stay in sync with 04-DESIGN-SYSTEM.md if the source doc
 * changes — there is intentionally no single generated source yet (Phase 0
 * keeps the token set small enough to hand-maintain across the three
 * representations; revisit if the set grows).
 */

export const colors = {
  primary: {
    DEFAULT: "#5B21F0",
    bright: "#7B3FFF",
    press: "#4517C4",
    subduedBg: "#EDE4FF",
  },
  ink: {
    DEFAULT: "#1B2430",
    secondary: "#3E4A5A",
    mute: "#6B7385",
  },
  onPrimary: "#FFFFFF",
  accent: {
    coral: {
      DEFAULT: "#FF5A36",
      deep: "#C93D1A",
      subtleBg: "#FFE4DA",
    },
    teal: {
      DEFAULT: "#12B3A8",
      deep: "#0B7A72",
    },
  },
  canvas: {
    DEFAULT: "#FFFFFF",
    soft: "#F7F7FB",
    peach: "#FDEBDD",
    lavender: "#E8E4FF",
    mint: "#E3F5EE",
  },
  hairline: "#E7E7EF",
  status: {
    good: { bg: "#E4F7EC", text: "#1E7A45" },
    warn: { bg: "#FDF1DC", text: "#97600A" },
    critical: { bg: "#FBE7E7", text: "#B23434" },
  },
} as const;

/** Supreme (Fontshare), self-hosted from assets/fonts/supreme/. */
export const fontFamily = {
  sans: [
    "Supreme",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ] as const,
};

export const typography = {
  displayHero: { size: "48px", sizeLg: "56px", weight: 800, lineHeight: 1.08 },
  displaySection: { size: "32px", sizeLg: "36px", weight: 800, lineHeight: 1.15 },
  headingLg: { size: "22px", sizeLg: "24px", weight: 700, lineHeight: 1.3 },
  headingMd: { size: "18px", weight: 600, lineHeight: 1.4 },
  body: { size: "15px", sizeLg: "16px", weight: 400, lineHeight: 1.5 },
  bodyTabular: {
    size: "14px",
    weight: 400,
    lineHeight: 1.5,
    fontVariantNumeric: "tabular-nums",
  },
  button: { size: "14px", sizeLg: "16px", weight: 600, lineHeight: 1.2 },
  caption: { size: "12px", sizeLg: "13px", weight: 500, lineHeight: 1.4 },
} as const;

/** 8px-Basis (04-DESIGN-SYSTEM.md §3). */
export const spacing = {
  xxs: "2px",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
  huge: "64px",
} as const;

export const radius = {
  xs: "4px",
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  pill: "9999px",
} as const;

export const elevation = {
  level0: "none",
  level1: "0 1px 3px rgba(27, 36, 48, 0.08)",
  level2: "0 8px 24px rgba(27, 36, 48, 0.08)",
} as const;

export const glass = {
  background: "rgba(255, 255, 255, 0.6)",
  blur: "20px",
  borderColor: colors.hairline,
  radius: radius.lg,
} as const;

export const tokens = {
  colors,
  fontFamily,
  typography,
  spacing,
  radius,
  elevation,
  glass,
} as const;

export type Tokens = typeof tokens;
