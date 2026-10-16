import assert from "node:assert/strict";
import { test } from "node:test";
import { handleContact, type ContactDependencies } from "../src/lib/contact";
import { createContactGuard } from "../src/lib/contact-guard";

const valid = {
  name: "Test Visitor",
  email: "visitor@example.com",
  message: "I would like to discuss a web application project.",
  website: "",
  submissionId: "f2b93416-0fe5-4d5b-9af1-2ad111313af1",
};
function request(body: unknown = valid, origin = "https://portfolio.test") {
  return new Request("https://portfolio.test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
}
function dependencies(overrides: Partial<ContactDependencies> = {}): ContactDependencies {
  return {
    ready: true,
    siteUrl: "https://portfolio.test",
    sendEmail: async () => ({ accepted: true }),
    ...overrides,
  };
}

test("valid messages reach email delivery with the visitor's reply address", async () => {
  let sent: { email: string; name: string } | undefined;
  const result = await handleContact(
    request(),
    dependencies({
      sendEmail: async (message) => {
        sent = message;
        return { accepted: true };
      },
    }),
  );
  assert.equal(result.status, 200);
  assert.equal(sent?.email, valid.email);
  assert.equal(sent?.name, valid.name);
});

test("invalid fields cannot reach email delivery", async () => {
  let sent = false;
  const result = await handleContact(
    request({ ...valid, email: "not-an-email", message: "short" }),
    dependencies({
      sendEmail: async () => {
        sent = true;
        return { accepted: true };
      },
    }),
  );
  assert.equal(result.status, 400);
  assert.equal(sent, false);
  assert.ok((await result.json()).errors.email);
});

test("cross-origin submissions are rejected before delivery", async () => {
  let sent = false;
  const result = await handleContact(
    request(valid, "https://unrelated.test"),
    dependencies({
      sendEmail: async () => {
        sent = true;
        return { accepted: true };
      },
    }),
  );
  assert.equal(result.status, 403);
  assert.equal(sent, false);
});

test("a development proxy's internal URL does not reject the browser's actual host", async () => {
  const proxied = new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      Host: "127.0.0.1:3000",
      Origin: "http://127.0.0.1:3000",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(valid),
  });
  const result = await handleContact(
    proxied,
    dependencies({
      siteUrl: "https://portfolio.test",
    }),
  );
  assert.equal(result.status, 200);
});

test("an explicitly disabled contact form never returns success", async () => {
  let sent = false;
  const result = await handleContact(
    request(),
    dependencies({
      ready: false,
      sendEmail: async () => {
        sent = true;
        return { accepted: true };
      },
    }),
  );
  assert.equal(result.status, 503);
  assert.equal(sent, false);
});

test("rate-limited messages do not reach email delivery and include a retry time", async () => {
  let sent = false;
  const result = await handleContact(
    request(),
    dependencies({
      rateLimit: () => 60,
      sendEmail: async () => {
        sent = true;
        return { accepted: true };
      },
    }),
  );
  assert.equal(result.status, 429);
  assert.equal(result.headers.get("retry-after"), "60");
  assert.equal(sent, false);
});

test("the honeypot rejects automated submissions", async () => {
  const result = await handleContact(
    request({ ...valid, website: "spam.example" }),
    dependencies(),
  );
  assert.equal(result.status, 400);
});

test("provider rejections and network failures return a safe message without exposing credentials", async () => {
  const rejected = await handleContact(
    request(),
    dependencies({ sendEmail: async () => ({ accepted: false }) }),
  );
  assert.equal(rejected.status, 502);
  const unavailable = await handleContact(
    request(),
    dependencies({
      sendEmail: async () => {
        throw new Error("Provider rejected test-private-key");
      },
    }),
  );
  assert.equal(unavailable.status, 502);
  assert.deepEqual(await unavailable.json(), {
    message: "Your message could not be sent. Please try again or email me directly.",
  });
});

test("oversized bodies are rejected even without a content-length header", async () => {
  const result = await handleContact(
    request({ ...valid, message: "x".repeat(20000) }),
    dependencies(),
  );
  assert.equal(result.status, 413);
});

test("malformed JSON and unsupported content types return useful errors", async () => {
  const malformed = new Request("https://portfolio.test/api/contact", {
    method: "POST",
    headers: { Origin: "https://portfolio.test", "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal((await handleContact(malformed, dependencies())).status, 400);
  const unsupported = new Request("https://portfolio.test/api/contact", {
    method: "POST",
    headers: { Origin: "https://portfolio.test", "Content-Type": "text/plain" },
    body: "hello",
  });
  assert.equal((await handleContact(unsupported, dependencies())).status, 415);
});

test("header-injection attempts in names are rejected", async () => {
  assert.equal(
    (
      await handleContact(
        request({ ...valid, name: "Visitor\r\nBcc: other@example.com" }),
        dependencies(),
      )
    ).status,
    400,
  );
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
