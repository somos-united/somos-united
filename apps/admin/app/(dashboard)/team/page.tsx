import { ButtonPrimaryPill, GlassPanel } from "@somos/ui";

import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { updateTeamMemberRole } from "./actions";

interface TeamMember {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  created_at: string;
}

const ROLES = ["client", "trainer", "admin", "superuser"] as const;

export default async function TeamPage() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("list_team_members");

  if (error) {
    return (
      <div className="flex flex-col gap-md">
        <h1 className="text-heading-lg text-ink">Team</h1>
        <GlassPanel className="p-lg">
          <p className="text-body text-ink-secondary">
            Dein Account hat aktuell keine Berechtigung, andere Nutzer zu verwalten (dafür ist die
            separate <code>users</code>-Berechtigung nötig, unabhängig von der Admin-Rolle). Bitte
            einen Admin mit dieser Berechtigung bitten.
          </p>
        </GlassPanel>
      </div>
    );
  }

  const members = (data ?? []) as TeamMember[];

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="text-heading-lg text-ink">Team</h1>
      <div className="flex flex-col gap-sm">
        {members.map((member) => (
          <GlassPanel key={member.id} className="flex items-center justify-between gap-md p-md">
            <div className="flex flex-col">
              <span className="text-body text-ink">{member.email}</span>
              {member.permissions.length > 0 && (
                <span className="text-caption-lg text-ink-mute">
                  Zusatzrechte: {member.permissions.join(", ")}
                </span>
              )}
            </div>
            <form action={updateTeamMemberRole} className="flex items-center gap-sm">
              <input type="hidden" name="target_id" value={member.id} />
              <select
                name="role"
                defaultValue={member.role}
                className="rounded-sm border border-hairline bg-canvas px-md py-sm text-body text-ink focus:border-primary focus:outline-none"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <ButtonPrimaryPill type="submit">Speichern</ButtonPrimaryPill>
            </form>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
