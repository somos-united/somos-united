import { ButtonPrimaryPill, GlassPanel, TextInput } from "@somos/ui";

import { sendMagicLink } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-md bg-canvas-soft px-lg">
      <GlassPanel className="flex w-full max-w-sm flex-col gap-md p-xl">
        <div className="flex flex-col gap-xs">
          <h1 className="text-heading-lg text-ink">Somos United — Admin</h1>
          <p className="text-body text-ink-secondary">
            Login per Magic Link — keine Passwörter.
          </p>
        </div>

        {status === "sent" && (
          <p className="rounded-sm bg-canvas px-md py-sm text-body text-ink-secondary">
            Link verschickt — bitte E-Mail-Postfach prüfen (auch Spam-Ordner).
          </p>
        )}
        {status === "error" && (
          <p className="rounded-sm border border-hairline bg-status-critical-bg px-md py-sm text-body text-status-critical-text">
            Konnte den Link nicht senden. Bitte E-Mail-Adresse prüfen und erneut versuchen.
          </p>
        )}

        <form action={sendMagicLink} className="flex flex-col gap-sm">
          <TextInput
            type="email"
            name="email"
            required
            placeholder="name@somosunited.ch"
            autoComplete="email"
          />
          <ButtonPrimaryPill type="submit">Login-Link senden</ButtonPrimaryPill>
        </form>
      </GlassPanel>
    </main>
  );
}
