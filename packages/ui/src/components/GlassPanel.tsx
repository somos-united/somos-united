import * as React from "react";

export type GlassPanelProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * `glass-panel` (04-DESIGN-SYSTEM.md §4/§6): background rgba(255,255,255,.6),
 * backdrop-filter blur(20px), 1px `hairline` border, radius `lg`. Used
 * sparingly — nav over the hero, onboarding-tooltip cards, modal overlays,
 * the Kiosk overlay.
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-lg border border-hairline bg-white/60 backdrop-blur-glass ${className}`}
      {...props}
    />
  ),
);
GlassPanel.displayName = "GlassPanel";
