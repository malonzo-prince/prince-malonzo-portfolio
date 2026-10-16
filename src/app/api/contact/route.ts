import { handleContact } from "@/lib/contact";
import { createContactGuard } from "@/lib/contact-guard";
import { getEmailJsConfig, submitToEmailJs } from "@/lib/emailjs";
import { getSiteUrl } from "@/lib/site";

export const runtime = "nodejs";
const rateLimit = createContactGuard();

export async function POST(request: Request) {
  const emailJs = getEmailJsConfig();
  return handleContact(request, {
    ready: process.env.CONTACT_FORM_ENABLED !== "false" && emailJs !== null,
    siteUrl: getSiteUrl(),
    rateLimit,
    sendEmail: async (message) => {
      if (!emailJs) return { accepted: false };
      return submitToEmailJs(message, emailJs);
    },
  });
}
