import { test, expect } from "@playwright/test";

async function goToSolo(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Solo Training/i }).click();
}

test.describe("Timer behavior", () => {
  test("no timer visible for round 1", async ({ page }) => {
    await goToSolo(page);
    await page.locator(".btnp").click();
    await expect(page.locator(".edisplay")).toBeVisible();

    // Timer wrap should not have "active" class for round 1
    await expect(page.locator(".timer-wrap.active")).not.toBeVisible();
  });

  test("timer appears at round 11", async ({ page }) => {
    await goToSolo(page);
    await page.locator(".btnp").click();

    // Advance through 10 correct rounds
    for (let round = 0; round < 10; round++) {
      await page.locator('[data-testid="correct-option"]').click();
      await page.waitForTimeout(1500);
    }

    // Round 11 - timer should be active
    await expect(page.locator(".timer-wrap.active")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator(".timer-num")).toBeVisible();
    await expect(page.locator(".timer-lbl")).toContainText("DEADLINE");
  });

  test("timer counts down", async ({ page }) => {
    await goToSolo(page);
    await page.locator(".btnp").click();

    // Advance to round 11
    for (let round = 0; round < 10; round++) {
      await page.locator('[data-testid="correct-option"]').click();
      await page.waitForTimeout(1500);
    }

    await expect(page.locator(".timer-wrap.active")).toBeVisible({
      timeout: 5000,
    });

    // Read initial timer value
    const initialText = await page.locator(".timer-num").textContent();
    const initialVal = parseInt(initialText || "0", 10);
    expect(initialVal).toBe(20); // Round 11 timer is 20s

    // Wait 2 seconds and check timer decreased
    await page.waitForTimeout(2000);
    const laterText = await page.locator(".timer-num").textContent();
    const laterVal = parseInt(laterText || "0", 10);
    expect(laterVal).toBeLessThan(initialVal);
  });

  test("timer expiry triggers game over with deadline missed", async ({
    page,
  }) => {
    test.setTimeout(60000);
    await goToSolo(page);
    await page.locator(".btnp").click();

    // Advance to round 11
    for (let round = 0; round < 10; round++) {
      await page.locator('[data-testid="correct-option"]').click();
      await page.waitForTimeout(1500);
    }

    await expect(page.locator(".timer-wrap.active")).toBeVisible({
      timeout: 5000,
    });

    // Wait for timer to expire (20s + buffer)
    await expect(page.locator(".gow")).toBeVisible({ timeout: 25000 });
    await expect(page.locator(".gopw")).toContainText("DEADLINE MISSED");
  });
});
