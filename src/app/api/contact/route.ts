import { profile } from "@/content/portfolio";
import { handleContact } from "@/lib/contact";
import { createContactGuard } from "@/lib/contact-guard";
import { submitToFormRelay } from "@/lib/form-relay";
import { getSiteUrl } from "@/lib/site";

export const runtime = "nodejs";
const rateLimit = createContactGuard();

export async function POST(request: Request) {
  return handleContact(request, {
    ready: process.env.CONTACT_FORM_ENABLED !== "false",
    siteUrl: getSiteUrl(),
    rateLimit,
    sendEmail: (message) =>
      submitToFormRelay(message, {
        recipient: process.env.CONTACT_TO_EMAIL || profile.email,
        siteUrl: getSiteUrl(),
        formId: process.env.FORMSUBMIT_FORM_ID,
      }),
  });
}
