import assert from "node:assert/strict";
import { test } from "node:test";
import { addContactDraft, feedbackBrief } from "../src/lib/contact-drafts";
import { publishedClientStories, type ClientStory } from "../src/content/client-stories";

test("meeting and feedback additions preserve a draft, replace earlier selections, and never truncate it", () => {
  const initial = "I need help with my project.\nKeep this detail.";
  const added = addContactDraft(initial, "Meeting request\nMonday");
  assert.equal(added, `${initial}\n\nMeeting request\nMonday`);
  assert.equal(addContactDraft(added!, "Meeting request\nMonday"), added);
  assert.equal(
    addContactDraft(added!, "Meeting request\nTuesday", "Meeting request\nMonday"),
    `${initial}\n\nMeeting request\nTuesday`,
  );
  assert.equal(addContactDraft("x".repeat(4990), "An addition that exceeds the limit"), null);
});

test("feedback is private by default and publishing permission is explicit in the prepared message", () => {
  const values = {
    project: "Shop project",
    role: "Owner",
    quote: "A clear and helpful collaboration throughout the project.",
  };
  assert.match(feedbackBrief({ ...values, publish: false }), /Permission to publish: Not granted/);
  assert.match(feedbackBrief({ ...values, publish: true }), /Permission to publish: Yes/);
  assert.match(feedbackBrief({ ...values, publish: true }), /Project: Shop project/);
});

test("only complete client stories with publication approval are eligible for display", () => {
  const approved: ClientStory = {
    id: "test-fixture",
    quote: "A test fixture, not a published testimonial.",
    clientName: "Test client",
    projectName: "Test project",
    contribution: "Test contribution",
    approvedForPublication: true,
    published: true,
  };
  assert.deepEqual(
    publishedClientStories([
      approved,
      { ...approved, approvedForPublication: false },
      { ...approved, published: false },
      { ...approved, quote: " " },
      { ...approved, contribution: "" },
    ]),
    [approved],
  );
});
