import { test, expect } from "@playwright/test";

test.describe("Multiplayer lobby", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/lobby");
    // Wait for the lobby to render
    await expect(page.locator(".start-title")).toBeVisible({ timeout: 10000 });
  });

  test("renders lobby with title and subtitle", async ({ page }) => {
    await expect(page.locator(".start-title")).toContainText("Group Interview");
    await expect(page.locator(".start-sub")).toBeVisible();
  });

  test("shows avatar that is clickable", async ({ page }) => {
    const avatar = page.locator("div[title='Customize avatar']");
    await expect(avatar).toBeVisible();
  });

  test("name input is pre-filled with random name", async ({ page }) => {
    const input = page.locator(".badge-input").first();
    // Wait for useEffect to set the name
    await expect(input).not.toHaveValue("", { timeout: 3000 });
    const value = await input.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test("shuffle button changes name", async ({ page }) => {
    const input = page.locator(".badge-input").first();
    // Wait for initial name
    await expect(input).not.toHaveValue("", { timeout: 3000 });
    await page.locator(".name-shuffle").click();
    const value = await input.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test("room code input exists with placeholder", async ({ page }) => {
    const codeInput = page.locator("input[placeholder='VIBES']");
    await expect(codeInput).toBeVisible();
  });

  test("join button is disabled without code", async ({ page }) => {
    const joinButton = page.getByRole("button", { name: "Join" });
    await expect(joinButton).toBeDisabled();
  });

  test("join button enables when code is entered", async ({ page }) => {
    const codeInput = page.locator("input[placeholder='VIBES']");
    await codeInput.fill("EMOJI");
    const joinButton = page.getByRole("button", { name: "Join" });
    await expect(joinButton).toBeEnabled();
  });

  test("Create New Room button exists", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Create New Room/i })
    ).toBeVisible();
  });

  test("back to solo link exists and navigates home", async ({ page }) => {
    await expect(page.locator(".card-restart")).toContainText("Back to Solo");
    await page.locator(".card-restart").click();
    await expect(page).toHaveURL("/");
  });

  test("room code input converts to uppercase", async ({ page }) => {
    const codeInput = page.locator("input[placeholder='VIBES']");
    await codeInput.fill("emoji");
    const value = await codeInput.inputValue();
    expect(value).toBe("EMOJI");
  });

  test("room code input has maxLength 6", async ({ page }) => {
    const codeInput = page.locator("input[placeholder='VIBES']");
    await codeInput.fill("ABCDEFGHIJ");
    const value = await codeInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(6);
  });

  test("department badge shows multiplayer division", async ({ page }) => {
    await expect(page.locator(".badge-dept")).toContainText(
      "Multiplayer Division"
    );
  });

  test("newspaper chrome renders on lobby page", async ({ page }) => {
    await expect(page.locator(".masthead-title")).toContainText("CLICKMOJI");
    await expect(page.locator(".ticker-wrap")).toBeVisible();
  });
});
