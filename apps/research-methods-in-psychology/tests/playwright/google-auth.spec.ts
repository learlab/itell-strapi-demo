import {
  expect,
  http,
  HttpResponse,
  passthrough,
  test,
} from "next/experimental/testmode/playwright/msw";

test.use({
  mswHandlers: [
    http.get(
      "https://accounts.google.com/v3/signin/identifier",
      ({ request }) => {
        console.log("intercepting google oauth requests");
        const searchParams = new URL(request.url).searchParams;
        const dst = new URL(searchParams.get("redirect_uri") as string);
        dst.searchParams.append("state", searchParams.get("state") as string);
        return HttpResponse.redirect(dst);
      }
    ),
  ],
});

test.describe("google oauth", () => {
  test("can log in", async ({ page }) => {
    await page.goto("/auth");

    await page.getByTestId("google-login-button").click();

    await page.waitForURL("/auth/google");
  });
});
