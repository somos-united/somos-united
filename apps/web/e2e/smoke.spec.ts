import { expect, test } from "@playwright/test";

// Phase 0 smoke test: apps/web only has the locale-redirect root page and the
// German home page so far (01-ARCHITECTURE.md §6). This is real e2e coverage
// of that behavior, not a placeholder — it will grow alongside the actual
// marketing site / booking flow (05-MODULE-BOOKING.md).
//
// The root redirect now depends on the browser's Accept-Language (see
// lib/detect-locale.ts), so every test here pins its own context locale
// explicitly instead of relying on the runner machine's default.

test.describe("unrecognized/unsupported browser locale", () => {
  test.use({ locale: "fr-FR" });

  test("falls back to the default (de) and renders the home page", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(/\/de$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Somos");
    await expect(page.getByRole("link", { name: /Schreib uns/ })).toHaveAttribute(
      "href",
      "mailto:tech@somosunited.ch",
    );
  });
});

test.describe("English browser locale", () => {
  test.use({ locale: "en-US" });

  test("redirects the unprefixed root straight to /en", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("link", { name: /Drop us a line/ })).toBeVisible();
  });
});

test("switches to the English locale via the language link", async ({ page }) => {
  await page.goto("/de");

  await page.getByRole("link", { name: "EN" }).click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("link", { name: /Drop us a line/ })).toBeVisible();
});

test.describe("/preview gate (middleware.ts)", () => {
  test("blocks access without credentials", async ({ page }) => {
    // No PREVIEW_AUTH_USER/PASSWORD in CI, so this is either 401 (wrong/no
    // creds against a configured gate) or 503 (gate unconfigured) — either
    // way, never the actual in-progress site. Asserting "not 200" rather
    // than a specific status keeps this test meaningful regardless of
    // whether CI has the preview-gate secrets configured.
    const response = await page.goto("/preview/de");
    expect(response?.status()).not.toBe(200);
  });
});
