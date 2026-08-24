import { redirect } from "next/navigation";

// No locale prefix -> redirect to the default locale (01-ARCHITECTURE.md §6:
// "kein Locale-Präfix = Redirect auf Default (de)").
export default function RootPage() {
  redirect("/de");
}
