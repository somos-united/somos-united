#!/usr/bin/env tsx
/**
 * One-off smoke test for the Bird SMS connection — confirms BIRD_API_KEY
 * and the "SOMOSUnited" sender actually work before wiring real
 * booking-reminder/CRM-alert flows to packages/lib/src/bird.ts.
 *
 * Usage: pnpm test:bird-sms +41791234567
 * Reads BIRD_API_KEY from the environment — put it in a local .env file
 * and load it yourself (e.g. `dotenv -e .env -- pnpm test:bird-sms ...`),
 * or export it in your shell. Never hardcode it here or anywhere else.
 */
import { sendSms } from "@somos/lib";

const to = process.argv[2];

if (!to) {
  console.error("Usage: pnpm test:bird-sms <phone number, e.g. +41791234567>");
  process.exit(1);
}

if (!process.env.BIRD_API_KEY) {
  console.error("BIRD_API_KEY is not set in the environment.");
  process.exit(1);
}

const message = await sendSms({ to, text: "Test SOMOS United (Bird)" });
console.log("Sent:", message.id, message.status);
