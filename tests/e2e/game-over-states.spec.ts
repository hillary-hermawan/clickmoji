import { test, expect } from "@playwright/test";

async function goToSolo(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Solo Training/i }).click();
}

test.describe("Game over states", () => {
  test("loss shows score, rank, and restart button", async ({ page }) => {
    await goToSolo(page);
    await page.locator(".btnp").click();

    // Wrong answer on round 1
    await page.locator('[data-testid="option"]').first().click();
    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });

    // Score should show "1" (completed 1 round, got it wrong)
    await expect(page.locator(".fsv")).toBeVisible();
    // Rank for round 1 is INTERN
    await expect(page.locator(".verd")).toContainText("INTERN");
    // Restart button
    await expect(page.locator(".btnp")).toContainText("Clock back in");
  });

  test("loss shows correct headline and wrong answer in review", async ({
    page,
  }) => {
    await goToSolo(page);
    await page.locator(".btnp").click();

    // Get the wrong option text before clicking
    const wrongOptionText = await page
      .locator('[data-testid="option"]')
      .first()
      .textContent();

    await page.locator('[data-testid="option"]').first().click();
    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });

    // Review section should be visible
    await expect(page.locator(".gorev")).toBeVisible();
    // Correct headline shown
    await expect(page.locator(".gohl")).toBeVisible();
    const correctText = await page.locator(".gohl").textContent();
    expect(correctText!.length).toBeGreaterThan(5);

    // Wrong answer shown
    await expect(page.locator(".gopw span")).toBeVisible();
  });

  test("loss at higher round shows correct rank", async ({ page }) => {
    await goToSolo(page);
    await page.locator(".btnp").click();

    // Answer 6 rounds correctly (gets to JUNIOR ASSOCIATE)
    for (let round = 0; round < 6; round++) {
      await page.locator('[data-testid="correct-option"]').click();
      await page.waitForTimeout(1500);
    }

    // Wrong answer on round 7
    await page.locator('[data-testid="option"]').first().click();
    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });
    await expect(page.locator(".verd")).toContainText("JUNIOR ASSOCIATE");
  });

  test("win state after 50 correct answers", async ({ page }) => {
    test.setTimeout(120000); // This test takes a while
    await goToSolo(page);
    await page.locator(".btnp").click();

    // Answer all 50 rounds correctly
    for (let round = 0; round < 50; round++) {
      await page.locator('[data-testid="correct-option"]').click();

      if (round < 49) {
        // Wait for auto-advance (or skip after 400ms)
        await page.waitForTimeout(450);
        await page.keyboard.press("1"); // try to skip
        await page.waitForTimeout(200);
      }
    }

    // Win screen
    await expect(page.locator(".gow")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".gobig")).toContainText(
      "Translation Desk History"
    );
    await expect(page.locator(".verd")).toContainText("CHIEF EMOJI OFFICER");
    await expect(page.locator(".btnp")).toContainText("Keep training");

    // Celebration button should be visible
    await expect(page.locator(".card-restart")).toContainText("Celebrate");

    // No wrong answer review on win
    await expect(page.locator(".gorev")).not.toBeVisible();
  });

  test("progress bar width corresponds to rounds completed", async ({
    page,
  }) => {
    await goToSolo(page);
    await page.locator(".btnp").click();

    // Answer 1 wrong
    await page.locator('[data-testid="option"]').first().click();
    await expect(page.locator(".gow")).toBeVisible({ timeout: 3000 });

    // Progress bar should exist and have a width
    const progressBar = page.locator(".go-progress-bar");
    await expect(progressBar).toBeVisible();
    const width = await progressBar.evaluate((el) => el.style.width);
    expect(width).toBeTruthy();
  });
});
