#!/usr/bin/env tsx
/**
 * One-off smoke test for the Resend connection — confirms RESEND_API_KEY
 * and the verified mail.somosunited.ch domain actually work before wiring
 * real booking-confirmation/reminder/newsletter flows to
 * packages/lib/src/resend.ts.
 *
 * Usage: pnpm test:resend-email you@example.com
 * Reads RESEND_API_KEY from the environment — put it in a local .env file
 * and load it yourself (e.g. `dotenv -e .env -- pnpm test:resend-email ...`),
 * or export it in your shell. Never hardcode it here or anywhere else.
 */
import { sendEmail } from "@somos/lib";

const to = process.argv[2];

if (!to) {
  console.error("Usage: pnpm test:resend-email <email address>");
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not set in the environment.");
  process.exit(1);
}

async function main() {
  const result = await sendEmail({
    to,
    subject: "Test SOMOS United (Resend)",
    html: "<p>Test SOMOS United (Resend)</p>",
    text: "Test SOMOS United (Resend)",
  });

  if (result.error) {
    console.error("Send failed:", result.error);
    process.exit(1);
  }

  console.log("Sent:", result.data?.id);
}

main();
