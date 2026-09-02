import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { detectLocale } from "@/lib/detect-locale";

// Same reasoning as app/page.tsx: force per-request rendering so the
// redirect actually fires (see that file's comment for the full story).
export const dynamic = "force-dynamic";

export default function PreviewRootPage() {
  const acceptLanguage = headers().get("accept-language");
  redirect(`/preview/${detectLocale(acceptLanguage)}`);
}
