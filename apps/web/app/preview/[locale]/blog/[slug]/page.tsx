import { ArrowLeft } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/locales";
import { SUPPORTED_LOCALES } from "@/lib/locales";

import { BLOG_PAGE_COPY, HOME_COPY } from "../../copy";
import { Nav } from "../../sections/Nav";
import { SiteFooter } from "../../sections/SiteFooter";
import { formatPostDate } from "../date";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    BLOG_PAGE_COPY[locale].posts.map((post) => ({ locale, slug: post.slug })),
  );
}

export default function BlogPostPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const t = HOME_COPY[params.locale];
  const copy = BLOG_PAGE_COPY[params.locale];

  const post = copy.posts.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }

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
        <article className="mx-auto max-w-3xl px-lg py-huge md:px-xl">
          <Link
            href={`/preview/${params.locale}/blog`}
            className="inline-flex items-center gap-xs text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            {copy.backToBlog}
          </Link>

          <span className="mt-lg block text-caption text-ink-mute">
            {formatPostDate(post.publishedAt, params.locale)}
          </span>
          <h1 className="mt-xs text-display-section text-ink">{post.title}</h1>

          {post.body.map((paragraph) => (
            <p key={paragraph} className="mt-md max-w-[65ch] text-body text-ink-secondary">
              {paragraph}
            </p>
          ))}
        </article>
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
