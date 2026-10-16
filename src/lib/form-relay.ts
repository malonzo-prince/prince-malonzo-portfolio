export type RelayMessage = { name: string; email: string; message: string; submissionId: string };
export type RelayResult = { accepted: boolean; requiresActivation?: boolean };

export function parseRelayResult(status: number, value: unknown): RelayResult {
  if (!value || typeof value !== "object") return { accepted: false };
  const data = value as Record<string, unknown>;
  const message = typeof data.message === "string" ? data.message : "";
  const requiresActivation =
    /(?:activat|confirm).*?(?:email|form)|(?:email|form).*?(?:activat|confirm)/i.test(message);
  const accepted =
    status >= 200 && status < 300 && (data.success === true || data.success === "true");
  return {
    accepted: accepted && !requiresActivation,
    ...(requiresActivation ? { requiresActivation: true } : {}),
  };
}

export async function submitToFormRelay(
  message: RelayMessage,
  options: { recipient: string; siteUrl: string; formId?: string },
  fetcher: typeof fetch = fetch,
): Promise<RelayResult> {
  const endpoint = options.formId || options.recipient;
  const result = await fetcher(`https://formsubmit.co/ajax/${encodeURIComponent(endpoint)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Referer: options.siteUrl,
    },
    body: JSON.stringify({
      name: message.name,
      email: message.email,
      message: message.message,
      _subject: `Portfolio enquiry from ${message.name}`,
      _template: "table",
      _url: `${options.siteUrl}/#contact`,
      _honey: "",
    }),
    signal: AbortSignal.timeout(12000),
  });
  return parseRelayResult(result.status, await result.json());
}
