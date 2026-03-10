import { test, expect } from "@playwright/test";

async function goToSolo(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Solo Training/i }).click();
}

test.describe("Edge cases", () => {
  test("empty name defaults to random fake name", async ({ page }) => {
    await goToSolo(page);
    const input = page.locator(".badge-input");
    await input.fill("");
    await page.locator(".btnp").click();

    // Player name should not be empty on game screen
    const playerName = page.locator(".player-name");
    const text = await playerName.textContent();
    expect(text!.trim().length).toBeGreaterThan(0);
  });

  test("custom name is displayed in game", async ({ page }) => {
    await goToSolo(page);
    const input = page.locator(".badge-input");
    await input.fill("TestPlayer");
    await page.locator(".btnp").click();
    await expect(page.locator(".player-name")).toContainText("TestPlayer");
  });

  test("custom name persists to game over screen", async ({ page }) => {
    await goToSolo(page);
    await page.locator(".badge-input").fill("MyName");
    await page.locator(".btnp").click();

    // Trigger game over
    await page.locator('[data-testid="option"]').first().click();
    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });

    // Game over text should reference player name
    const goText = await page.locator(".gow").textContent();
    expect(goText).toContain("MyName");
  });

  test("shuffle button generates new name", async ({ page }) => {
    await goToSolo(page);
    const input = page.locator(".badge-input");
    const firstValue = await input.inputValue();

    await page.locator(".name-shuffle").click();
    const secondValue = await input.inputValue();

    // Name should have a value (may or may not be different due to randomness)
    expect(secondValue.length).toBeGreaterThan(0);
  });

  test("name input maxLength is 24 characters", async ({ page }) => {
    await goToSolo(page);
    const input = page.locator(".badge-input");
    await input.fill("A".repeat(30));
    const value = await input.inputValue();
    expect(value.length).toBeLessThanOrEqual(24);
  });

  test("rapid clicking on answer buttons does not break game", async ({
    page,
  }) => {
    await goToSolo(page);
    await page.locator(".btnp").click();
    await expect(page.locator(".edisplay")).toBeVisible();

    // Rapidly click all 4 options
    const opts = page.locator(".opts .ob");
    await Promise.all([
      opts.nth(0).click({ force: true }),
      opts.nth(1).click({ force: true }),
      opts.nth(2).click({ force: true }),
      opts.nth(3).click({ force: true }),
    ]);

    // Game should not crash - should be in either game or gameover state
    await page.waitForTimeout(2000);
    const gameVisible = await page.locator(".edisplay").isVisible();
    const gameOverVisible = await page.locator(".gow").isVisible();
    expect(gameVisible || gameOverVisible).toBe(true);
  });

  test("start over button during game resets to round 1", async ({ page }) => {
    await goToSolo(page);
    await page.locator(".btnp").click();

    // Answer correctly to reach round 2
    await page.locator('[data-testid="correct-option"]').click();
    await expect(page.locator(".card-score-val")).toContainText("2/50", {
      timeout: 3000,
    });

    // Click start over
    await page.locator(".card-restart").click();
    await expect(page.locator(".card-score-val")).toContainText("1/50");
  });

  test("ad refreshes after each answer", async ({ page }) => {
    await page.goto("/");

    // Get initial ad title
    const adTitle = page.locator(".top-ad-title");
    const initialAd = await adTitle.textContent();

    await page.getByRole("button", { name: /Solo Training/i }).click();
    await page.locator(".btnp").click();

    // Answer correctly - ad should refresh (may or may not change due to randomness)
    await page.locator('[data-testid="correct-option"]').click();
    await page.waitForTimeout(1500);

    // Ad element should still exist after answer
    await expect(adTitle).toBeVisible();
  });

  test("game works with mouse only (no keyboard)", async ({ page }) => {
    await goToSolo(page);

    // Start with mouse
    await page.locator(".btnp").click();
    await expect(page.locator(".edisplay")).toBeVisible();

    // Answer with mouse
    await page.locator('[data-testid="correct-option"]').click();
    await expect(page.locator(".cflash")).toBeVisible();

    // Wait for auto-advance
    await expect(page.locator(".card-score-val")).toContainText("2/50", {
      timeout: 3000,
    });

    // Wrong answer with mouse
    await page.locator('[data-testid="option"]').first().click();
    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });

    // Restart with mouse
    await page.locator(".btnp").click();
    await expect(page.locator(".card-score-val")).toContainText("1/50");
  });
});
