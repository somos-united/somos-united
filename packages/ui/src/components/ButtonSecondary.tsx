import * as React from "react";

export type ButtonSecondaryProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

// See ButtonPrimaryPill's PRIMARY_PILL_CLASSNAME for why this is exported.
export const SECONDARY_CLASSNAME =
  "inline-flex items-center justify-center rounded-pill border-[1.5px] border-primary bg-transparent px-xl py-sm text-button text-primary transition-colors hover:bg-primary-subdued-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";

/**
 * `button-secondary` (04-DESIGN-SYSTEM.md §6): transparent, 1.5px border
 * `primary`, text `primary`, otherwise identical to ButtonPrimaryPill.
 */
export const ButtonSecondary = React.forwardRef<HTMLButtonElement, ButtonSecondaryProps>(
  ({ className = "", type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={`${SECONDARY_CLASSNAME} ${className}`} {...props} />
  ),
);
ButtonSecondary.displayName = "ButtonSecondary";
