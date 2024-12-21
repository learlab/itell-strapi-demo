import { chromium, expect } from "@playwright/test";

import { baseURL } from "../playwright.config";

const GOOGLE_USER = process.env.GOOGLE_USER as string;
const GOOGLE_PASS = process.env.GOOGLE_PASS as string;

async function start() {
  const browser = await chromium.launch({
    args: [
      "--disable-component-extensions-with-background-pages",
      "--disable-blink-features=AutomationControlled",
      "--start-maximized",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  // Open log in page on tested site
  await page.goto(`${baseURL}/auth`);
  await page.getByTestId("google-login-button").click();
  await page.waitForURL("https://accounts.google.com/v3/signin/**");

  // New Google sign in form
  await page.fill('input[type="email"]', GOOGLE_USER);
  await page.locator("#identifierNext >> button").click();

  await page.fill('#password >> input[type="password"]', GOOGLE_PASS);
  await page.locator("button >> nth=1").click();

  // Wait for redirect back to tested site after authentication
  await page.waitForURL(baseURL);

  expect(page.getByTestId("user-nav-menu")).toBeVisible();

  await page.context().storageState({ path: "playwright/.auth/storage.json" });

  await browser.close();
}

start();
