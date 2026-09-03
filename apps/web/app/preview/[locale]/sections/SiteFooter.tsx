import { ArrowRight } from "@phosphor-icons/react/ssr";

/**
 * `footer-light` per 04-DESIGN-SYSTEM.md §6: canvas fill, ink-mute text,
 * caption type, generous top/bottom padding.
 */
export function SiteFooter({
  tagline,
  contactLabel,
  linksHeading,
}: {
  tagline: string;
  contactLabel: string;
  linksHeading: string;
}) {
  return (
    <footer className="border-t border-hairline bg-canvas py-huge">
      <div className="mx-auto flex max-w-6xl flex-col gap-xl px-lg md:flex-row md:items-start md:justify-between md:px-xl">
        <div>
          <span className="text-heading-md text-ink">Somos United</span>
          <p className="mt-xs max-w-[32ch] text-caption text-ink-mute">{tagline}</p>
        </div>

        <div>
          <p className="text-caption font-semibold text-ink">{linksHeading}</p>
          <a
            href="mailto:tech@somosunited.ch"
            className="mt-sm inline-flex items-center gap-xxs text-caption text-ink-mute underline decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            {contactLabel}
            <ArrowRight size={14} weight="bold" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
