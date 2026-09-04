import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import type { Locale } from "@/lib/locales";

import { BLOG_PAGE_COPY, HOME_COPY } from "../copy";
import { Nav } from "../sections/Nav";
import { SiteFooter } from "../sections/SiteFooter";
import { formatPostDate } from "./date";

/**
 * Last of the four Phase 1 public pages (00-MASTER-PLAN.md §3). Simple
 * list -> detail, matching exactly what the `blogPost` Sanity schema
 * supports today (title, slug, publishedAt, body) - no excerpt/cover
 * fields exist there yet, so `excerpt` here is a placeholder-only
 * convenience (see BlogPost in copy.ts) rather than something assumed
 * already in the CMS.
 */
export default function BlogIndexPage({ params }: { params: { locale: Locale } }) {
  const t = HOME_COPY[params.locale];
  const copy = BLOG_PAGE_COPY[params.locale];

  return (
    <>
      <Nav
        locale={params.locale}
        cta={t.nav.cta}
        ctaShort={t.nav.ctaShort}
        moduleLabel={t.nav.moduleLabel}
        aboutLabel={t.nav.aboutLabel}
        blogLabel={t.nav.blogLabel}
        menuOpenLabel={t.nav.menuOpenLabel}
        menuCloseLabel={t.nav.menuCloseLabel}
        active="blog"
      />
      <main>
        <section className="mx-auto max-w-3xl px-lg py-huge md:px-xl">
          <h1 className="text-display-section text-ink">{copy.indexHeading}</h1>
          <p className="mt-sm max-w-[60ch] text-body text-ink-secondary">{copy.indexSubtext}</p>

          <div className="mt-xl flex flex-col gap-lg">
            {copy.posts.map((post) => (
              <Link
                key={post.slug}
                href={`/preview/${params.locale}/blog/${post.slug}`}
                className="rounded-lg border border-hairline p-xl transition-colors hover:border-primary"
              >
                <span className="text-caption text-ink-mute">
                  {formatPostDate(post.publishedAt, params.locale)}
                </span>
                <h2 className="mt-xs text-heading-lg text-ink">{post.title}</h2>
                <p className="mt-sm text-body text-ink-secondary">{post.excerpt}</p>
                <span className="mt-md inline-flex items-center gap-xs text-button text-primary">
                  {copy.readMore}
                  <ArrowRight size={16} weight="bold" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter
        locale={params.locale}
        tagline={t.footer.tagline}
        contactLabel={t.footer.contactLabel}
        linksHeading={t.footer.linksHeading}
        legalHeading={t.footer.legalHeading}
        impressumLabel={t.footer.impressumLabel}
        datenschutzLabel={t.footer.datenschutzLabel}
      />
    </>
  );
}
