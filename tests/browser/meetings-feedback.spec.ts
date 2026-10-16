import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ timezoneId: "America/New_York" });

async function chooseMeeting(page: import("@playwright/test").Page) {
  await page.clock.setFixedTime(new Date("2026-10-16T08:00:00Z"));
  await page.goto("/#meeting-planner");
  const planner = page.locator("#meeting-planner");
  await expect(planner.getByLabel("Your timezone")).toHaveValue("America/New_York");
  await planner.getByLabel("Your meeting date").fill("2026-10-17");
  await planner.getByLabel("Your preferred hours").selectOption("daytime");
  return planner;
}

test("meeting requests convert both dates, preserve the contact draft, and replace earlier choices", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  const planner = await chooseMeeting(page);
  await expect(planner.getByText("Meeting requests welcome 24/7")).toBeVisible();
  await expect(planner.locator(".meeting-selection")).toContainText("9:00 AM GMT-4");
  await expect(planner.locator(".meeting-selection")).toContainText("9:00 PM GMT+8");
  await page.getByLabel("Your message").fill("Please keep this project context in my message.");
  await planner.getByRole("link", { name: "Request this time" }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByLabel("Your message")).toHaveValue(/Please keep this project context/);
  await expect(page.getByLabel("Your message")).toHaveValue(/Meeting request/);
  await expect(page.getByLabel("Your message")).toHaveValue(/America\/New_York/);
  await planner.locator(".meeting-slot").nth(1).click();
  await planner.getByRole("link", { name: "Request this time" }).click();
  const draft = await page.getByLabel("Your message").inputValue();
  expect(draft.match(/Meeting request/g)).toHaveLength(1);
  expect(draft).toContain("Please keep this project context");
  await planner.getByLabel("Your preferred hours").selectOption("evening");
  await expect(planner.locator(".meeting-selection")).toContainText("Oct 18, 2026");
  expect(posts).toEqual([]);
});

test("calendar downloads are tentative, and old dates cannot prepare meeting requests", async ({
  page,
}) => {
  const planner = await chooseMeeting(page);
  const pending = page.waitForEvent("download");
  await planner.getByRole("button", { name: "Download tentative calendar reminder" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("proposed-meeting-with-prince.ics");
  const calendar = await readFile((await download.path())!, "utf8");
  expect(calendar).toContain("DTSTART:20261017T130000Z");
  expect(calendar).toContain("STATUS:TENTATIVE");
  expect(calendar).not.toContain("ATTENDEE");
  await planner.getByLabel("Your meeting date").fill("2026-10-15");
  await expect(planner.getByRole("button", { name: "Request this time" })).toBeDisabled();
  await expect(planner.locator(".meeting-empty")).toContainText("No future times");
});

test("feedback needs a deliberate send, remains private by default, and never auto-publishes", async ({
  page,
}) => {
  await page.goto("/#client-stories");
  const stories = page.locator("#client-stories");
  await expect(stories.locator("blockquote")).toHaveCount(0);
  await page.getByLabel("Your message").fill("Keep my original message.");
  await stories.getByRole("button", { name: "Share feedback" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("checkbox")).not.toBeChecked();
  await dialog.getByLabel("Project we worked on").fill("Browser test project");
  await dialog
    .getByLabel("Your feedback", { exact: true })
    .fill("This is test feedback for the portfolio intake workflow.");
  await dialog.getByRole("button", { name: "Prepare feedback" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByLabel("Your message")).toHaveValue(/Keep my original message/);
  await expect(page.getByLabel("Your message")).toHaveValue(/Permission to publish: Not granted/);
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Thanks for reaching out. Your message has been submitted.",
      }),
    }),
  );
  await page.getByLabel("Your name").fill("Test Client");
  await page.getByLabel("Email address").fill("client@example.com");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByLabel("Your message")).toHaveValue("");
  await expect(stories.locator("blockquote")).toHaveCount(0);
});

test("feedback survives a full contact draft and explicit publication permission reaches the message", async ({
  page,
}) => {
  await page.goto("/#client-stories");
  await page.getByLabel("Your message").fill("x".repeat(4990));
  const stories = page.locator("#client-stories");
  await stories.getByRole("button", { name: "Share feedback" }).click();
  const dialog = page.getByRole("dialog");
  const quote = "This is retained feedback while the contact form is full.";
  await dialog.getByLabel("Project we worked on").fill("Test project");
  await dialog.getByLabel("Your feedback", { exact: true }).fill(quote);
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Prepare feedback" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Your contact message is too long");
  await expect(dialog.getByLabel("Your feedback", { exact: true })).toHaveValue(quote);
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByLabel("Your message")).toHaveValue("x".repeat(4990));
  await page.getByLabel("Your message").fill("A shorter draft that must stay.");
  await stories.getByRole("button", { name: "Share feedback" }).click();
  await expect(dialog.getByLabel("Your feedback", { exact: true })).toHaveValue(quote);
  await expect(dialog.getByRole("checkbox")).toBeChecked();
  await dialog.getByRole("button", { name: "Prepare feedback" }).click();
  await expect(page.getByLabel("Your message")).toHaveValue(/Permission to publish: Yes/);
  await expect(page.getByLabel("Your message")).toHaveValue(/A shorter draft that must stay/);
});

test("planner, stories, and feedback dialog fit mobile screens and pass accessibility checks", async ({
  page,
}) => {
  await chooseMeeting(page);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  for (const theme of ["light", "dark"]) {
    await page.evaluate((value) => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(value);
    }, theme);
    const result = await new AxeBuilder({ page })
      .include("#meeting-planner")
      .include("#client-stories")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.locator("#client-stories").getByRole("button", { name: "Share feedback" }).click();
  const result = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
});
