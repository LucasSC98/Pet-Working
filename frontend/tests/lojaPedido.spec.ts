import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "usuario@teste.com");
  await page.fill('input[name="senha"]', "Pamonha1");
  await page.click('button[type="submit"]:has-text("Login")');
  await expect(page).toHaveURL("https://petworking.local/dashboard");
  await cadastroEnderecoDeTeste(page);
});

test("Fluxo completo de compra na loja", async ({ page }) => {
  await page.goto("/loja");
  await expect(
    page.getByRole("heading", { name: "Loja PetWorking" })
  ).toBeVisible();

  const primeiroProduto = page.locator(".produtos-grid .produto-card").first();
  await expect(primeiroProduto).toBeVisible();
  await primeiroProduto.hover();

  const btnAdicionar = primeiroProduto.locator(
    'button[aria-label="Adicionar ao carrinho"], button[title="Adicionar ao carrinho"], button'
  );
  await expect(btnAdicionar).toBeVisible();
  await btnAdicionar.click();

  await page.click("a.carrinho-btn");
  await expect(
    page.getByRole("heading", { name: "Meu Carrinho" })
  ).toBeVisible();

  await page.click('button:has-text("Finalizar Compra")');
  await expect(
    page.getByRole("heading", { name: "Finalizar Compra" })
  ).toBeVisible();

  const enderecoRadio = page
    .locator('input[type="radio"][name="endereco"]')
    .first();
  if (await enderecoRadio.isVisible()) {
    await enderecoRadio.check();
  }

  await page.click(
    'label[for="pagamento-pix"], .pagamento-item:has-text("PIX")'
  );

  await page.click('button[type="submit"]:has-text("Finalizar Compra")');

  await page.waitForURL(/\/loja\/confirmacao/);
  await expect(
    page.getByRole("heading", { name: "Pedido Confirmado!" })
  ).toBeVisible();
  await expect(page.locator(".pedido-numero")).toBeVisible();
});

test("Cancelar e excluir um pedido", async ({ page }) => {
  await page.goto("/loja/meus-pedidos");
  await expect(
    page.getByRole("heading", { name: "Meus Pedidos" })
  ).toBeVisible();

  const pedidoCard = page.locator(".pedido-card").first();
  await expect(pedidoCard).toBeVisible();

  const btnExpandir = pedidoCard.locator("button, svg, span").last();
  await expect(btnExpandir).toBeVisible();
  await btnExpandir.click();

  const btnCancelar = pedidoCard.locator("button.btn-cancelar-pedido");
  await expect(btnCancelar).toBeVisible();
  await btnCancelar.click();

  const modal = page.locator(".confirm-dialog");
  await expect(modal).toBeVisible();
  await expect(
    modal.getByRole("heading", { name: "Cancelar Pedido" })
  ).toBeVisible();
  await modal.getByRole("button", { name: "Confirmar" }).click();

  await expect(page.locator(".toast-content")).toContainText(
    "Pedido cancelado com sucesso"
  );

  await pedidoCard.click();

  const btnExcluir = pedidoCard.locator("button.btn-excluir-pedido");
  await expect(btnExcluir).toBeVisible();
  await btnExcluir.click();

  await expect(modal).toBeVisible();
  await expect(
    modal.getByRole("heading", { name: "Excluir Pedido" })
  ).toBeVisible();
  await modal.getByRole("button", { name: "Confirmar" }).click();

  await expect(page.locator(".toast-content")).toContainText(
    "Pedido excluído com sucesso"
  );
});

test("Realizar pedido e confirmar recebimento", async ({ page }) => {
  await page.goto("/loja");
  await expect(
    page.getByRole("heading", { name: "Loja PetWorking" })
  ).toBeVisible();

  const primeiroProduto = page.locator(".produtos-grid .produto-card").first();
  await expect(primeiroProduto).toBeVisible();
  await primeiroProduto.hover();
  const btnAdicionar = primeiroProduto.locator(
    'button[aria-label="Adicionar ao carrinho"], button[title="Adicionar ao carrinho"], button'
  );
  await expect(btnAdicionar).toBeVisible();
  await btnAdicionar.click();

  await page.click("a.carrinho-btn");
  await expect(
    page.getByRole("heading", { name: "Meu Carrinho" })
  ).toBeVisible();

  await page.click('button:has-text("Finalizar Compra")');
  await expect(
    page.getByRole("heading", { name: "Finalizar Compra" })
  ).toBeVisible();

  const enderecoRadio = page
    .locator('input[type="radio"][name="endereco"]')
    .first();
  if (await enderecoRadio.isVisible()) {
    await enderecoRadio.check();
  }

  await page.click(
    'label[for="pagamento-pix"], .pagamento-item:has-text("PIX")'
  );

  await page.click('button[type="submit"]:has-text("Finalizar Compra")');

  await page.waitForURL(/\/loja\/confirmacao/);
  await expect(
    page.getByRole("heading", { name: "Pedido Confirmado!" })
  ).toBeVisible();
  await expect(page.locator(".pedido-numero")).toBeVisible();

  await page.goto("/loja/meus-pedidos");
  await expect(
    page.getByRole("heading", { name: "Meus Pedidos" })
  ).toBeVisible();

  const pedidoCard = page.locator(".pedido-card").first();
  await expect(pedidoCard).toBeVisible();
  const btnExpandir = pedidoCard.locator("button, svg, span").last();
  await expect(btnExpandir).toBeVisible();
  await btnExpandir.click();

  const btnConfirmarRecebimento = pedidoCard.locator(
    "button.btn-entregar-pedido"
  );
  await expect(btnConfirmarRecebimento).toBeVisible();
  await btnConfirmarRecebimento.click();

  const modal = page.locator(".confirm-dialog, .tela-confirmacao, .modal");
  await expect(modal).toBeVisible();
  await expect(
    modal.getByRole("heading", { name: "Confirmar Recebimento" })
  ).toBeVisible();
  await modal.getByRole("button", { name: "Confirmar" }).click();

  await expect(page.locator(".toast-content")).toContainText(
    "Pedido marcado como entregue"
  );
});
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
    await page.fill('input[name="bairro"]', "Centro");
    await page.fill('input[name="cidade"]', "Contagem");
    await page.fill('input[name="estado"]', "MG");
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
