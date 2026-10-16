import assert from "node:assert/strict";
import { test } from "node:test";
import { getBlueprint } from "../src/lib/blueprint";

test("a mobile blueprint includes only the selected requirements in a usable contact brief", () => {
  const result = getBlueprint("mobile", ["maps", "accounts"]);
  assert.ok(result.stack.includes("React Native"));
  assert.ok(result.stack.includes("Mapbox API"));
  assert.ok(!result.stack.includes("Next.js"));
  assert.match(result.brief, /Mobile application/);
  assert.match(result.brief, /Maps & places/);
  assert.ok(!result.brief.includes("Notifications"));
  assert.match(result.layers[2].value, /secure user access/);
});

test("a cross-platform blank canvas avoids made-up scope and quotes", () => {
  const result = getBlueprint("both", []);
  assert.ok(result.stack.includes("React Native") && result.stack.includes("Next.js"));
  assert.match(result.brief, /Let’s work these out together/);
  assert.deepEqual(result.labels, []);
  assert.ok(!result.brief.includes("₱"));
});

test("a POS brief includes the sales requirements and its specific workflow", () => {
  const result = getBlueprint("web", ["sales", "inventory", "reports"], {
    category: "pos",
    notes: "A small café with two cashiers and stock tracking.",
  });
  assert.equal(result.projectLabel, "Point of sale (POS)");
  assert.match(result.layers[1].value, /Sales, receipts/);
  assert.match(result.brief, /Sales & receipts,|Sales & receipts/);
  assert.match(result.brief, /Products & inventory/);
  assert.match(result.brief, /two cashiers and stock tracking/);
  assert.ok(!result.brief.includes("Online payments"));
});

test("a custom project preserves its name and requirements in the contact brief", () => {
  const result = getBlueprint("both", ["records", "notifications"], {
    category: "custom",
    customName: "Community equipment lending portal",
    notes: "Track borrowed equipment and notify people before returns are due.",
  });
  assert.equal(result.projectLabel, "Community equipment lending portal");
  assert.match(result.brief, /Project type: Community equipment lending portal/);
  assert.match(result.brief, /Platform: Web \+ mobile/);
  assert.match(result.brief, /before returns are due/);
});

test("a content-only custom website does not assume a separate backend and database", () => {
  const result = getBlueprint("web", ["content"], { category: "website" });
  assert.ok(!result.stack.includes("Node.js") && !result.stack.includes("PostgreSQL"));
  assert.equal(result.layers[2].value, "Page content + site assets");
});
