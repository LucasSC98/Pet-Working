import sequelize from "../../src/config/database";
import UsuarioModelo from "../../src/models/UsuarioModelo";
import { Request, Response } from "express";
import { atualizarUsuario } from "../../src/controllers/UsuariosController";

describe("Restrição de Edição", () => {
  let usuarioTeste1: UsuarioModelo;
  let usuarioTeste2: UsuarioModelo;

  beforeAll(async () => {
    try {
      // Desativa verificação de chaves estrangeiras
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await sequelize.sync({ force: true });
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

      // Cria os usuários de teste
      usuarioTeste1 = await UsuarioModelo.create({
        nome: "Usuário 1",
        email: "usuario1@teste.com",
        cpf: "529.982.247-25",
        senha: "Senha@123",
        dataNascimento: new Date("1990-01-01"),
        genero: "masculino",
      });

      usuarioTeste2 = await UsuarioModelo.create({
        nome: "Usuário 2",
        email: "usuario2@teste.com",
        cpf: "09806497902",
        senha: "Senha@123",
        dataNascimento: new Date("1990-01-01"),
        genero: "masculino",
      });
    } catch (error) {
      console.error("Erro ao configurar testes:", error);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await sequelize.sync({ force: true });
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      await sequelize.close();
    } catch (error) {
      console.error("Erro ao limpar testes:", error);
    }
  });

  it("deve impedir edição de dados de outro usuário", async () => {
    const mockReq = {
      params: { id: usuarioTeste2.id_usuario?.toString() },
      usuarioId: usuarioTeste1.id_usuario,
      body: {
        nome: "Tentativa de Alteração",
      },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await atualizarUsuario(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Você não tem permissão para editar este usuário",
    });
  });

  it("deve permitir edição dos próprios dados", async () => {
    const mockReq = {
      params: { id: usuarioTeste1.id_usuario?.toString() },
      usuarioId: usuarioTeste1.id_usuario,
      body: {
        nome: "Novo Nome",
        cpf: "52998224725",
        senha: "NovaSenha@123",
        dataNascimento: new Date("1990-01-01"),
        genero: "masculino",
      },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await atualizarUsuario(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
