import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Somos United", template: "%s | Somos United" },
  description: "Somos United — mentale Stärkung für junge Menschen.",
};

// Single root layout (Next.js requires exactly one <html>/<body> pair per
// route tree). Locale-aware content lives under app/[locale]/ — the `lang`
// attribute is fixed to "de" here for the Phase-0 stub; per-locale <html
// lang> switching lands with the real i18n routing in Phase 1
// (01-ARCHITECTURE.md §6).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
