import { expect, test } from "@playwright/test";

// Phase 0 smoke test: apps/web only has the locale-redirect root page and the
// German home page so far (01-ARCHITECTURE.md §6). This is real e2e coverage
// of that behavior, not a placeholder — it will grow alongside the actual
// marketing site / booking flow (05-MODULE-BOOKING.md).
test("redirects the unprefixed root to the default locale and renders the home page", async ({
  page,
}) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveURL(/\/de$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Somos");
  await expect(page.getByRole("link", { name: /Schreib uns/ })).toHaveAttribute(
    "href",
    "mailto:tech@somosunited.ch",
  );
});

test("switches to the English locale via the language link", async ({ page }) => {
  await page.goto("/de");

  await page.getByRole("link", { name: "EN" }).click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("link", { name: /Drop us a line/ })).toBeVisible();
});
