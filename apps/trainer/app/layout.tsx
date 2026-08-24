import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Somos United — Team",
  description: "Trainer-Login + Kiosk-Check-in (Phase 0 foundation).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
