import Link from "next/link";

/**
 * Fallback for anything unmatched outside /preview/[locale]/* (which has
 * its own locale-aware, branded not-found.tsx). No reliable locale
 * context this far up the tree, so kept bilingual and simple rather
 * than guessing a language.
 */
export default function NotFound() {
  return (
    <div className="px-lg py-huge text-center">
      <span className="text-display-hero text-primary">404</span>
      <p className="mt-sm text-body text-ink-secondary">
        Seite nicht gefunden. / Page not found.
      </p>
      <p className="mt-xl">
        <Link
          href="/de"
          className="mr-lg text-body text-primary underline decoration-1 underline-offset-4"
        >
          Zur Startseite
        </Link>
        <Link href="/en" className="text-body text-primary underline decoration-1 underline-offset-4">
          Back to homepage
        </Link>
      </p>
    </div>
  );
}
