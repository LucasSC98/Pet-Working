import sequelize from "../../src/config/database";
import PetModelo from "../../src/models/PetModelo";
import UsuarioModelo from "../../src/models/UsuarioModelo";
import AgendamentoModelo from "../../src/models/AgendamentoModelo";
import { describe, it, beforeAll, afterAll, beforeEach } from "@jest/globals";

describe("Criação de Pet", () => {
  let usuarioTeste: UsuarioModelo;

  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      console.log("Conexão estabelecida");

      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await AgendamentoModelo.sync({ force: true });
      await PetModelo.sync({ force: true });
      await UsuarioModelo.sync({ force: true });
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    } catch (error) {
      console.error("Erro na configuração do banco:", error);
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await AgendamentoModelo.destroy({ where: {} });
      await PetModelo.destroy({ where: {} });
      await UsuarioModelo.destroy({ where: {} });
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

      usuarioTeste = await UsuarioModelo.create({
        nome: "João Silva",
        email: "joao@teste.com",
        cpf: "52998224725",
        senha: "Senha@123",
        dataNascimento: new Date("1990-01-01"),
        genero: "masculino",
      });

      console.log("Usuário de teste criado:", usuarioTeste.id_usuario);
    } catch (error) {
      console.error("Erro na criação do usuário de teste:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await AgendamentoModelo.destroy({ where: {} });
      await PetModelo.destroy({ where: {} });
      await UsuarioModelo.destroy({ where: {} });

      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      await sequelize.close();
    } catch (error) {
      console.error("Erro ao fechar conexão:", error);
    }
  });

  it("deve criar um pet com sucesso", async () => {
    const dadosPet = {
      nome: "Luna",
      idade: 9,
      id_usuario: usuarioTeste.id_usuario,
      raca: "SRD",
      especie: "Gato",
      peso: 3,
      foto: "ainda num tem",
      descricao: "gata muito fofa",
    };

    const pet = await PetModelo.create(dadosPet);

    expect(pet).toBeDefined();
    expect(pet.id_pet).toBeDefined();
    expect(pet.nome).toBe("Luna");
    expect(pet.id_usuario).toBe(usuarioTeste.id_usuario);
    expect(pet.especie).toBe("Gato");
    expect(pet.peso).toBe(3);
  });

  it("deve falhar ao criar pet com usuário inexistente", async () => {
    const dadosPet = {
      nome: "Luna",
      idade: 9,
      id_usuario: 99999,
      raca: "SRD",
      especie: "Gato",
      peso: 3,
      foto: "ainda num tem",
      descricao: "gata muito fofa",
    };

    await expect(async () => {
      await PetModelo.create(dadosPet);
    }).rejects.toThrow();
  });

  it("deve falhar ao criar pet com dados inválidos", async () => {
    const dadosPet = {
      nome: "Luna",
      idade: -1,
      id_usuario: usuarioTeste.id_usuario,
      raca: "SRD",
      especie: "Gato",
      peso: -3,
      foto: "ainda num tem",
      descricao: "gata muito fofa",
    };

    await expect(async () => {
      await PetModelo.create(dadosPet);
    }).rejects.toThrow();
  });
});
