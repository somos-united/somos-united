import { ButtonPrimaryPill } from "@somos/ui";

// Phase 0 placeholder only — no auth, no Kiosk-Modus, no Einsatzplan yet
// (those land in Phase 3, 00-MASTER-PLAN.md §3). Large touch target on the
// primary action previews the Kiosk-mode sizing requirement
// (04-DESIGN-SYSTEM.md §6: kiosk-checkin-button, ≥ 64×64px).
export default function TrainerHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-lg bg-canvas px-lg text-center">
      <h1 className="text-heading-lg text-ink">Somos United — Team</h1>
      <p className="max-w-sm text-body text-ink-secondary">
        Trainer-Login &amp; Kiosk-Check-in-Fundament (Phase 0). Volle Funktionalität folgt in
        Phase 3.
      </p>
      <ButtonPrimaryPill className="min-h-[64px] min-w-[64px] px-xxl text-button-lg">
        Login
      </ButtonPrimaryPill>
    </main>
  );
}
