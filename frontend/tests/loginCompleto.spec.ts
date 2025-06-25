import { test, expect } from "@playwright/test";

test.describe("Login Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });
  test("Login com sucesso", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.locator(".logo-login")).toBeVisible();

    await page.fill('input[name="email"]', "lucas@gmail.com");
    await page.fill('input[name="senha"]', "Pamonha1");
    await page.click('button[type="submit"]:has-text("Login")');

    await expect(page.locator('button:has-text("Entrando...")')).toBeVisible();

    // Verificar toast de sucesso
    const toast = page.getByTestId("login-sucesso");
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast.locator(".toast-content")).toContainText(
      "Login realizado com sucesso"
    );

    await expect(page).toHaveURL("https://petworking.local/dashboard");
    await page.waitForURL("https://petworking.local/dashboard");
    await expect(page.getByRole("heading", { name: "Resumo" })).toBeVisible();
  });
  test("Login com falha - credenciais inválidas", async ({ page }) => {
    await page.fill('input[name="email"]', "email@existenao.com");
    await page.fill('input[name="senha"]', "senhaErrada1");

    await page.click('button[type="submit"]:has-text("Login")');

    await expect(page.locator('button:has-text("Login")')).toBeVisible();
    await expect(page).toHaveURL("https://petworking.local/login");

    // Verificar toast de erro específico
    const toast = page.getByTestId("credenciais-invalidas");
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast.locator(".toast-content")).toHaveText(
      "Email ou senha incorretos"
    );
  });

  test("Login com falha - campos vazios", async ({ page }) => {
    await page.click('button[type="submit"]:has-text("Login")');

    await expect(page).toHaveURL("https://petworking.local/login");

    await expect(page.locator('input[name="email"]')).toHaveAttribute(
      "type",
      "email"
    );
    await expect(page.locator('input[name="senha"]')).toHaveAttribute(
      "type",
      "password"
    );

    const emailField = page.locator('input[name="email"]');
    const senhaField = page.locator('input[name="senha"]');
    await expect(emailField).toBeEmpty();
    await expect(senhaField).toBeEmpty();
  });
});
