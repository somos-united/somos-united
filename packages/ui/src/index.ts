// @somos/ui — design tokens + minimal base components (04-DESIGN-SYSTEM.md).
// Deliberately minimal for Phase 0: just enough to prove the token system
// works consistently across apps/web, apps/admin, apps/trainer. The full
// component library (module-card, kpi-tile, status-badge, ...) lands later.

export * from "./tokens";

export { ButtonPrimaryPill, PRIMARY_PILL_CLASSNAME } from "./components/ButtonPrimaryPill";
export type { ButtonPrimaryPillProps } from "./components/ButtonPrimaryPill";

export { ButtonSecondary, SECONDARY_CLASSNAME } from "./components/ButtonSecondary";
export type { ButtonSecondaryProps } from "./components/ButtonSecondary";

export { ButtonAccent } from "./components/ButtonAccent";
export type { ButtonAccentProps } from "./components/ButtonAccent";

export { TextInput } from "./components/TextInput";
export type { TextInputProps } from "./components/TextInput";

export { GlassPanel } from "./components/GlassPanel";
export type { GlassPanelProps } from "./components/GlassPanel";

export { StatusBadge } from "./components/StatusBadge";
export type { StatusBadgeProps, StatusBadgeTone } from "./components/StatusBadge";

export { KpiTile } from "./components/KpiTile";
export type { KpiTileProps } from "./components/KpiTile";
