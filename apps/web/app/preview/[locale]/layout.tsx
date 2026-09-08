import { notFound } from "next/navigation";

import { SUPPORTED_LOCALES, type Locale } from "@/lib/locales";

// No generateStaticParams here on purpose: it would force Next to
// prerender both locales for every page under this layout at build time,
// which silently overrides `dynamic = "force-dynamic"` on leaf pages
// (the homepage and module index both hit this - real CMS content baked
// into a stale build instead of fetched per-request). Individual pages
// still choose their own rendering strategy correctly without it; this
// was never needed for correctness, only as a build-time optimization
// that isn't worth the footgun.
export default function PreviewLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!SUPPORTED_LOCALES.includes(params.locale as Locale)) {
    notFound();
  }

  return children;
}
