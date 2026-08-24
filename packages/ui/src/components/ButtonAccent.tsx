import * as React from "react";

export type ButtonAccentProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * `button-accent` (04-DESIGN-SYSTEM.md §6): fill `accent-coral`, text
 * `on-primary` — secondary CTA that should still stand out (e.g. "Jetzt
 * anmelden" next to a `ButtonSecondary` "Mehr erfahren").
 */
export const ButtonAccent = React.forwardRef<HTMLButtonElement, ButtonAccentProps>(
  ({ className = "", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center rounded-pill bg-accent-coral px-xl py-sm text-button text-on-primary transition-colors hover:bg-accent-coral-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-coral disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  ),
);
ButtonAccent.displayName = "ButtonAccent";
