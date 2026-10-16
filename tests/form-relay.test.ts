import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRelayResult, submitToFormRelay } from "../src/lib/form-relay";
import { createContactGuard } from "../src/lib/contact-guard";

test("relay responses handle boolean and string success flags without treating false as success", () => {
  assert.equal(parseRelayResult(200, { success: "true" }).accepted, true);
  assert.equal(parseRelayResult(200, { success: true }).accepted, true);
  assert.equal(parseRelayResult(200, { success: "false" }).accepted, false);
  assert.equal(parseRelayResult(502, { success: true }).accepted, false);
  assert.equal(parseRelayResult(200, null).accepted, false);
});

test("the actual FormSubmit activation response cannot show a delivery success", () => {
  const message =
    "This form needs Activation. We've sent you an email containing an 'Activate Form' link. Just click it and your form will be actived!";
  assert.deepEqual(parseRelayResult(200, { success: "false", message }), {
    accepted: false,
    requiresActivation: true,
  });
});

test("the relay sends a fixed recipient, reply email, and safe field whitelist", async () => {
  let payload: Record<string, string> | undefined;
  let address = "";
  const fetcher: typeof fetch = async (input, init) => {
    address = String(input);
    payload = JSON.parse(String(init?.body));
    return Response.json({ success: "true", message: "Form submitted successfully." });
  };
  const result = await submitToFormRelay(
    {
      name: "Visitor",
      email: "visitor@example.com",
      message: "I have an idea for a website.",
      submissionId: "f2b93416-0fe5-4d5b-9af1-2ad111313af1",
    },
    { recipient: "owner@example.com", siteUrl: "https://portfolio.test" },
    fetcher,
  );
  assert.equal(result.accepted, true);
  assert.equal(address, "https://formsubmit.co/ajax/owner%40example.com");
  assert.equal(payload?.email, "visitor@example.com");
  assert.equal(payload?._url, "https://portfolio.test/#contact");
  assert.equal(payload?._captcha, undefined);
  assert.equal(payload?._cc, undefined);
});

test("the contact guard throttles a client, expires, and keeps other clients independent", () => {
  let timestamp = 1000;
  const guard = createContactGuard({ limit: 2, windowMs: 10000, now: () => timestamp });
  assert.equal(guard("client-a"), 0);
  assert.equal(guard("client-a"), 0);
  assert.equal(guard("client-a"), 10);
  assert.equal(guard("client-b"), 0);
  timestamp += 10001;
  assert.equal(guard("client-a"), 0);
});
