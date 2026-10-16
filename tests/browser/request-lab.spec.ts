import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the request lab explains success, validation, and unavailable storage without making API calls", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") requests.push(request.url());
  });
  await page.goto("/");
  await page.getByRole("link", { name: "Try Request Lab", exact: true }).click();
  const lab = page.getByRole("region", { name: "One request. Every layer." });
  await expect(lab).toBeInViewport();
  await lab.getByRole("button", { name: "Run request", exact: true }).click();
  await expect(lab.getByRole("status")).toContainText("201 Created");
  await expect(lab.locator('[data-layer="data"]')).toHaveAttribute("data-state", "complete");
  await expect(lab.locator(".request-lab-response")).toContainText('"saved": true');

  await lab.getByRole("button", { name: "Missing a field", exact: true }).click();
  await lab.getByRole("button", { name: "Run request", exact: true }).click();
  await expect(lab.getByRole("status")).toContainText("400 Bad Request");
  await expect(lab.locator('[data-layer="api"]')).toHaveAttribute("data-state", "error");
  await expect(lab.locator('[data-layer="data"]')).toHaveAttribute("data-state", "skipped");
  await expect(lab.locator(".request-lab-response")).toContainText("A project name is required.");

  await lab.getByRole("button", { name: "Data service offline", exact: true }).click();
  await lab.getByRole("button", { name: "Run request", exact: true }).click();
  await expect(lab.getByRole("status")).toContainText("503 Service Unavailable");
  await expect(lab.locator('[data-layer="data"]')).toHaveAttribute("data-state", "error");
  await expect(lab.locator(".request-lab-response")).toContainText('"saved": false');
  await expect(lab.getByRole("link", { name: "Let's build your idea" })).toHaveAttribute(
    "href",
    "/#project-builder",
  );
  expect(requests).toEqual([]);
});

test("reset and scenario changes cancel a running trace, and reduced motion supports keyboard use", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/#request-lab");
  const lab = page.locator("#request-lab");
  await lab.getByRole("button", { name: "Run request", exact: true }).click();
  await lab.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.clock.fastForward(3000);
  await expect(lab.locator('[data-state="waiting"]')).toHaveCount(4);
  await expect(lab.getByRole("status")).toHaveText("Choose a scenario, then run a request.");
  await expect(lab.locator(".request-lab-response")).toContainText("Not sent");
  await lab.getByRole("button", { name: "Run request", exact: true }).click();
  await lab.getByRole("button", { name: "Missing a field", exact: true }).click();
  await page.clock.fastForward(3000);
  await expect(lab.locator('[data-state="waiting"]')).toHaveCount(4);
  await expect(lab.locator(".request-lab-response")).toContainText("Not sent");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await lab.getByRole("button", { name: "Run request", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(lab.getByRole("status")).toContainText("400 Bad Request");
  await expect(lab.getByRole("button", { name: "Run again", exact: true })).toBeEnabled();
  await expect(lab.locator('[data-state="active"]')).toHaveCount(0);
});

test("the lab fits small screens and keeps light and dark results accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#request-lab");
  const lab = page.locator("#request-lab");
  await lab.getByRole("button", { name: "Data service offline", exact: true }).click();
  await lab.getByRole("button", { name: "Run request", exact: true }).click();
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
    const results = await new AxeBuilder({ page })
      .include("#request-lab")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  }
});
