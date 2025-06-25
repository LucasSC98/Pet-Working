import sequelize from "../../src/config/database";
import UsuarioModelo from "../../src/models/UsuarioModelo";
import { gerarToken } from "../../src/utils/jwt";
import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../../src/middlewares/autenticacaoemiddleware";

describe("Autenticação nas Rotas", () => {
  let token: string;
  let usuarioTeste: UsuarioModelo;

  beforeAll(async () => {
    try {
      // Desativa verificação de chaves estrangeiras
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await sequelize.sync({ force: true });
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

      usuarioTeste = await UsuarioModelo.create({
        nome: "Usuário Teste",
        email: "teste@teste.com",
        cpf: "529.982.247-25", // CPF válido formatado
        senha: "Senha@123",
        dataNascimento: new Date("1990-01-01"),
        genero: "masculino",
      });

      // Gera o token usando o usuário completo
      token = gerarToken(usuarioTeste);
    } catch (error) {
      console.error("Erro ao configurar testes:", error);
      throw error;
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

  it("deve bloquear acesso sem token", async () => {
    const mockReq = {
      headers: {},
    } as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const nextFn = jest.fn() as NextFunction;

    await verificarToken(mockReq, mockRes, nextFn);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Token não fornecido",
    });
  });

  it("deve permitir acesso com token válido", async () => {
    const mockReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const nextFn = jest.fn() as NextFunction;

    await verificarToken(mockReq, mockRes, nextFn);
    expect(nextFn).toHaveBeenCalled();
  });
});
