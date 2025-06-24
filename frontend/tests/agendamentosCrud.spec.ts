import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "usuario@teste.com");
  await page.fill('input[name="senha"]', "Pamonha1");
  await page.click('button[type="submit"]:has-text("Login")');
  await expect(page).toHaveURL("https://petworking.local/dashboard");
  await cadastroEnderecoDeTeste(page);
  await cadastrarPetDeTeste(page);
});

test("Cadastrar agendamento com sucesso", async ({ page }) => {
  await page.goto("/agendamentos");
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();

  await page.click('button:has-text("Novo Agendamento")');
  await expect(
    page.getByRole("heading", { name: "Novo Agendamento" })
  ).toBeVisible();

  await page.selectOption('select[name="petId"]', { index: 1 });
  await page.selectOption('select[name="servicoId"]', { index: 1 });
  await page.fill('input[name="data"]', obterData());
  await page.selectOption('select[name="formaPagamento"]', { index: 1 });
  await page.selectOption('select[name="horario"]', { index: 1 });

  await page.click('button[type="submit"]:has-text("Confirmar")');
  await expect(page.locator(".toast-content")).toContainText(
    "Agendamento realizado com sucesso"
  );
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();
  await expect(page.locator(".agendamento-card").first()).toBeVisible();
});

test("Editar agendamento com sucesso", async ({ page }) => {
  await page.goto("/agendamentos");
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();

  const agendamentoCard = page.locator(".agendamento-card").first();
  await agendamentoCard.locator(".btn-confirmar").click();
  await expect(
    page.getByRole("heading", { name: "Detalhes do Agendamento" })
  ).toBeVisible();

  await page.click("button.btn-mudar-horario");

  await expect(page.locator(".modal-editar-horario")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Mudar Horário" })
  ).toBeVisible();

  const dateInput = page.locator('.modal-editar-horario input[type="date"]');
  await dateInput.waitFor({ state: "visible" });
  await dateInput.fill(obterData(3));
  const horarioSelect = page.locator(".modal-editar-horario select");
  await horarioSelect.waitFor({ state: "visible" });
  await expect(horarioSelect).toBeEnabled();
  const optionCount = await horarioSelect.locator("option").count();
  expect(optionCount).toBeGreaterThan(1);
  await horarioSelect.selectOption({ index: 6 });

  await page.click('.modal-editar-horario button:has-text("Salvar")');

  await expect(page.locator(".toast-content")).toContainText(
    "Horário alterado com sucesso"
  );

  await expect(page.locator(".modal-editar-horario")).not.toBeVisible();
});

test("Listar agendamentos", async ({ page }) => {
  await page.goto("/agendamentos");
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();

  const cards = page.locator(".agendamento-card");
  if (!(await cards.first().isVisible())) {
    await page.click('button:has-text("Novo Agendamento")');
    await expect(
      page.getByRole("heading", { name: "Novo Agendamento" })
    ).toBeVisible();
    await page.selectOption('select[name="petId"]', { index: 1 });
    await page.selectOption('select[name="servicoId"]', { index: 1 });
    await page.fill('input[name="data"]', obterData());
    await page.selectOption('select[name="formaPagamento"]', { index: 1 });
    await page.selectOption('select[name="horario"]', { index: 1 });
    await page.click('button[type="submit"]:has-text("Confirmar")');
    await expect(page.locator(".toast-content")).toContainText(
      "Agendamento realizado com sucesso"
    );
    await page.goto("/agendamentos");
  }

  await expect(cards.first()).toBeVisible();
});

test("Cancelar e deletar agendamento", async ({ page }) => {
  await page.goto("/agendamentos");
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();

  const agendamentoCard = page.locator(".agendamento-card").first();
  await agendamentoCard.locator(".btn-confirmar").click();
  await expect(
    page.getByRole("heading", { name: "Detalhes do Agendamento" })
  ).toBeVisible();

  await page.click("button.btn-cancelar-agendamento");
  await page.click('button:has-text("Confirmar")');
  await expect(page.locator(".toast-content")).toContainText(
    "Agendamento cancelado com sucesso"
  );

  await page.click("button.btn-excluir");
  await page.click('button:has-text("Confirmar")');
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();
});

test("Fluxo completo: criar, editar, cancelar e excluir agendamento", async ({
  page,
}) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "lucas@gmail.com");
  await page.fill('input[name="senha"]', "Pamonha1");
  await page.click('button[type="submit"]:has-text("Login")');
  await expect(page).toHaveURL("https://petworking.local/dashboard");
  await page.goto("/agendamentos");
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();
  await page.click('button:has-text("Novo Agendamento")');
  await expect(
    page.getByRole("heading", { name: "Novo Agendamento" })
  ).toBeVisible();
  await page.selectOption('select[name="petId"]', { index: 1 });
  await page.selectOption('select[name="servicoId"]', { index: 1 });
  await page.fill('input[name="data"]', obterData());
  await page.selectOption('select[name="formaPagamento"]', { index: 1 });
  await page.selectOption('select[name="horario"]', { index: 1 });
  await page.click('button[type="submit"]:has-text("Confirmar")');
  await expect(page.locator(".toast-content")).toContainText(
    "Agendamento realizado com sucesso"
  );
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();

  const agendamentoCard = page.locator(".agendamento-card").first();
  await agendamentoCard.locator(".btn-confirmar").click();
  await expect(
    page.getByRole("heading", { name: "Detalhes do Agendamento" })
  ).toBeVisible();

  await page.click("button.btn-mudar-horario");
  await expect(page.locator(".modal-editar-horario")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Mudar Horário" })
  ).toBeVisible();
  const dateInput = page.locator('.modal-editar-horario input[type="date"]');
  await dateInput.waitFor({ state: "visible" });
  await dateInput.fill(obterData(3));
  const horarioSelect = page.locator(".modal-editar-horario select");
  await horarioSelect.waitFor({ state: "visible" });
  await expect(horarioSelect).toBeEnabled();
  const optionCount = await horarioSelect.locator("option").count();
  expect(optionCount).toBeGreaterThan(1);
  await horarioSelect.selectOption({ index: 6 });
  await page.click('.modal-editar-horario button:has-text("Salvar")');
  await expect(page.locator(".toast-content")).toContainText(
    "Horário alterado com sucesso"
  );
  await expect(page.locator(".modal-editar-horario")).not.toBeVisible();

  await page.click("button.btn-cancelar-agendamento");
  await page.click('button:has-text("Confirmar")');
  await expect(page.locator(".toast-content")).toContainText(
    "Agendamento cancelado com sucesso"
  );

  await page.click("button.btn-excluir");
  await page.click('button:has-text("Confirmar")');
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();
});

test("Não permite criar agendamento sem preencher campos obrigatórios", async ({
  page,
}) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "lucas@gmail.com");
  await page.fill('input[name="senha"]', "Pamonha1");
  await page.click('button[type="submit"]:has-text("Login")');
  await expect(page).toHaveURL("https://petworking.local/dashboard");

  await page.goto("/agendamentos");
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();

  await page.click('button:has-text("Novo Agendamento")');
  await expect(
    page.getByRole("heading", { name: "Novo Agendamento" })
  ).toBeVisible();

  await page.click('button[type="submit"]:has-text("Confirmar")');

  await expect(
    page.getByRole("heading", { name: "Novo Agendamento" })
  ).toBeVisible();

  const estaInvalido = await page
    .locator('select[name="petId"]')
    .evaluate(
      (el) =>
        (el as HTMLSelectElement).validity.valueMissing ||
        (el as HTMLSelectElement).matches(":invalid")
    );
  expect(estaInvalido).toBe(true);
});

test("Cadastrar agendamento com transporte e pagamento PIX", async ({
  page,
}) => {
  await page.goto("/agendamentos");
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();

  await page.click('button:has-text("Novo Agendamento")');
  await expect(
    page.getByRole("heading", { name: "Novo Agendamento" })
  ).toBeVisible();

  await page.selectOption('select[name="petId"]', { index: 1 });
  await page.selectOption('select[name="servicoId"]', { index: 1 });
  await page.fill('input[name="data"]', obterData());
  await page.selectOption('select[name="horario"]', { index: 3 });

  await page.check('input[type="checkbox"][name="precisaTransporte"]');
  await page.selectOption('select[name="enderecoId"]', { index: 1 });

  await page.selectOption('select[name="formaPagamento"]', { label: "PIX" });

  await page.click('button[type="submit"]:has-text("Confirmar")');
  await expect(page.locator(".toast-content")).toContainText(
    "Agendamento realizado com sucesso"
  );
  await expect(
    page.getByRole("heading", { name: "Meus Agendamentos" })
  ).toBeVisible();
  await expect(page.locator(".agendamento-card").first()).toBeVisible();
});

function obterData(dias = 1) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toISOString().split("T")[0];
}

async function cadastrarPetDeTeste(page) {
  await page.goto("/pets");
  const temPet = await page.locator(".pet-card").first().isVisible();
  if (!temPet) {
    await page.click(
      '[data-testid="btn-cadastrar-pet"], [data-testid="btn-cadastrar-novo-pet"]'
    );
    await page.getByTestId("input-nome").fill("Pet Teste");
    await page.getByTestId("input-idade").fill("2");
    await page.getByTestId("select-especie").selectOption("Cachorro");
    await page.getByTestId("input-raca").fill("Vira-lata");
    await page.getByTestId("input-peso").fill("10");
    await page
      .getByTestId("input-descricao")
      .fill("Pet criado para teste de agendamento.");
    await page.getByTestId("btn-salvar-pet").click();
    await expect(page.getByTestId("pet-cadastrado-sucesso")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator(".cadastro-pet-container")).not.toBeVisible();
  }
}

async function cadastroEnderecoDeTeste(page) {
  await page.goto("/minha-conta");
  await page.click('button:has-text("Editar Perfil")');
  await page.click('button:has-text("Endereços")');
  const modal = page.locator(".endereco-container .modal");
  await expect(modal).toBeVisible();

  const enderecoItem = modal.locator(".endereco-item");
  const temEndereco = await enderecoItem.first().isVisible();

  if (!temEndereco) {
    await page.fill('input[name="cep"]', "32242-140");
    //espera um pouco para o CEP ser preenchido
    const ruaInput = page.locator('input[name="rua"]');
    await expect(ruaInput).toHaveValue(/.+/, { timeout: 5000 });
    await page.fill('input[name="numero"]', "123");
    await page.click('button:has-text("Salvar")');
    await expect(page.locator(".toast-content")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator(".toast-content")).toContainText(
      "Endereço cadastrado com sucesso!",
      { timeout: 10000 }
    );
  }
}
