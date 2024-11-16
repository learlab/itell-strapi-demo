import test, { expect } from "@playwright/test";
import { volume } from "#content";

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("metadata", async ({ page }) => {
    expect(await page.title()).toBe(volume.title);
    expect(
      await page.locator("meta[name='description']").getAttribute("content")
    ).toBe(volume.description);
  });
});
