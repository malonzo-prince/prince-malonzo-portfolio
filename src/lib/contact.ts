import { z } from "zod";
import { hasControlCharacters } from "./text";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(80, "Please keep your name under 80 characters.")
    .refine((value) => !hasControlCharacters(value), "Please enter a valid name."),
  email: z.email("Please enter a valid email address.").max(254),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters.")
    .max(5000, "Please keep your message under 5,000 characters."),
  website: z.string().max(200).default(""),
  submissionId: z.uuid(),
});

export type ContactMessage = { name: string; email: string; message: string; submissionId: string };
export type ContactDependencies = {
  ready?: boolean;
  siteUrl: string;
  rateLimit?: (key: string) => number;
  sendEmail: (message: ContactMessage) => Promise<{ accepted: boolean }>;
};

const response = (status: number, message: string, errors?: Record<string, string[] | undefined>) =>
  Response.json(
    { message, ...(errors ? { errors } : {}) },
    { status, headers: { "Cache-Control": "no-store" } },
  );

async function readBoundedBody(request: Request) {
  if (!request.body) throw new Error("empty");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16_384) {
        await reader.cancel();
        throw new Error("large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function handleContact(request: Request, dependencies: ContactDependencies) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  const requestHost = request.headers.get("host");
  let originUrl: URL | undefined;
  try {
    if (origin) originUrl = new URL(origin);
  } catch {
    /* Reject malformed origins below. */
  }
  const matchesHost = Boolean(
    originUrl &&
    requestHost &&
    originUrl.host === requestHost &&
    ["http:", "https:"].includes(originUrl.protocol),
  );
  if (!origin || (!matchesHost && ![requestOrigin, dependencies.siteUrl].includes(origin)))
    return response(403, "Please send your message from the portfolio website.");
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    return response(415, "Please submit the contact form as JSON.");
  if (dependencies.ready === false)
    return response(503, "The contact form is unavailable right now. Please email me directly.");
  let input: unknown;
  try {
    input = await readBoundedBody(request);
  } catch (error) {
    return response(
      error instanceof Error && error.message === "large" ? 413 : 400,
      "Your message could not be read. Please check the form and try again.",
    );
  }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success)
    return response(
      400,
      "Please check the highlighted fields.",
      z.flattenError(parsed.error).fieldErrors,
    );
  if (parsed.data.website)
    return response(400, "Your message could not be verified. Please try again.");
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const retryAfter = dependencies.rateLimit?.(client) || 0;
  if (retryAfter) {
    const limited = response(
      429,
      "A few messages have been sent recently. Please wait a little, or email me directly.",
    );
    limited.headers.set("Retry-After", String(retryAfter));
    return limited;
  }
  try {
    const result = await dependencies.sendEmail(parsed.data);
    if (!result.accepted)
      return response(
        502,
        "Your message could not be sent. Please try again or email me directly.",
      );
    return response(200, "Thanks for reaching out. Your message has been submitted.");
  } catch {
    return response(502, "Your message could not be sent. Please try again or email me directly.");
  }
}
