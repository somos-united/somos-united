"use server";

import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "../../lib/supabase/server";
import { getSupabaseServiceRoleClient } from "../../lib/supabase/service-role";

// Internal tool: staff on Somos United's own domain can self-serve a
// login link (still lands on "access pending" until an existing admin
// promotes their role — see (dashboard)/layout.tsx). Anyone else only
// gets a link if their email already has an approved admin/superuser
// account — checked via a security-definer RPC rather than hardcoding
// specific emails, so an existing admin on any domain (e.g. Danny's own
// danny@neonstudio.ch) keeps working without a code change. A stranger's
// email that matches neither never reaches Supabase Auth at all, so no
// account gets created for them.
const SELF_SERVE_EMAIL_DOMAIN = "@somosunited.ch";

export async function sendMagicLink(formData: FormData): Promise<void> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.includes("@")) {
    redirect("/login?status=error");
  }

  if (!email.toLowerCase().endsWith(SELF_SERVE_EMAIL_DOMAIN)) {
    // service_role only, deliberately — see service-role.ts's doc comment
    // and 20260906010000_email_is_approved_admin.sql. The anon-key client
    // can't call this RPC at all (revoked), so a stranger probing this
    // form can't learn anything either way.
    const { data: isApprovedAdmin } = await getSupabaseServiceRoleClient().rpc(
      "email_is_approved_admin",
      { email_to_check: email },
    );
    if (!isApprovedAdmin) {
      redirect("/login?status=error");
    }
  }

  const supabase = getSupabaseServerClient();
  const siteUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001";

  const { error } = await supabase.auth.signInWithOtp({
    email: email as string,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  redirect(error ? "/login?status=error" : "/login?status=sent");
}
