import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

/**
 * Gera dados realistas para pets usando faker
 */
function gerarDadosPet(): {
  nome: string;
  idade: string;
  especie: string;
  raca: string;
  peso: string;
  descricao: string;
  foto: string;
} {
  // Usar apenas as espécies que existem no formulário real
  const especies = [
    "Cachorro",
    "Gato",
    "Ave",
    "Roedor",
    "Peixe",
    "Réptil",
    "Anfíbio",
    "Inseto",
    "Aracnídeo",
    "Equino",
    "Bovino",
    "Caprino",
    "Outro",
  ];

  const racasCachorro = [
    "Golden Retriever",
    "Labrador",
    "Bulldog",
    "Pastor Alemão",
    "Poodle",
    "Vira-lata",
  ];
  const racasGato = [
    "Persa",
    "Siamês",
    "Maine Coon",
    "British Shorthair",
    "Ragdoll",
    "SRD",
  ];
  const racasAve = ["Canário", "Periquito", "Papagaio", "Bem-te-vi", "Outro"];
  const racasRoedor = [
    "Hamster",
    "Coelho",
    "Chinchila",
    "Porquinho-da-índia",
    "Outro",
  ];
  const racasGenericas = ["Comum", "SRD", "Puro", "Misto", "Outro"];
  const especie = faker.helpers.arrayElement(especies);

  // Definir raças baseadas na espécie selecionada
  let racas;
  switch (especie) {
    case "Cachorro":
      racas = racasCachorro;
      break;
    case "Gato":
      racas = racasGato;
      break;
    case "Ave":
      racas = racasAve;
      break;
    case "Roedor":
      racas = racasRoedor;
      break;
    default:
      racas = racasGenericas;
  }

  // Nomes realistas de pets por espécie
  const nomesCachorro = [
    "Rex",
    "Buddy",
    "Max",
    "Bella",
    "Luna",
    "Charlie",
    "Lucy",
    "Cooper",
    "Daisy",
    "Rocky",
    "Lola",
    "Duke",
    "Molly",
    "Jack",
    "Sophie",
    "Zeus",
    "Sadie",
    "Bear",
    "Maggie",
    "Tucker",
    "Bailey",
    "Stella",
    "Gus",
    "Zoey",
    "Oliver",
    "Lily",
    "Bentley",
    "Nala",
    "Toby",
    "Chloe",
  ];

  const nomesGato = [
    "Whiskers",
    "Shadow",
    "Tiger",
    "Smokey",
    "Mittens",
    "Oreo",
    "Felix",
    "Garfield",
    "Simba",
    "Nala",
    "Milo",
    "Princess",
    "Ginger",
    "Patches",
    "Boots",
    "Socks",
    "Marble",
    "Peanut",
    "Cocoa",
    "Midnight",
    "Storm",
    "Angel",
    "Bandit",
    "Pepper",
    "Snowball",
    "Fluffy",
    "Coco",
    "Jasper",
    "Ruby",
    "Oscar",
  ];

  const nomesAve = [
    "Tweety",
    "Sunny",
    "Rio",
    "Kiwi",
    "Mango",
    "Peaches",
    "Skye",
    "Breeze",
    "Echo",
    "Chirpy",
    "Melody",
    "Azure",
    "Goldie",
    "Rainbow",
    "Pippin",
    "Sage",
    "Storm",
    "Pearl",
    "Coral",
    "Indie",
  ];

  const nomesRoedor = [
    "Nibbles",
    "Squeaky",
    "Peanut",
    "Chip",
    "Cookie",
    "Marshmallow",
    "Buttons",
    "Patches",
    "Honey",
    "Cinnamon",
    "Mochi",
    "Biscuit",
    "Cashew",
    "Almond",
    "Pistachio",
    "Hazel",
    "Pecan",
    "Walnut",
    "Acorn",
    "Clover",
  ];
  const nomesGenericos = [
    "Spirit",
    "Lucky",
    "Shadow",
    "Storm",
    "Star",
    "Sunny",
    "Rainbow",
    "Crystal",
    "Jade",
    "Ruby",
    "Diamond",
    "Pearl",
    "Coral",
    "River",
    "Ocean",
    "Sky",
    "Cloud",
    "Moon",
    "Sun",
  ];
  let nomesDisponiveis;
  switch (especie) {
    case "Cachorro":
      nomesDisponiveis = nomesCachorro;
      break;
    case "Gato":
      nomesDisponiveis = nomesGato;
      break;
    case "Ave":
      nomesDisponiveis = nomesAve;
      break;
    case "Roedor":
      nomesDisponiveis = nomesRoedor;
      break;
    default:
      nomesDisponiveis = nomesGenericos;
  }
  const nomeBase = faker.helpers.arrayElement(nomesDisponiveis);

  return {
    nome: `${nomeBase}_${Date.now()}`,
    // idade aleatória com pesos para diferentes faixas de idade
    idade: faker.helpers.weightedArrayElement([
      { weight: 0.3, value: faker.number.int({ min: 1, max: 2 }).toString() },
      { weight: 0.4, value: faker.number.int({ min: 3, max: 7 }).toString() },
      { weight: 0.2, value: faker.number.int({ min: 8, max: 12 }).toString() },
      { weight: 0.1, value: faker.number.int({ min: 13, max: 18 }).toString() },
    ]),

    especie,
    raca: faker.helpers.arrayElement(racas),
    peso: (() => {
      switch (especie) {
        case "Cachorro":
          return faker.number
            .float({ min: 2.0, max: 45.0, fractionDigits: 1 })
            .toString();
        case "Gato":
          return faker.number
            .float({ min: 1.5, max: 8.0, fractionDigits: 1 })
            .toString();
        case "Ave":
          return faker.number
            .float({ min: 0.1, max: 2.0, fractionDigits: 2 })
            .toString();
        case "Roedor":
          return faker.number
            .float({ min: 0.1, max: 3.0, fractionDigits: 2 })
            .toString();
        case "Peixe":
          return faker.number
            .float({ min: 0.05, max: 5.0, fractionDigits: 2 })
            .toString();
        default:
          return faker.number
            .float({ min: 0.5, max: 20.0, fractionDigits: 1 })
            .toString();
      }
    })(),
    descricao: (() => {
      const personalidades = {
        Cachorro: [
          "brincalhão",
          "leal",
          "carinhoso",
          "protetor",
          "energético",
          "obediente",
        ],
        Gato: [
          "independente",
          "curioso",
          "carinhoso",
          "travesso",
          "elegante",
          "observador",
        ],
        Ave: [
          "cantante",
          "colorido",
          "sociável",
          "inteligente",
          "ativo",
          "alegre",
        ],
        Roedor: [
          "pequeno",
          "ágil",
          "fofo",
          "curioso",
          "brincalhão",
          "carinhoso",
        ],
        Peixe: [
          "tranquilo",
          "colorido",
          "gracioso",
          "pacífico",
          "ornamental",
          "sereno",
        ],
        default: [
          "único",
          "especial",
          "carinhoso",
          "dócil",
          "interessante",
          "amigável",
        ],
      };

      const traits = personalidades[especie] || personalidades["default"];
      const trait = faker.helpers.arrayElement(traits);
      return faker.helpers.arrayElement([
        `Um pet ${trait} e muito querido pela família.`,
        `${nomeBase} é ${trait} e adora brincar.`,
        `Pet ${trait} que se adapta bem ao ambiente doméstico.`,
        `Animal ${trait} e de fácil convivência.`,
        `Um companheiro ${trait} e muito afetuoso.`,
      ]);
    })(),
    foto: (() => {
      // Usar hash baseado na espécie para seed fixo (mesma imagem sempre para cada espécie)
      const especieMap = {
        Cachorro: 1,
        Gato: 2,
        Ave: 3,
        Roedor: 4,
        Peixe: 5,
        Réptil: 6,
        Anfíbio: 7,
        Inseto: 8,
        Aracnídeo: 9,
        Equino: 10,
        Bovino: 11,
        Caprino: 12,
        Outro: 13,
      };
      const seedFixo = especieMap[especie as keyof typeof especieMap] || 1;
      const tamanho = "150/150"; // Tamanho quadrado fixo

      switch (especie) {
        case "Cachorro":
          return `https://picsum.photos/seed/dog${seedFixo}/${tamanho}`;
        case "Gato":
          return `https://picsum.photos/seed/cat${seedFixo}/${tamanho}`;
        case "Ave":
          return `https://picsum.photos/seed/bird${seedFixo}/${tamanho}`;
        case "Roedor":
          return `https://picsum.photos/seed/hamster${seedFixo}/${tamanho}`;
        case "Peixe":
          return `https://picsum.photos/seed/fish${seedFixo}/${tamanho}`;
        case "Réptil":
          return `https://picsum.photos/seed/reptile${seedFixo}/${tamanho}`;
        case "Anfíbio":
          return `https://picsum.photos/seed/frog${seedFixo}/${tamanho}`;
        case "Inseto":
          return `https://picsum.photos/seed/insect${seedFixo}/${tamanho}`;
        case "Aracnídeo":
          return `https://picsum.photos/seed/spider${seedFixo}/${tamanho}`;
        case "Equino":
          return `https://picsum.photos/seed/horse${seedFixo}/${tamanho}`;
        case "Bovino":
          return `https://picsum.photos/seed/cow${seedFixo}/${tamanho}`;
        case "Caprino":
          return `https://picsum.photos/seed/goat${seedFixo}/${tamanho}`;
        default:
          return `https://picsum.photos/seed/pet${seedFixo}/${tamanho}`;
      }
    })(),
  };
}

const petTeste = gerarDadosPet();

const usuarioTeste = {
  email: "lucas@gmail.com",
  senha: "Pamonha1",
};

test.describe("CRUD de Pets - Testes End-to-End", () => {
  const clickCadastrarPet = async (page: Page) => {
    const btnCadastrar = page
      .locator(
        "[data-testid='btn-cadastrar-pet'], [data-testid='btn-cadastrar-novo-pet']"
      )
      .first();
    await expect(btnCadastrar).toBeVisible();
    await btnCadastrar.click();
  };
  const uploadFotoPet = async (page: Page) => {
    const buffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    const input = page.getByTestId("input-foto-pet");
    await input.setInputFiles({
      name: "pet-test.png",
      mimeType: "image/png",
      buffer: buffer,
    });
    await expect(page.locator(".image-preview-options")).toBeVisible({
      timeout: 3000,
    });
    await page.getByTestId("btn-usar-assim").click();
    try {
      await expect(page.getByTestId("pet-foto-sucesso")).toBeVisible({
        timeout: 5000,
      });
      await expect(page.getByTestId("pet-foto-sucesso")).not.toBeVisible({
        timeout: 10000,
      });
    } catch (error) {
      console.log(
        "Toast de foto não apareceu/desapareceu como esperado, continuando:",
        error
      );
    }
  };

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', usuarioTeste.email);
    await page.fill('input[name="senha"]', usuarioTeste.senha);
    await page.click('button[type="submit"]:has-text("Login")');
    await expect(page.getByTestId("login-sucesso")).toBeVisible();

    await page.goto("/pets");
    await page.waitForLoadState("networkidle");
  });
  test("Deve cadastrar um pet com sucesso", async ({ page }) => {
    await clickCadastrarPet(page);
    await expect(page.locator(".cadastro-pet-container")).toBeVisible();
    const petUnico = gerarDadosPet();
    await page.getByTestId("input-nome").fill(petUnico.nome);
    await page.getByTestId("input-idade").fill(petUnico.idade);
    await page.getByTestId("select-especie").selectOption(petUnico.especie);
    await page.getByTestId("input-raca").fill(petUnico.raca);
    await page.getByTestId("input-foto-url").fill(petUnico.foto);
    await page.getByTestId("input-peso").fill(petUnico.peso);
    await page.getByTestId("input-descricao").fill(petUnico.descricao);

    await page.getByTestId("btn-salvar-pet").click();
    await expect(page.getByTestId("pet-cadastrado-sucesso")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("pet-cadastrado-sucesso")).toContainText(
      "Pet cadastrado com sucesso!"
    );

    await expect(page.locator(".cadastro-pet-container")).not.toBeVisible();
  });

  test("Deve exibir erro ao cadastrar pet com campos obrigatórios vazios", async ({
    page,
  }) => {
    await clickCadastrarPet(page);
    await expect(page.locator(".cadastro-pet-container")).toBeVisible();

    await page.getByTestId("select-especie").selectOption("Cachorro");

    await page.getByTestId("input-nome").fill("");
    await page.getByTestId("input-idade").fill("");
    await page.getByTestId("input-raca").fill("");
    await page.getByTestId("input-peso").fill("");

    await page.getByTestId("btn-salvar-pet").click();
    await expect(page.getByTestId("pet-validacao-erro")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("pet-validacao-erro")).toContainText(
      "Por favor, preencha todos os campos obrigatórios corretamente!"
    );
  });

  test("Deve exibir erro de validação HTML5 quando espécie não é selecionada", async ({
    page,
  }) => {
    await clickCadastrarPet(page);

    await expect(page.locator(".cadastro-pet-container")).toBeVisible();

    await page.getByTestId("input-nome").fill(petTeste.nome);
    await page.getByTestId("input-idade").fill(petTeste.idade);
    await page.getByTestId("input-raca").fill(petTeste.raca);
    await page.getByTestId("input-peso").fill(petTeste.peso);
    await page.getByTestId("btn-salvar-pet").click();

    const especieSelect = page.getByTestId("select-especie");

    const isValid = await especieSelect.evaluate((el: HTMLSelectElement) =>
      el.checkValidity()
    );
    expect(isValid).toBe(false);

    await expect(page.locator(".cadastro-pet-container")).toBeVisible();
  });

  test("Deve exibir erro ao cadastrar pet com dados inválidos", async ({
    page,
  }) => {
    await clickCadastrarPet(page);

    await expect(page.locator(".cadastro-pet-container")).toBeVisible();

    await page.getByTestId("input-nome").fill(petTeste.nome);
    await page.getByTestId("input-idade").fill("-1");
    await page.getByTestId("select-especie").selectOption(petTeste.especie);
    await page.getByTestId("input-raca").fill(petTeste.raca);
    await page.getByTestId("input-peso").fill("-10");

    await page.getByTestId("btn-salvar-pet").click();

    await expect(page.getByTestId("pet-validacao-erro")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("pet-validacao-erro")).toContainText(
      "Por favor, preencha todos os campos obrigatórios corretamente!"
    );
  });
  test("Deve listar pets do usuário", async ({ page }) => {
    const btnCadastrar = page
      .locator(
        "[data-testid='btn-cadastrar-pet'], [data-testid='btn-cadastrar-novo-pet']"
      )
      .first();
    await expect(btnCadastrar).toBeVisible();

    const noPetsMessage = page.locator(".no-pets-message");
    const petsList = page.locator(".pets-list");
    const hasPets = await petsList.isVisible();
    if (hasPets) {
      await expect(petsList).toBeVisible();
      const petCount = await page.locator(".pet-card").count();
      await expect(page.locator(".pet-card")).toHaveCount(petCount);
    } else {
      await expect(noPetsMessage).toBeVisible();
      await expect(noPetsMessage).toContainText("Nenhum Pet Cadastrado");
    }
  });
  test("Deve editar um pet existente com sucesso", async ({ page }) => {
    const hasPets = await page.locator(".pet-card").first().isVisible();
    if (!hasPets) {
      await clickCadastrarPet(page);
      await expect(page.locator(".cadastro-pet-container")).toBeVisible();

      const petUnico = gerarDadosPet();
      await page.getByTestId("input-nome").fill(petUnico.nome);
      await page.getByTestId("input-idade").fill(petUnico.idade);
      await page.getByTestId("select-especie").selectOption(petUnico.especie);
      await page.getByTestId("input-raca").fill(petUnico.raca);
      await page.getByTestId("input-peso").fill(petUnico.peso);
      await page.getByTestId("input-descricao").fill(petUnico.descricao);

      await page.getByTestId("btn-salvar-pet").click();
      await expect(page.getByTestId("pet-cadastrado-sucesso")).toBeVisible();
      await expect(page.locator(".cadastro-pet-container")).not.toBeVisible();
    }

    await page.waitForTimeout(1000);

    const firstEditButton = page
      .locator("[data-testid^='btn-editar-pet-']")
      .first();
    await expect(firstEditButton).toBeVisible();
    await firstEditButton.click();
    await expect(page.locator(".cadastro-pet-container")).toBeVisible();
    await expect(page.locator(".cadastro-pet-container h1")).toContainText(
      "Editar Pet"
    );

    const petEditadoUnico = gerarDadosPet();
    await page.getByTestId("input-nome").fill(petEditadoUnico.nome);
    await page.getByTestId("input-idade").fill(petEditadoUnico.idade);
    await page
      .getByTestId("select-especie")
      .selectOption(petEditadoUnico.especie);
    await page.getByTestId("input-raca").fill(petEditadoUnico.raca);
    await page.getByTestId("input-peso").fill(petEditadoUnico.peso);
    await page.getByTestId("input-descricao").fill(petEditadoUnico.descricao);

    try {
      await uploadFotoPet(page);
      const fotoSucesso = page.getByTestId("pet-foto-sucesso");
      if (await fotoSucesso.isVisible({ timeout: 3000 })) {
        await expect(fotoSucesso).toBeVisible();
      }
    } catch (error) {
      console.log("Upload de foto opcional falhou, continuando teste:", error);
    }

    await page.getByTestId("btn-salvar-pet").click();

    await expect(page.getByTestId("pet-editado-sucesso")).toBeVisible();
    await expect(page.getByTestId("pet-editado-sucesso")).toContainText(
      "Pet atualizado com sucesso!"
    );

    await expect(page.locator(".cadastro-pet-container")).not.toBeVisible();

    await expect(page.locator(`text=${petEditadoUnico.nome}`)).toBeVisible();
  });
  test("Deve excluir um pet com sucesso", async ({ page }) => {
    const hasPets = await page.locator(".pet-card").first().isVisible();
    if (!hasPets) {
      await clickCadastrarPet(page);
      await expect(page.locator(".cadastro-pet-container")).toBeVisible();
      const petUnico = gerarDadosPet();
      await page.getByTestId("input-nome").fill(petUnico.nome);
      await page.getByTestId("input-idade").fill(petUnico.idade);
      await page.getByTestId("select-especie").selectOption(petUnico.especie);
      await page.getByTestId("input-raca").fill(petUnico.raca);
      await page.getByTestId("input-peso").fill(petUnico.peso);
      await page.getByTestId("input-descricao").fill(petUnico.descricao);

      await page.getByTestId("btn-salvar-pet").click();
      await expect(page.getByTestId("pet-cadastrado-sucesso")).toBeVisible();
      await expect(page.locator(".cadastro-pet-container")).not.toBeVisible();
    }

    await page.waitForTimeout(1000);

    const firstDeleteButton = page
      .locator("[data-testid^='btn-deletar-pet-']")
      .first();
    await expect(firstDeleteButton).toBeVisible();
    await firstDeleteButton.click();

    await expect(page.locator(".confirm-dialog")).toBeVisible();
    await expect(page.locator(".confirm-dialog h2")).toContainText(
      "Confirmar Exclusão"
    );

    await page.getByTestId("btn-confirmar-exclusao").click();

    await expect(page.getByTestId("pet-removido-sucesso")).toBeVisible();
    await expect(page.getByTestId("pet-removido-sucesso")).toContainText(
      "Pet removido com sucesso!"
    );
  });
  test("Deve cancelar exclusão de pet", async ({ page }) => {
    const hasPets = await page.locator(".pet-card").first().isVisible();
    if (!hasPets) {
      await clickCadastrarPet(page);
      await expect(page.locator(".cadastro-pet-container")).toBeVisible();

      const petUnico = gerarDadosPet();
      await page.getByTestId("input-nome").fill(petUnico.nome);
      await page.getByTestId("input-idade").fill(petUnico.idade);
      await page.getByTestId("select-especie").selectOption(petUnico.especie);
      await page.getByTestId("input-raca").fill(petUnico.raca);
      await page.getByTestId("input-peso").fill(petUnico.peso);
      await page.getByTestId("input-descricao").fill(petUnico.descricao);

      await page.getByTestId("btn-salvar-pet").click();
      await expect(page.getByTestId("pet-cadastrado-sucesso")).toBeVisible();
      await expect(page.locator(".cadastro-pet-container")).not.toBeVisible();
    }

    await page.waitForTimeout(1000);

    const petsCountBefore = await page.locator(".pet-card").count();

    const firstDeleteButton = page
      .locator("[data-testid^='btn-deletar-pet-']")
      .first();
    await expect(firstDeleteButton).toBeVisible();
    await firstDeleteButton.click();

    await expect(page.locator(".confirm-dialog")).toBeVisible();

    await page.getByTestId("btn-cancelar-exclusao").click();

    await expect(page.locator(".confirm-dialog")).not.toBeVisible();

    await expect(page.locator(".pet-card")).toHaveCount(petsCountBefore);
  });

  test("Fluxo completo: Cadastrar, Listar, Editar e Excluir pet", async ({
    page,
  }) => {
    await clickCadastrarPet(page);
    await expect(page.locator(".cadastro-pet-container")).toBeVisible();

    const petCompleto = gerarDadosPet();
    await page.getByTestId("input-nome").fill(petCompleto.nome);
    await page.getByTestId("input-idade").fill(petCompleto.idade);
    await page.getByTestId("select-especie").selectOption(petCompleto.especie);
    await page.getByTestId("input-raca").fill(petCompleto.raca);
    await page.getByTestId("input-peso").fill(petCompleto.peso);
    await page.getByTestId("input-descricao").fill(petCompleto.descricao);

    await page.getByTestId("btn-salvar-pet").click();
    await expect(page.getByTestId("pet-cadastrado-sucesso")).toBeVisible();
    await expect(page.locator(".cadastro-pet-container")).not.toBeVisible();

    await expect(page.locator(`text=${petCompleto.nome}`)).toBeVisible();
    const petCard = page.locator(".pet-card", {
      hasText: petCompleto.nome,
    });
    await expect(petCard).toBeVisible();

    const editButton = petCard.locator("[data-testid^='btn-editar-pet-']");
    await editButton.click();
    await expect(page.locator(".cadastro-pet-container")).toBeVisible();
    await expect(page.locator(".cadastro-pet-container h1")).toContainText(
      "Editar Pet"
    );

    const petEditado = gerarDadosPet();
    await page.getByTestId("input-nome").fill(petEditado.nome);
    await page.getByTestId("input-idade").fill(petEditado.idade);

    await page.getByTestId("btn-salvar-pet").click();
    await expect(page.getByTestId("pet-editado-sucesso")).toBeVisible();
    await expect(page.locator(".cadastro-pet-container")).not.toBeVisible();

    await expect(page.locator(`text=${petEditado.nome}`)).toBeVisible();
    await expect(page.locator(`text=${petCompleto.nome}`)).not.toBeVisible();

    const editedPetCard = page.locator(".pet-card", {
      hasText: petEditado.nome,
    });
    const deleteButton = editedPetCard.locator(
      "[data-testid^='btn-deletar-pet-']"
    );
    await deleteButton.click();

    await expect(page.locator(".confirm-dialog")).toBeVisible();
    await page.getByTestId("btn-confirmar-exclusao").click();
    await expect(page.getByTestId("pet-removido-sucesso")).toBeVisible();

    await expect(page.locator(`text=${petEditado.nome}`)).not.toBeVisible();
  });
});
