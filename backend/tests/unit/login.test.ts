import sequelize from "../../src/config/database";
import { UsuarioModelo } from "../../src/models/Relacionamento";
import bcrypt from "bcrypt";
import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";

describe("Login de Usuário", () => {
  const senhaTest = "Senha123";
  let senhaHash: string;

  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
      senhaHash = await bcrypt.hash(senhaTest, 10);

      const usuario = await UsuarioModelo.create({
        nome: "Usuário Teste",
        email: "teste@email.com",
        senha: senhaHash,
        cpf: "529.982.247-25",
        dataNascimento: new Date("1990-01-01"),
        genero: "MASCULINO",
      });
    } catch (error) {
      console.error("Erro na configuração:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await sequelize.sync({ force: true });
      await sequelize.close();
    } catch (error) {
      console.error("Erro ao limpar:", error);
    }
  });

  it("deve fazer login com credenciais corretas", async () => {
    const usuario = await UsuarioModelo.findOne({
      where: { email: "teste@email.com" },
    });

    expect(usuario).toBeDefined();

    const senhaCorreta = await bcrypt.compare(senhaTest, usuario!.senha);
    expect(senhaCorreta).toBe(true);
  });

  it("deve falhar com email incorreto", async () => {
    const usuario = await UsuarioModelo.findOne({
      where: { email: "errado@email.com" },
    });

    expect(usuario).toBeNull();
  });

  it("deve falhar com senha incorreta", async () => {
    const usuario = await UsuarioModelo.findOne({
      where: { email: "teste@email.com" },
    });

    expect(usuario).toBeDefined();
    const senhaIncorreta = await bcrypt.compare("senha_errada", usuario!.senha);
    expect(senhaIncorreta).toBe(false);
  });

  it("deve validar formato do email", async () => {
    const emailInvalido = "emailinvalido";
    const usuario = await UsuarioModelo.findOne({
      where: { email: emailInvalido },
    });

    expect(usuario).toBeNull();
  });

  it("deve permitir login apenas para usuários cadastrados", async () => {
    // Tenta usuário cadastrado
    const usuarioCadastrado = await UsuarioModelo.findOne({
      where: { email: "teste@email.com" },
    });
    expect(usuarioCadastrado).toBeDefined();
    const senhaCorretaCadastrado = await bcrypt.compare(
      senhaTest,
      usuarioCadastrado!.senha
    );
    expect(senhaCorretaCadastrado).toBe(true);

    // Tenta usuário não cadastrado
    const usuarioNaoCadastrado = await UsuarioModelo.findOne({
      where: { email: "naocadastrado@email.com" },
    });
    expect(usuarioNaoCadastrado).toBeNull();

    // Verifica total de usuários (deve ser apenas 1)
    const totalUsuarios = await UsuarioModelo.count();
    expect(totalUsuarios).toBe(1);
  });
});
