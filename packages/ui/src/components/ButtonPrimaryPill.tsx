import * as React from "react";

export type ButtonPrimaryPillProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * `button-primary-pill` (04-DESIGN-SYSTEM.md §6): fill `primary`, text
 * `on-primary`, `rounded.pill`, padding 10px 20px, font role `button`.
 */
export const ButtonPrimaryPill = React.forwardRef<HTMLButtonElement, ButtonPrimaryPillProps>(
  ({ className = "", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center rounded-pill bg-primary px-xl py-sm text-button text-on-primary transition-colors hover:bg-primary-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  ),
);
ButtonPrimaryPill.displayName = "ButtonPrimaryPill";
