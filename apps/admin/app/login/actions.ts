"use server";

import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "../../lib/supabase/server";

export async function sendMagicLink(formData: FormData): Promise<void> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.includes("@")) {
    redirect("/login?status=error");
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
