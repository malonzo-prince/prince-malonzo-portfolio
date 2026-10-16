import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop page, live GitHub activity, concept filters, and accessible dialogs", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat|didn.t match/i.test(message.text()))
      errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Prince Barachiel Malonzo." })).toBeVisible();
  await expect(page.locator(".portrait-image")).toBeVisible();
  await expect(page.locator(".contribution-day").first()).toBeAttached();
  expect(await page.locator("button.contribution-day").count()).toBeGreaterThanOrEqual(300);
  expect(
    await page.locator("button.contribution-day:not(.contribution-level-0)").count(),
  ).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Explore A city in your pocket., sample concept" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByText("This is an illustrative project concept", { exact: false }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "All work" }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  const response = await page.request.get("/resume/prince-barachiel-malonzo-resume.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect(errors).toEqual([]);
});

test("theme persists and skills and experience respond to input", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ colorScheme: "light" });
  await page.getByRole("button", { name: "Toggle light and dark theme" }).first().click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Workflow", exact: true }).click();
  await expect(page.locator(".skill-group")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Testing & quality", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "All skills", exact: true }).click();
  await page.getByRole("button", { name: "Explore the full toolkit" }).click();
  await expect(page.locator(".skill-group")).toHaveCount(11);
  const internship = page.locator(".experience-item").last();
  await internship.getByRole("button").click();
  await expect(
    internship.getByText("Led and coordinated a team of 17 fellow interns", { exact: false }),
  ).toBeVisible();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.screenshot({
    path: "test-results/portfolio-desktop-dark.png",
    fullPage: true,
    animations: "disabled",
  });
});

test("mobile menu, form validation, keyboard calendar, and responsive widths", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByText("Please enter a name between 2 and 80 characters.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const lastDay = page.locator("button.contribution-day").last();
  await lastDay.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(lastDay).not.toBeFocused();
  await expect(page.locator("button.contribution-day:focus")).toHaveCount(1);
  await page.keyboard.press("End");
  await expect(lastDay).toBeFocused();
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: "test-results/portfolio-mobile-light.png",
    fullPage: true,
    animations: "disabled",
  });
});

test("light and dark layouts meet automated accessibility checks", async ({ page }) => {
  await page.goto("/");
  for (const theme of ["light", "dark"]) {
    await page.evaluate((value) => {
      localStorage.setItem("theme", value);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(value);
    }, theme);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  }
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: "test-results/portfolio-desktop-light.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.screenshot({ path: "test-results/portfolio-hero-light.png", animations: "disabled" });
});

test("metadata, sitemap, Open Graph image, and invalid contact requests behave correctly", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Prince Barachiel Malonzo — Full Stack Developer");
  expect(await page.locator('meta[property="og:image"]').getAttribute("content")).toContain(
    "opengraph-image",
  );
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const contact = await request.post("/api/contact", {
    headers: { Origin: new URL(page.url()).origin },
    data: { name: "Test" },
  });
  expect(contact.status()).toBe(400);
  expect((await contact.json()).message).toContain("check");
});

test("project builder supports shared URLs, refreshes, and older bookmarks", async ({ page }) => {
  const heading = page.getByRole("heading", { name: "Your idea. A starting point." });
  for (const path of ["/project-builder?from=shared", "/#project-builder", "/#blueprint"]) {
    await page.goto(path);
    await expect(heading).toBeInViewport();
    if (path.startsWith("/project-builder")) {
      await expect(page).toHaveURL(/\?from=shared#project-builder$/);
    }
    await page.reload();
    await expect(heading).toBeInViewport();
  }
});

test("freelance availability, university logo, and project blueprint work together", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Open to freelance projects" })).toBeVisible();
  const logo = page.getByRole("img", { name: "National University Philippines logo" });
  await expect(logo).toBeAttached();
  await logo.scrollIntoViewIfNeeded();
  await expect(logo).not.toHaveJSProperty("naturalWidth", 0);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Project builder" })
    .click();
  await expect(page).toHaveURL(/\/#project-builder$/);
  await page.getByRole("button", { name: /Management system Organize/ }).click();
  await expect(page.getByRole("button", { name: /Records & workflows Organize/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "Web + mobile", exact: true }).click();
  await page.getByRole("button", { name: "Explore all features" }).click();
  await page.getByRole("button", { name: /Maps & places Location/ }).click();
  await expect(page.locator(".blueprint-summary h3")).toHaveText("Management system.");
  await expect(page.locator(".blueprint-stack")).toContainText("Mapbox API");
  await page
    .getByLabel("Your ideas & customization")
    .fill("A school management system with a custom dashboard.");
  await page.getByRole("link", { name: "Let’s discuss this", exact: true }).click();
  await expect(page.getByLabel("Your message")).toHaveValue(/Project type: Management system/);
  await expect(page.getByLabel("Your message")).toHaveValue(/Platform: Web \+ mobile/);
  await expect(page.getByLabel("Your message")).toHaveValue(
    /school management system with a custom dashboard/,
  );
  await expect(page.getByLabel("Your message")).toHaveValue(/Maps & places/);
  await expect(page.getByRole("link", { name: "Prefer Gmail? Compose an email" })).toHaveAttribute(
    "href",
    /mail\.google\.com/,
  );
  await page
    .getByRole("navigation", { name: "Footer navigation" })
    .getByRole("link", { name: "Project builder" })
    .click();
  await expect(page).toHaveURL(/\/#project-builder$/);
  await expect(page.locator(".blueprint-summary h3")).toHaveText("Management system.");
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Project builder" }),
  ).toHaveAttribute("aria-current", "location");
});

test("mobile project builder supports POS and an entirely custom project", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Project builder" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/\/#project-builder$/);
  await page.getByRole("button", { name: /Point of sale \(POS\) Sales/ }).click();
  await expect(page.getByRole("button", { name: /Products & inventory Catalogs/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: /Sales & receipts Checkout/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".blueprint-summary h3")).toHaveText("Point of sale (POS).");
  await page.getByRole("button", { name: /Something else A custom/ }).click();
  await page.getByLabel("What kind of project?").fill("Equipment rental system");
  await page
    .getByLabel("Your ideas & customization")
    .fill("Track rentals, returns, and overdue items.");
  await expect(page.locator(".blueprint-summary h3")).toHaveText("Equipment rental system.");
  await page.getByRole("link", { name: "Let’s discuss this", exact: true }).click();
  await expect(page.getByLabel("Your message")).toHaveValue(/Equipment rental system/);
  await expect(page.getByLabel("Your message")).toHaveValue(
    /Track rentals, returns, and overdue items/,
  );
});

test("contact submission shows provider acceptance and preserves messages on failure", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("form", { name: "Contact Prince" })).toHaveAttribute(
    "action",
    "/api/contact",
  );
  await expect(page.getByRole("link", { name: "EmailJS", exact: true })).toHaveAttribute(
    "href",
    "https://www.emailjs.com",
  );
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Your message could not be sent. Please try again or email me directly.",
      }),
    }),
  );
  await page.getByLabel("Your name").fill("Test Visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page.getByLabel("Your message").fill("I would like to discuss a web application project.");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByText("Your message could not be sent. Please try again or email me directly."),
  ).toBeVisible();
  await expect(page.getByLabel("Your message")).not.toHaveValue("");
  await page.unroute("**/api/contact");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Thanks for reaching out. Your message has been submitted.",
      }),
    }),
  );
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByText("Thanks for reaching out. Your message has been submitted."),
  ).toBeVisible();
  await expect(page.getByLabel("Your message")).toHaveValue("");
});
