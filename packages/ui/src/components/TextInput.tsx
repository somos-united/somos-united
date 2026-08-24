import * as React from "react";

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * `text-input` (04-DESIGN-SYSTEM.md §6): `canvas` fill, 1px `hairline`
 * border, radius `sm`, focus border `primary`.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = "", type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={`w-full rounded-sm border border-hairline bg-canvas px-md py-sm text-body text-ink placeholder:text-ink-mute focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  ),
);
TextInput.displayName = "TextInput";
