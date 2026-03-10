import { test, expect } from "@playwright/test";

test.describe("Mode selection screen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders mode selection with both options", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Solo Training/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Group Interview/i })
    ).toBeVisible();
  });

  test("shows welcome title", async ({ page }) => {
    await expect(page.locator(".start-title")).toContainText("Translation Desk");
  });

  test("shows multiplayer subtitle info", async ({ page }) => {
    const text = await page.locator(".start").textContent();
    expect(text).toContain("2");
    expect(text).toContain("4");
    expect(text).toContain("PLAYERS");
  });

  test("clicking Solo Training shows solo start screen", async ({ page }) => {
    await page.getByRole("button", { name: /Solo Training/i }).click();

    // Should show the solo start screen with badge
    await expect(page.locator(".badge-input")).toBeVisible();
    await expect(page.locator(".btnp")).toContainText("Clock in");
  });

  test("clicking Group Interview navigates to lobby", async ({ page }) => {
    await page.getByRole("button", { name: /Group Interview/i }).click();

    // Should navigate to /lobby
    await expect(page).toHaveURL(/\/lobby/);
  });
});
