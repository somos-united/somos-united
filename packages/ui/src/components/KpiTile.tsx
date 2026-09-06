import * as React from "react";

export interface KpiTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  badge?: React.ReactNode;
}

/**
 * `kpi-tile` (04-DESIGN-SYSTEM.md §6): large `body-tabular` number, `caption`
 * label below, optional status-badge in the corner — the base building
 * block of every admin dashboard. Plain bordered card, not a glass panel —
 * §7 calls for admin to stay "ruhiger, dichter" (calmer, denser); glass
 * effects are reserved for nav/login/overlays, not every tile on a page.
 */
export const KpiTile = React.forwardRef<HTMLDivElement, KpiTileProps>(
  ({ label, value, badge, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col gap-xs rounded-lg border border-hairline bg-canvas p-lg ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between gap-sm">
        <span className="text-display-section tabular-nums text-ink">{value}</span>
        {badge}
      </div>
      <span className="text-caption text-ink-mute">{label}</span>
    </div>
  ),
);
KpiTile.displayName = "KpiTile";
