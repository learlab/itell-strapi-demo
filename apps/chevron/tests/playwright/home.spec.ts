import test, { expect } from "@playwright/test";
import { volume } from "#content";

test.describe("homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("metadata matches volume title and description", async ({ page }) => {
    expect(page).toHaveTitle(volume.title);
    expect(
      await page.locator("meta[name='description']").getAttribute("content")
    ).toBe(volume.description);
  });
});
