import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Somos United — Admin",
  description: "Backoffice: CRM, Finance, User-DB (Phase 0 foundation).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
