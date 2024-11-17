import test, { expect } from "@playwright/test";
import { volume } from "#content";
import { baseURL } from "playwright.config";
import { firstPage } from "tests/utils";

import { makePageHref } from "@/lib/utils";

test("header in homepage shows volume title", async ({ page }) => {
  await page.goto("/");
  expect(await page.getByTestId("site-title").innerText()).toBe(volume.title);
});

test("header in textbook pages shows volume title", async ({ page }) => {
  await page.goto(makePageHref(firstPage.slug));
  expect(await page.getByTestId("site-title").innerText()).toBe(volume.title);
});

test("google", async ({ page }) => {
  await page.goto(`${baseURL}/auth`);
  await page.getByTestId("google-login-button").click();
  await page.waitForURL("https://accounts.google.com/**");

  // New Google sign in form
  await page.fill('input[type="email"]', "qiushi.yann@gmail.com");
  await page.locator("#identifierNext >> button").click();

  await page.fill('input[type="password"]', "Yanqiushi123");
  await page.locator("#passwordNext >> button").click();
});
