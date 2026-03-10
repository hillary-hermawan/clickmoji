import { test, expect } from "@playwright/test";

test.describe("Emoji mode toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("English mode is active by default", async ({ page }) => {
    const englishOption = page.locator(".lang-option.active");
    await expect(englishOption).toContainText("English");
  });

  test("clicking Emoji switches masthead to emoji", async ({ page }) => {
    const emojiToggle = page
      .locator(".lang-option")
      .filter({ hasText: "Emoji" });
    await emojiToggle.click();

    // Masthead title should change away from CLICKMOJI
    await expect(page.locator(".masthead-title")).not.toContainText(
      "CLICKMOJI"
    );

    // Emoji toggle should now be active
    await expect(emojiToggle).toHaveClass(/active/);
  });

  test("emoji mode changes nav sections to emojis", async ({ page }) => {
    const firstLink = page.locator(".section-link").first();
    const originalText = await firstLink.textContent();

    const emojiToggle = page
      .locator(".lang-option")
      .filter({ hasText: "Emoji" });
    await emojiToggle.click();

    const newText = await firstLink.textContent();
    expect(newText).not.toBe(originalText);
  });

  test("switching back to English restores text", async ({ page }) => {
    // Switch to emoji
    const emojiToggle = page
      .locator(".lang-option")
      .filter({ hasText: "Emoji" });
    await emojiToggle.click();
    await expect(page.locator(".masthead-title")).not.toContainText(
      "CLICKMOJI"
    );

    // Switch back to English
    const englishToggle = page
      .locator(".lang-option")
      .filter({ hasText: "English" });
    await englishToggle.click();
    await expect(page.locator(".masthead-title")).toContainText("CLICKMOJI");
  });

  test("emoji mode does not affect game content", async ({ page }) => {
    // Switch to emoji mode before starting
    const emojiToggle = page
      .locator(".lang-option")
      .filter({ hasText: "Emoji" });
    await emojiToggle.click();

    // Start the game
    await page.locator(".btnp").click();

    // Answer options should still be English text headlines (not emoji)
    const opts = page.locator(".opts .ob");
    await expect(opts).toHaveCount(4);

    const firstText = await opts.first().textContent();
    // Headlines are long English sentences, should be > 20 chars
    expect(firstText!.length).toBeGreaterThan(20);
  });

  test("emoji mode persists during game play", async ({ page }) => {
    // Switch to emoji
    const emojiToggle = page
      .locator(".lang-option")
      .filter({ hasText: "Emoji" });
    await emojiToggle.click();

    // Start game
    await page.locator(".btnp").click();

    // Masthead should still be in emoji mode
    await expect(page.locator(".masthead-title")).not.toContainText(
      "CLICKMOJI"
    );
  });
});
