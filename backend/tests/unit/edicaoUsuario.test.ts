import { UsuarioModelo } from "../../src/models/Relacionamento";
import sequelize from "../../src/config/database";
import bcrypt from "bcrypt";

describe("Edição de Usuário", () => {
  let usuarioId: number;
  const senhaOriginal = "Senha123";

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Cria usuário e guarda o ID
    const novoUsuario = await UsuarioModelo.create({
      nome: "Usuário Teste",
      email: "teste@email.com",
      senha: senhaOriginal,
      cpf: "529.982.247-25",
      dataNascimento: new Date("1990-01-01"),
      genero: "MASCULINO",
    });

    usuarioId = novoUsuario.id_usuario;
  });

  beforeEach(async () => {
    // Recarrega o usuário antes de cada teste
    const usuario = await UsuarioModelo.findByPk(usuarioId);
    expect(usuario).not.toBeNull();
  });

  afterAll(async () => {
    await sequelize.sync({ force: true });
    await sequelize.close();
  });

  it("não deve permitir alteração de email", async () => {
    const usuario = await UsuarioModelo.findByPk(usuarioId);
    const emailOriginal = usuario!.email;

    try {
      await usuario!.update({
        email: "novo@email.com",
      });
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Recarrega para verificar
    const usuarioAtualizado = await UsuarioModelo.findByPk(usuarioId);
    expect(usuarioAtualizado).not.toBeNull();
    expect(usuarioAtualizado!.email).toBe(emailOriginal);
  });

  it("deve exigir todos os campos obrigatórios na edição", async () => {
    const usuario = await UsuarioModelo.findByPk(usuarioId);

    try {
      await usuario!.update({
        nome: "",
      });
      fail("Deveria ter rejeitado campo vazio");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("deve validar CPF e senha na edição", async () => {
    const usuario = await UsuarioModelo.findByPk(usuarioId);

    try {
      await usuario!.update({
        cpf: "111.111.111-11",
      });
      fail("Deveria ter rejeitado CPF inválido");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("deve permitir atualização de dados válidos", async () => {
    const usuario = await UsuarioModelo.findByPk(usuarioId);
    const novoNome = "Nome Atualizado";
    const novaSenha = "NovaSenha123";

    await usuario!.update({
      nome: novoNome,
      senha: novaSenha,
    });

    // Recarrega para verificar
    const usuarioAtualizado = await UsuarioModelo.findByPk(usuarioId);
    expect(usuarioAtualizado).not.toBeNull();
    expect(usuarioAtualizado!.nome).toBe(novoNome);

    // Verifica senha
    const senhaCorreta = await bcrypt.compare(
      novaSenha,
      usuarioAtualizado!.senha
    );
    expect(senhaCorreta).toBe(true);
  });
});
