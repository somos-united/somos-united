import * as React from "react";

export type ButtonPrimaryPillProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

// Exported separately so a real <Link> (CMS-driven CTAs that navigate,
// e.g. apps/web's homepage sections) can share the exact same visual
// styling without duplicating this string by hand -- this component
// itself stays a real <button> since it's also used for actual form
// submits (admin/trainer login, save forms), which a link can't be.
export const PRIMARY_PILL_CLASSNAME =
  "inline-flex items-center justify-center rounded-pill bg-primary px-xl py-sm text-button text-on-primary transition-colors hover:bg-primary-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";

/**
 * `button-primary-pill` (04-DESIGN-SYSTEM.md §6): fill `primary`, text
 * `on-primary`, `rounded.pill`, padding 10px 20px, font role `button`.
 */
export const ButtonPrimaryPill = React.forwardRef<HTMLButtonElement, ButtonPrimaryPillProps>(
  ({ className = "", type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={`${PRIMARY_PILL_CLASSNAME} ${className}`} {...props} />
  ),
);
ButtonPrimaryPill.displayName = "ButtonPrimaryPill";
