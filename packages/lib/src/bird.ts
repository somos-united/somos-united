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

export interface WhatsAppTemplateParam {
  name: string;
  text: string;
}

export interface SendWhatsAppTemplateParams {
  to: string;
  templateSlug: string;
  bodyParams?: WhatsAppTemplateParam[];
}

/**
 * Sends a WhatsApp template message. Templates, not free text, are the
 * only content deliverable outside an open 24h customer-service window
 * (@messagebird/sdk@0.52.0's WhatsAppMessageSendRequest docs) - the only
 * mode this project needs, since booking reminders/CRM alerts are
 * outbound-initiated, not replies inside an active conversation.
 *
 * `from` is required here (BIRD_WHATSAPP_FROM, the WhatsApp Business
 * number in E.164 format) - the SDK only lets a *Bird-managed* template
 * omit it, which doesn't apply to a workspace-authored template like
 * ours.
 *
 * The template itself (slug, its approved copy, which variables it
 * takes) has to exist and be Meta-approved in the Bird dashboard first -
 * this function only sends against a template that's already live.
 */
export async function sendWhatsAppTemplate({
  to,
  templateSlug,
  bodyParams = [],
}: SendWhatsAppTemplateParams) {
  const bird = getBirdClient();
  return bird.whatsapp.send({
    to,
    from: process.env.BIRD_WHATSAPP_FROM!,
    template: {
      slug: templateSlug,
      components: [
        {
          type: "body",
          parameters: bodyParams.map((param) => ({ type: "text", ...param })),
        },
      ],
    },
  });
}
