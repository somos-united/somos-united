import type { Locale } from "@/lib/locales";
import { getPageBySlug } from "@/lib/sanity";

import { SectionGrid } from "./SectionGrid";

// Content comes from Sanity and can change without a redeploy — always
// fetch fresh rather than caching a stale build-time snapshot.
export const dynamic = "force-dynamic";

const NO_CONTENT_COPY: Record<Locale, { heading: string; body: string }> = {
  de: {
    heading: "Noch keine Inhalte",
    body: 'Für "home" existiert noch kein Sanity-Dokument in dieser Sprache. Im Sanity Studio unter "Seite" anlegen (Slug: home).',
  },
  en: {
    heading: "No content yet",
    body: 'No Sanity "page" document exists for "home" in this language yet. Create one in Sanity Studio (slug: home).',
  },
};

export default async function PreviewHomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const page = await getPageBySlug("home", params.locale);
  const empty = NO_CONTENT_COPY[params.locale];

  return (
    <main className="mx-auto max-w-5xl px-xl py-huge">
      {page ? (
        <>
          <h1 className="text-display-section text-ink">{page.title}</h1>
          <div className="mt-xxl">
            <SectionGrid sections={page.sections ?? []} />
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline p-xl text-center">
          <h1 className="text-heading-lg text-ink">{empty.heading}</h1>
          <p className="mt-sm text-body text-ink-mute">{empty.body}</p>
        </div>
      )}
    </main>
  );
}
