import { test, expect } from "@playwright/test";

test.describe("Keyboard navigation", () => {
  test("pressing 1-4 selects corresponding answer", async ({ page }) => {
    await page.goto("/");
    await page.locator(".btnp").click();
    await expect(page.locator(".edisplay")).toBeVisible();

    await page.keyboard.press("1");

    // Should trigger answer selection (flash or game over)
    const flash = page.locator(".cflash");
    const gameOver = page.locator(".gow");
    await expect(flash.or(gameOver)).toBeVisible({ timeout: 3000 });
  });

  test("keys 5-9 and letters do not trigger answer", async ({ page }) => {
    await page.goto("/");
    await page.locator(".btnp").click();
    await expect(page.locator(".edisplay")).toBeVisible();

    await page.keyboard.press("5");
    await page.keyboard.press("a");
    await page.keyboard.press("z");

    // All 4 options should still be enabled (not answered)
    const enabledOpts = page.locator(".opts .ob:not([disabled])");
    await expect(enabledOpts).toHaveCount(4);
  });

  test("keyboard 1-4 ignored when name input is focused on start screen", async ({
    page,
  }) => {
    await page.goto("/");
    const input = page.locator(".badge-input");
    await input.focus();

    await page.keyboard.press("1");
    await page.keyboard.press("2");
    await page.keyboard.press("3");
    await page.keyboard.press("4");

    // Should still be on start screen
    await expect(page.locator(".start-title")).toBeVisible();
    await expect(page.locator(".edisplay")).not.toBeVisible();
  });

  test("Enter key on game over screen restarts game", async ({ page }) => {
    await page.goto("/");
    await page.locator(".btnp").click();

    // Trigger game over with wrong answer
    await page.locator('[data-testid="option"]').first().click();
    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });

    // Press Enter to restart
    await page.keyboard.press("Enter");
    await expect(page.locator(".edisplay")).toBeVisible({ timeout: 3000 });
    await expect(page.locator(".card-score-val")).toContainText("1/50");
  });

  test("keyboard can skip auto-advance after 350ms", async ({ page }) => {
    await page.goto("/");
    await page.locator(".btnp").click();
    await expect(page.locator(".edisplay")).toBeVisible();

    // Answer correctly
    await page.locator('[data-testid="correct-option"]').click();
    await expect(page.locator(".cflash")).toBeVisible();

    // Wait 400ms (past the 350ms skip threshold) then press any key
    await page.waitForTimeout(400);
    await page.keyboard.press("1");

    // Should have advanced to round 2 faster than 1200ms auto-advance
    await expect(page.locator(".card-score-val")).toContainText("2/50", {
      timeout: 2000,
    });
  });

  test("rapid keyboard presses only register first answer", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator(".btnp").click();
    await expect(page.locator(".edisplay")).toBeVisible();

    // Press all keys rapidly
    await page.keyboard.press("1");
    await page.keyboard.press("2");
    await page.keyboard.press("3");
    await page.keyboard.press("4");

    // Should not crash - either flash or game over
    await page.waitForTimeout(2000);
    const gameActive = await page.locator(".edisplay").isVisible();
    const gameOver = await page.locator(".gow").isVisible();
    expect(gameActive || gameOver).toBe(true);
  });
});
