import { test, expect } from "@playwright/test";

test.describe("Solo game flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders start screen with badge, name input, and Clock in button", async ({
    page,
  }) => {
    await expect(page.locator(".start-title")).toContainText(
      "Translation Desk"
    );
    await expect(page.locator(".badge-input")).toBeVisible();
    await expect(page.locator(".btnp")).toContainText("Clock in");
    await expect(page.locator(".badge-photo")).toContainText("🪪");
    await expect(page.locator(".badge-dept")).toContainText("Translation Desk");
  });

  test("name input is pre-filled with a random name", async ({ page }) => {
    const input = page.locator(".badge-input");
    const value = await input.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test("clicking Clock in starts the game", async ({ page }) => {
    await page.locator(".btnp").click();
    await expect(page.locator(".edisplay")).toBeVisible();
    await expect(page.locator(".opts .ob")).toHaveCount(4);
    await expect(page.locator(".card-score-val")).toContainText("1/50");
    await expect(page.locator(".player-title")).toContainText("INTERN");
  });

  test("correct answer shows flash and advances to next round", async ({
    page,
  }) => {
    await page.locator(".btnp").click();
    await page.locator('[data-testid="correct-option"]').click();
    await expect(page.locator(".cflash")).toBeVisible();
    await expect(page.locator(".cfbig")).toContainText("MATCH CONFIRMED");

    // Wait for auto-advance
    await expect(page.locator(".card-score-val")).toContainText("2/50", {
      timeout: 3000,
    });
  });

  test("wrong answer shows game over screen", async ({ page }) => {
    await page.locator(".btnp").click();

    // Click a wrong option
    const wrongOption = page.locator('[data-testid="option"]').first();
    await wrongOption.click();

    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });
    await expect(page.locator(".fsv")).toBeVisible();
    await expect(page.locator(".btnp")).toContainText("Clock back in");
  });

  test("game over shows wrong answer review", async ({ page }) => {
    await page.locator(".btnp").click();
    await page.locator('[data-testid="option"]').first().click();

    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });
    await expect(page.locator(".gorev")).toBeVisible();
    await expect(page.locator(".goemoji")).toBeVisible();
    await expect(page.locator(".gohl")).toBeVisible();
    await expect(page.locator(".gopw")).toContainText("You matched:");
  });

  test("restart from game over returns to round 1", async ({ page }) => {
    await page.locator(".btnp").click();
    await page.locator('[data-testid="option"]').first().click();
    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });

    await page.locator(".btnp").click(); // "Clock back in"
    await expect(page.locator(".edisplay")).toBeVisible();
    await expect(page.locator(".card-score-val")).toContainText("1/50");
  });

  test("can play multiple correct rounds in a row", async ({ page }) => {
    await page.locator(".btnp").click();

    for (let round = 1; round <= 3; round++) {
      await expect(page.locator(".card-score-val")).toContainText(
        `${round}/50`
      );
      await page.locator('[data-testid="correct-option"]').click();
      await page.waitForTimeout(1500); // wait for auto-advance
    }

    await expect(page.locator(".card-score-val")).toContainText("4/50");
  });

  test("player name is displayed on game screen", async ({ page }) => {
    const input = page.locator(".badge-input");
    await input.fill("TestPlayer");
    await page.locator(".btnp").click();
    await expect(page.locator(".player-name")).toContainText("TestPlayer");
  });
});
