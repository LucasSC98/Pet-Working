import { test, expect } from "@playwright/test";
import { geradorDeCpfTest } from "../src/utils/geradorDeCpfTest";

test.describe("Fluxo Completo do Usuário", () => {
  let emailUsuario: string;
  let senhaUsuario: string;

  test.beforeEach(() => {
    // Gera dados únicos para cada teste
    emailUsuario = `usuario${Date.now()}@teste.com`;
    senhaUsuario = "SenhaForte123!";
  });

  test("Fluxo completo: Cadastro → Endereço → Pet → Agendamento → Pedido → Exclusão", async ({
    page,
  }) => {
    // 1. CADASTRO DE USUÁRIO
    await page.goto("/cadastro");
    await expect(page.getByRole("heading", { name: "Cadastro" })).toBeVisible();

    await page.fill('input[name="nome"]', "Usuário Teste Completo");
    await page.fill('input[name="email"]', emailUsuario);
    await page.fill('input[name="cpf"]', geradorDeCpfTest());
    await page.fill('input[name="senha"]', senhaUsuario);
    await page.fill('input[name="confirmarSenha"]', senhaUsuario);

    // Seleciona data de nascimento
    await page.click(".calendario-icon");
    await page.click(".react-datepicker__year-select");
    await page.selectOption(
      ".react-datepicker__year-select",
      `${new Date().getFullYear() - 25}`
    );
    await page.click(".react-datepicker__day--015");
    await page.selectOption('select[name="genero"]', "masculino");

    await page.click('button[type="submit"]');

    // Verifica sucesso do cadastro
    let sucesso = false;
    try {
      await expect(page.locator(".toast-content")).toContainText(
        "Cadastro realizado com sucesso",
        { timeout: 5000 }
      );
      sucesso = true;
    } catch {
      // Se não aparecer toast, verifica se foi para dashboard
      await expect(page).toHaveURL("https://petworking.local/dashboard", {
        timeout: 10000,
      });
      await expect(page.getByRole("heading", { name: "Resumo" })).toBeVisible();
      sucesso = true;
    }

    expect(sucesso).toBe(true);

    // 2. CADASTRO DE ENDEREÇO
    await page.goto("/minha-conta");
    await expect(
      page.getByRole("heading", { name: "Minha Conta" })
    ).toBeVisible();

    await page.click('button:has-text("Editar Perfil")');
    await page.click('button:has-text("Endereços")');

    const modalEndereco = page.locator(".endereco-container .modal");
    await expect(modalEndereco).toBeVisible();

    // Verifica se já tem endereço cadastrado
    const enderecoItem = modalEndereco.locator(".endereco-item");
    const temEndereco = await enderecoItem.first().isVisible();

    if (!temEndereco) {
      await page.fill('input[name="cep"]', "32242-140");

      // Espera o CEP ser preenchido automaticamente
      const ruaInput = page.locator('input[name="rua"]');
      await expect(ruaInput).toHaveValue(/.+/, { timeout: 5000 });

      await page.fill('input[name="numero"]', "123");
      await page.fill('input[name="bairro"]', "Centro");
      await page.fill('input[name="cidade"]', "Contagem");
      await page.fill('input[name="estado"]', "MG");

      await page.click('button:has-text("Salvar")');

      await expect(page.locator(".toast-content")).toContainText(
        "Endereço cadastrado com sucesso!",
        { timeout: 10000 }
      );
    }

    // 3. CADASTRO DE PET
    await page.goto("/pets");
    await expect(
      page.getByRole("heading", { name: "Meus Pets" })
    ).toBeVisible();

    // Verifica se já tem pet cadastrado
    const petCard = page.locator(".pet-card");
    const temPet = await petCard.first().isVisible();

    if (!temPet) {
      await page.click(
        '[data-testid="btn-cadastrar-pet"], [data-testid="btn-cadastrar-novo-pet"], button:has-text("Cadastrar Pet")'
      );

      await page.getByTestId("input-nome").fill("Pet Teste Completo");
      await page.getByTestId("input-idade").fill("3");
      await page.getByTestId("select-especie").selectOption("Cachorro");
      await page.getByTestId("input-raca").fill("Golden Retriever");
      await page.getByTestId("input-peso").fill("25");
      await page
        .getByTestId("input-descricao")
        .fill("Pet criado para teste do fluxo completo.");

      await page.getByTestId("btn-salvar-pet").click();

      await expect(page.getByTestId("pet-cadastrado-sucesso")).toBeVisible({
        timeout: 10000,
      });
    }

    // 4. CRIAR AGENDAMENTO
    await page.goto("/agendamentos");
    await expect(
      page.getByRole("heading", { name: "Meus Agendamentos" })
    ).toBeVisible();

    await page.click('button:has-text("Novo Agendamento")');
    await expect(
      page.getByRole("heading", { name: "Novo Agendamento" })
    ).toBeVisible();

    // Preenche dados do agendamento
    await page.selectOption('select[name="petId"]', { index: 1 });
    await page.selectOption('select[name="servicoId"]', { index: 1 });

    // Data para amanhã
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataFormatada = amanha.toISOString().split("T")[0];
    await page.fill('input[name="data"]', dataFormatada);

    await page.selectOption('select[name="horario"]', { index: 1 });
    await page.selectOption('select[name="formaPagamento"]', { index: 1 });

    await page.click('button[type="submit"]:has-text("Confirmar")');

    await expect(page.locator(".toast-content")).toContainText(
      "Agendamento realizado com sucesso",
      { timeout: 10000 }
    );
    await page.goto("/loja");
    await expect(
      page.getByRole("heading", { name: "Loja PetWorking" })
    ).toBeVisible();
    const primeiroProduto = page
      .locator(".produtos-grid .produto-card")
      .first();
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

    await page.goto("/configuracoes");
    await expect(
      page.getByRole("heading", { name: "Configurações de Exibição" })
    ).toBeVisible();

    const btnExcluirConta = page.locator(
      'button:has-text("Deletar Minha Conta"), button.botao-excluir, button:has-text("Deletar Conta")'
    );

    if (await btnExcluirConta.isVisible()) {
      await btnExcluirConta.click();

      const modalConfirmacao = page.locator(
        ".modal, .confirm-dialog, .tela-confirmacao"
      );
      await expect(modalConfirmacao).toBeVisible();

      await modalConfirmacao.getByRole("button", { name: "Confirmar" }).click();

      await expect(page.locator(".toast-content")).toContainText(
        "Conta deletada com sucesso!",
        { timeout: 10000 }
      );
      await expect(page).toHaveURL("https://petworking.local/", {
        timeout: 10000,
      });

      // tenta fazer login com a conta excluída

      await page.goto("/login");
      await page.fill('input[name="email"]', emailUsuario);
      await page.fill('input[name="senha"]', senhaUsuario);
      await page.click('button[type="submit"]:has-text("Login")');

      await expect(page.locator(".toast-content")).toContainText(
        "Email ou senha incorretos",
        { timeout: 5000 }
      );
    }
  });
});
