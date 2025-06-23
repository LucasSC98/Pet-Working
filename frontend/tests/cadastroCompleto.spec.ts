import { test, expect } from "@playwright/test";

test.describe("Cadastro de Usuário", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cadastro");
  });
  test("Cadastro com sucesso", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Cadastro" })).toBeVisible();
    await page.fill('input[name="nome"]', "Usuário Teste");
    const email = `teste${Date.now()}@gmail.com`;
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="cpf"]', "79674042032");
    await page.fill('input[name="senha"]', "SenhaForte1");
    await page.fill('input[name="confirmarSenha"]', "SenhaForte1");
    await page.click(".calendario-icon");
    await page.click(".react-datepicker__year-select");
    await page.selectOption(
      ".react-datepicker__year-select",
      `${new Date().getFullYear() - 20}`
    );
    await page.click(".react-datepicker__day--001");
    await page.selectOption('select[name="genero"]', "masculino");
    await page.click('button[type="submit"]');
    const toast = page.getByTestId("cadastro-sucesso");
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast.locator(".toast-content")).toContainText(
      "Cadastro realizado com sucesso"
    );
    await expect(page).toHaveURL("https://petworking.local/dashboard");
    await expect(page.getByRole("heading", { name: "Resumo" })).toBeVisible();
  });
  test("Cadastro falha - e-mail já cadastrado", async ({ page }) => {
    await page.fill('input[name="nome"]', "Usuário Existente");
    await page.fill('input[name="email"]', "lucas@gmail.com"); // já cadastrado
    await page.fill('input[name="cpf"]', "123.456.789-01");
    await page.fill('input[name="senha"]', "SenhaForte1");
    await page.fill('input[name="confirmarSenha"]', "SenhaForte1");
    await page.click(".calendario-icon");
    await page.click(".react-datepicker__year-select");
    await page.selectOption(
      ".react-datepicker__year-select",
      `${new Date().getFullYear() - 25}`
    );
    await page.click(".react-datepicker__day--002");
    await page.selectOption('select[name="genero"]', "feminino");
    await page.click('button[type="submit"]');
    const toast = page.getByTestId("email-ja-cadastrado");
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast.locator(".toast-content")).toHaveText(
      "E-mail já cadastrado"
    );
  });
  test("Cadastro falha - senhas diferentes", async ({ page }) => {
    await page.fill('input[name="nome"]', "Teste Senhas");
    await page.fill('input[name="email"]', `senhas${Date.now()}@gmail.com`);
    await page.fill('input[name="cpf"]', "123.456.789-02");
    await page.fill('input[name="senha"]', "SenhaForte1");
    await page.fill('input[name="confirmarSenha"]', "SenhaErrada2");
    await page.click(".calendario-icon");
    await page.click(".react-datepicker__year-select");
    await page.selectOption(
      ".react-datepicker__year-select",
      `${new Date().getFullYear() - 22}`
    );
    await page.click(".react-datepicker__day--003");
    await page.selectOption('select[name="genero"]', "outro");
    await page.click('button[type="submit"]');
    const toast = page.getByTestId("senha-diferente");
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast.locator(".toast-content")).toHaveText(
      "As senhas não coincidemm"
    );
  });
  test("Cadastro falha - menor de 18 anos", async ({ page }) => {
    await page.fill('input[name="nome"]', "Menor Idade");
    await page.fill('input[name="email"]', `menor${Date.now()}@gmail.com`);
    await page.fill('input[name="cpf"]', "123.456.789-03");
    await page.fill('input[name="senha"]', "SenhaForte1");
    await page.fill('input[name="confirmarSenha"]', "SenhaForte1");
    await page.click(".calendario-icon");
    await page.click(".react-datepicker__year-select");
    await page.selectOption(
      ".react-datepicker__year-select",
      `${new Date().getFullYear() - 16}`
    );
    await page.click(".react-datepicker__day--004");
    await page.selectOption('select[name="genero"]', "masculino");
    await page.click('button[type="submit"]');
    const toast = page.getByTestId("menor-idade");
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast.locator(".toast-content")).toHaveText(
      "É necessário ter mais de 18 anos para se cadastrar"
    );
  });
  test("Cadastro falha - data de nascimento não preenchida", async ({
    page,
  }) => {
    await page.fill('input[name="nome"]', "Sem Data");
    await page.fill('input[name="email"]', `semdata${Date.now()}@gmail.com`);
    await page.fill('input[name="cpf"]', "123.456.789-04");
    await page.fill('input[name="senha"]', "SenhaForte1");
    await page.fill('input[name="confirmarSenha"]', "SenhaForte1");
    await page.selectOption('select[name="genero"]', "masculino");
    await page.click('button[type="submit"]');
    const toast = page.getByTestId("data-nascimento-vazia");
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast.locator(".toast-content")).toHaveText(
      "Por favor, selecione uma data de nascimento"
    );
  });

  test("Cadastro falha - campos obrigatórios vazios", async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('input[name="nome"]')).toHaveAttribute(
      "required",
      ""
    );
    await expect(page.locator('input[name="email"]')).toHaveAttribute(
      "required",
      ""
    );
    await expect(page.locator('input[name="cpf"]')).toHaveAttribute(
      "required",
      ""
    );
    await expect(page.locator('input[name="senha"]')).toHaveAttribute(
      "required",
      ""
    );
    await expect(page.locator('input[name="confirmarSenha"]')).toHaveAttribute(
      "required",
      ""
    );
    await expect(page.locator('input[name="dataNascimento"]')).toHaveAttribute(
      "required",
      ""
    );
    await expect(page.locator('select[name="genero"]')).toHaveAttribute(
      "required",
      ""
    );
  });
});
