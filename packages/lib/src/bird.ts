import { BirdClient } from "@messagebird/sdk";

/**
 * Lazy client, not module-scope: constructing eagerly with a missing
 * BIRD_API_KEY would throw during Next.js's build-time page-data
 * collection, same reasoning as apps/web/lib/sanity.ts.
 */
function getBirdClient() {
  return new BirdClient({ apiKey: process.env.BIRD_API_KEY! });
}

/**
 * Bird requires a category on every free-text send (transactional,
 * marketing, authentication, or service) — see 07-MODULE-CRM.md §3.
 * "transactional" covers booking reminders and CRM SMS-alerts, the two
 * use cases this project actually needs.
 */
export type BirdSmsCategory = "transactional" | "marketing" | "authentication" | "service";

export interface SendSmsParams {
  to: string;
  text: string;
  category?: BirdSmsCategory;
}

/**
 * Sends a free-text SMS from the "SOMOSUnited" alphanumeric sender.
 * Deliberately not using Bird's template feature — templates and free
 * text are mutually exclusive on Bird's API, and this project's SMS
 * content (booking reminders, CRM alerts) is dynamic per-recipient, not
 * a fixed marketing template.
 */
export async function sendSms({ to, text, category = "transactional" }: SendSmsParams) {
  const bird = getBirdClient();
  return bird.sms.send({
    to,
    from: process.env.BIRD_SMS_SENDER_ID ?? "SOMOSUnited",
    text,
    category,
  });
}
