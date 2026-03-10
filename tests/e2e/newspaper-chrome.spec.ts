import { test, expect } from "@playwright/test";

test.describe("Newspaper chrome", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("masthead renders title and motto", async ({ page }) => {
    await expect(page.locator(".masthead-title")).toContainText("CLICKMOJI");
    await expect(page.locator(".masthead-motto")).toContainText(
      "Pioneers of Emoji-First Journalism"
    );
  });

  test("date displays current year", async ({ page }) => {
    const dateEl = page.locator(".masthead-date");
    await expect(dateEl).toBeVisible();
    const text = await dateEl.textContent();
    expect(text).toContain(new Date().getFullYear().toString());
  });

  test("weather is displayed", async ({ page }) => {
    await expect(page.locator(".weather-emoji")).toBeVisible();
    await expect(page.locator(".weather-text")).toBeVisible();
    const text = await page.locator(".weather-text").textContent();
    expect(text!.length).toBeGreaterThan(0);
  });

  test("edition info is displayed", async ({ page }) => {
    const edition = page.locator(".masthead-side.right .edition");
    await expect(edition).toBeVisible();
    await expect(page.locator(".masthead-side.right")).toContainText(
      "Vol. CXLVII"
    );
  });

  test("language toggle shows English and Emoji options", async ({ page }) => {
    await expect(page.locator(".lang-toggle")).toBeVisible();
    const options = page.locator(".lang-option");
    await expect(options).toHaveCount(2);
    await expect(options.first()).toContainText("English");
    await expect(options.last()).toContainText("Emoji");
  });

  test("BETA badge is on Emoji option", async ({ page }) => {
    await expect(page.locator(".beta-badge")).toContainText("BETA");
  });

  test("masthead rule line is present", async ({ page }) => {
    await expect(page.locator(".masthead-rule-line")).toBeVisible();
  });

  test("sections nav renders all sections", async ({ page }) => {
    const links = page.locator(".section-link");
    await expect(links).toHaveCount(4);
    await expect(links.first()).toContainText("News");
  });

  test("ticker is visible with stock data", async ({ page }) => {
    await expect(page.locator(".ticker-wrap")).toBeVisible();
    await expect(page.locator(".ticker")).toBeVisible();
    // Should have at least one up or down ticker item
    const tickerContent = await page.locator(".ticker-in").textContent();
    expect(tickerContent!.length).toBeGreaterThan(0);
  });

  test("top ad is displayed with content", async ({ page }) => {
    await expect(page.locator(".top-ad-wrap")).toBeVisible();
    await expect(page.locator(".top-ad-label")).toContainText("Advertisement");
    await expect(page.locator(".top-ad-title")).toBeVisible();
    await expect(page.locator(".top-ad-cta")).toBeVisible();
  });

  test("right column shows Most Read dispatches", async ({ page }) => {
    await expect(page.locator(".col-label")).toContainText("Most Read");
    const dispatches = page.locator(".dispatch");
    await expect(dispatches).toHaveCount(5);
  });

  test("dispatch items have numbers", async ({ page }) => {
    const nums = page.locator(".d-num");
    await expect(nums.first()).toContainText("1");
  });
});
