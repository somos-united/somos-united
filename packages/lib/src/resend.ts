import { Resend } from "resend";

/**
 * Lazy client, not module-scope — same reasoning as getBirdClient() in
 * bird.ts: constructing eagerly with a missing RESEND_API_KEY would throw
 * during Next.js's build-time page-data collection.
 */
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string | string[];
}

/**
 * Sends a transactional email from the verified `mail.somosunited.ch`
 * domain (Resend domain status: verified, sending enabled — receiving
 * is off for now, that's the separate Resend Inbound / email_messages
 * CRM feature from 07-MODULE-CRM.md §4, not built yet).
 *
 * Both `html` and `text` are required rather than using Resend's `react`
 * render option — this package has no React/JSX toolchain, and a plain
 * text fallback matters for accessibility/deliverability regardless.
 */
export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailParams) {
  const resend = getResendClient();
  return resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS ?? "hello@mail.somosunited.ch",
    to,
    subject,
    html,
    text,
    replyTo,
  });
}
