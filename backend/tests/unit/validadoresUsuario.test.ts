import {
  validarCPF,
  validarEmail,
  validarSenha,
  validarDataNascimento,
} from "../../src/validadores/ValidacaoUsuario";
import { UsuarioModelo } from "../../src/models/Relacionamento";
import sequelize from "../../src/config/database";

describe("Validadores de Usuário", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.sync({ force: true });
    await sequelize.close();
  });

  describe("Validação de CPF", () => {
    test("deve validar um CPF correto", () => {
      expect(validarCPF("529.982.247-25")).toBeTruthy();
    });

    test("deve rejeitar um CPF inválido", () => {
      expect(validarCPF("111.111.111-11")).toBeFalsy();
    });
  });

  describe("Validação de Email", () => {
    test("deve validar um email correto", () => {
      expect(validarEmail("teste@email.com")).toBeTruthy();
    });

    test("deve rejeitar um email inválido", () => {
      expect(validarEmail("emailinvalido")).toBeFalsy();
    });
  });

  describe("Validação de Senha", () => {
    test("deve validar uma senha forte", () => {
      expect(validarSenha("Senha123")).toBeTruthy();
    });

    test("deve rejeitar uma senha fraca", () => {
      expect(validarSenha("senha")).toBeFalsy();
    });
  });

  describe("Validação de Data de Nascimento", () => {
    test("deve validar maior de idade", () => {
      const data = new Date();
      data.setFullYear(data.getFullYear() - 20);
      expect(validarDataNascimento(data)).toBeTruthy();
    });

    test("deve rejeitar menor de idade", () => {
      const data = new Date();
      data.setFullYear(data.getFullYear() - 17);
      expect(validarDataNascimento(data)).toBeFalsy();
    });
  });

  describe("Criação de Usuário com Validações", () => {
    test("deve criar usuário com dados válidos", async () => {
      const data = new Date();
      data.setFullYear(data.getFullYear() - 20);

      const usuario = await UsuarioModelo.create({
        nome: "Usuário Teste",
        email: "teste@email.com",
        senha: "Senha123",
        cpf: "529.982.247-25",
        dataNascimento: data,
        genero: "MASCULINO",
      });

      expect(usuario).toBeDefined();
      expect(usuario.id_usuario).toBeDefined();
    });

    test("deve rejeitar usuário com dados inválidos", async () => {
      const data = new Date();
      data.setFullYear(data.getFullYear() - 17);

      await expect(
        UsuarioModelo.create({
          nome: "Teste Inválido",
          email: "emailinvalido",
          senha: "senha",
          cpf: "111.111.111-11",
          dataNascimento: data,
          genero: "MASCULINO",
        })
      ).rejects.toThrow();
    });
  });
});
