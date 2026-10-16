import assert from "node:assert/strict";
import { test } from "node:test";
import { getEmailJsConfig, submitToEmailJs } from "../src/lib/emailjs";

const message = {
  name: "Visitor",
  email: "visitor@example.com",
  message: "I have an idea for a website.\nCould we discuss it?",
  submissionId: "f2b93416-0fe5-4d5b-9af1-2ad111313af1",
};
const config = {
  serviceId: "service_test",
  templateId: "template_test",
  publicKey: "test-public-key",
};

test("EmailJS requires all three identifiers and treats an empty private key as absent", () => {
  const environment = {
    EMAILJS_SERVICE_ID: " service_test ",
    EMAILJS_TEMPLATE_ID: " template_test ",
    EMAILJS_PUBLIC_KEY: " test-public-key ",
    EMAILJS_PRIVATE_KEY: " ",
  };
  assert.deepEqual(getEmailJsConfig(environment), config);
  for (const key of ["EMAILJS_SERVICE_ID", "EMAILJS_TEMPLATE_ID", "EMAILJS_PUBLIC_KEY"]) {
    assert.equal(getEmailJsConfig({ ...environment, [key]: " " }), null);
    assert.equal(getEmailJsConfig({ ...environment, [key]: undefined }), null);
  }
  assert.deepEqual(
    getEmailJsConfig({ ...environment, EMAILJS_PRIVATE_KEY: " test-private-key " }),
    {
      ...config,
      privateKey: "test-private-key",
    },
  );
});

test("EmailJS sends the selected template with only the three contact variables", async () => {
  let address = "";
  let options: RequestInit | undefined;
  const fetcher: typeof fetch = async (input, init) => {
    address = String(input);
    options = init;
    return new Response("OK");
  };
  const visitorInput = {
    ...message,
    to_email: "unrelated@example.com",
    accessToken: "visitor-value",
  };
  const result = await submitToEmailJs(visitorInput, config, fetcher);
  assert.equal(result.accepted, true);
  assert.equal(address, "https://api.emailjs.com/api/v1.0/email/send");
  assert.equal(options?.method, "POST");
  assert.equal(new Headers(options?.headers).get("content-type"), "application/json");
  assert.deepEqual(JSON.parse(String(options?.body)), {
    service_id: config.serviceId,
    template_id: config.templateId,
    user_id: config.publicKey,
    template_params: { name: message.name, email: message.email, message: message.message },
  });
  assert.ok(options?.signal instanceof AbortSignal);
});

test("EmailJS private authorization uses the server key without adding it to template variables", async () => {
  let payload: Record<string, unknown> | undefined;
  const fetcher: typeof fetch = async (_input, init) => {
    payload = JSON.parse(String(init?.body));
    return new Response("OK");
  };
  await submitToEmailJs(message, { ...config, privateKey: "test-private-key" }, fetcher);
  assert.equal(payload?.accessToken, "test-private-key");
  assert.deepEqual(payload?.template_params, {
    name: message.name,
    email: message.email,
    message: message.message,
  });
});

test("EmailJS accepts documented confirmations and rejects errors and unexpected responses", async () => {
  for (const [status, body, accepted] of [
    [200, "OK", true],
    [200, '"OK"', true],
    [200, "OK\n", true],
    [403, "API calls are disabled for non-browser applications", false],
    [429, "Too Many Requests", false],
    [503, "OK", false],
    [200, "", false],
    [200, '{"success":false}', false],
  ] as const) {
    const fetcher: typeof fetch = async () => new Response(body, { status });
    assert.equal((await submitToEmailJs(message, config, fetcher)).accepted, accepted);
  }
});
