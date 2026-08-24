import { GlassPanel } from "@somos/ui";

// Phase 0 placeholder only — no auth, no CRM/Finance UI yet (those land in
// Phase 4/5, 00-MASTER-PLAN.md §3). This just proves the monorepo builds
// end-to-end and @somos/ui/Tailwind tokens resolve inside apps/admin, at the
// calmer/denser visual density the admin app is supposed to have
// (04-DESIGN-SYSTEM.md §7).
export default function AdminHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-md bg-canvas-soft px-lg text-center">
      <GlassPanel className="flex flex-col items-center gap-sm p-xl">
        <h1 className="text-heading-lg text-ink">Somos United — Admin</h1>
        <p className="max-w-sm text-body text-ink-secondary">
          Backoffice-Fundament (Phase 0). CRM/Finance-Module folgen in Phase 4/5.
        </p>
      </GlassPanel>
    </main>
  );
}
