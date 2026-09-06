import * as React from "react";

export type StatusBadgeTone = "good" | "warn" | "critical";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone: StatusBadgeTone;
  icon?: React.ReactNode;
}

const TONE_CLASSES: Record<StatusBadgeTone, string> = {
  good: "bg-status-good-bg text-status-good-text",
  warn: "bg-status-warn-bg text-status-warn-text",
  critical: "bg-status-critical-bg text-status-critical-text",
};

/**
 * `status-badge` (04-DESIGN-SYSTEM.md §6): Ampelsystem colors, `rounded.pill`,
 * icon + short text. Deliberately dampened (not saturated red/green/amber)
 * so a dashboard full of these stays calm rather than alarming.
 */
export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ tone, icon, className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center gap-xxs rounded-pill px-md py-xxs text-caption font-medium ${TONE_CLASSES[tone]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </span>
  ),
);
StatusBadge.displayName = "StatusBadge";
