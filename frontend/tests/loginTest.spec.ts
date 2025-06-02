import { test, expect } from "@playwright/test";

test("Login Test", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.fill('input[name="email"]', "lucas@gmail.com");
  await page.fill('input[name="senha"]', "Pamonha1");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("http://localhost:5173/dashboard");
  await page.waitForTimeout(2000);
  await expect(page.getByRole("heading", { name: "Resumo" })).toBeVisible();
});
