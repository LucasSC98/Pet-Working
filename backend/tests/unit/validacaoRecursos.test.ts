import sequelize from "../../src/config/database";
import PetModelo from "../../src/models/PetModelo";
import UsuarioModelo from "../../src/models/UsuarioModelo";
import { Request, Response } from "express";
import { atualizarDadosPet } from "../../src/controllers/PetsController";
import { deletarUsuario } from "../../src/controllers/UsuariosController";

describe("Validação de Recursos Inexistentes", () => {
  beforeEach(async () => {
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await sequelize.sync({ force: true });
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    } catch (error) {
      console.error("Erro ao sincronizar banco:", error);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error("Erro ao fechar conexão:", error);
    }
  });

  it("deve retornar erro ao tentar editar pet inexistente", async () => {
    const mockReq = {
      params: { id: "999" },
      body: { nome: "Novo Nome" },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await atualizarDadosPet(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringMatching(/não (foi )?encontrado/i),
    });
  });

  it("deve retornar erro ao tentar deletar usuário inexistente", async () => {
    const mockReq = {
      params: { id: "999" },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    await deletarUsuario(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringMatching(/não (foi )?encontrado/i),
      })
    );
  });
});
