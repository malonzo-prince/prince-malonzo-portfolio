import type { ContactMessage } from "./contact";

export type EmailJsConfig = {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey?: string;
};

export function getEmailJsConfig(
  environment: Record<string, string | undefined> = process.env,
): EmailJsConfig | null {
  const serviceId = environment.EMAILJS_SERVICE_ID?.trim();
  const templateId = environment.EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = environment.EMAILJS_PUBLIC_KEY?.trim();
  const privateKey = environment.EMAILJS_PRIVATE_KEY?.trim();

  if (!serviceId || !templateId || !publicKey) return null;
  return { serviceId, templateId, publicKey, ...(privateKey ? { privateKey } : {}) };
}

export async function submitToEmailJs(
  message: ContactMessage,
  config: EmailJsConfig,
  fetcher: typeof fetch = fetch,
): Promise<{ accepted: boolean }> {
  const result = await fetcher("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      ...(config.privateKey ? { accessToken: config.privateKey } : {}),
      template_params: {
        name: message.name,
        email: message.email,
        message: message.message,
      },
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!result.ok) return { accepted: false };
  const confirmation = (await result.text()).trim();
  return { accepted: confirmation === "OK" || confirmation === '"OK"' };
}
