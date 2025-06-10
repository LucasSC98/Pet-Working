import sequelize from "../../src/config/database";
import UsuarioModelo from "../../src/models/UsuarioModelo";
import ProdutoModelo from "../../src/models/ProdutoModelo";
import EnderecoModelo from "../../src/models/EnderecoModelo";
import PedidoModelo from "../../src/models/PedidoModelo";
import ItemPedidoModelo from "../../src/models/ItemPedidoModelo";
import { gerarToken } from "../../src/utils/jwt";
import { Model } from "sequelize";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";

interface ItemPedido extends Model {
  id_item_pedido: number;
  id_pedido: number;
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
  produto?: ProdutoModelo;
}

interface PedidoCompleto extends Model {
  id_pedido: number;
  id_usuario: number;
  id_endereco: number;
  valor_total: number;
  status: string;
  data_pedido: Date;
  frete: number;
  observacoes?: string;
  itens?: ItemPedido[];
  usuario?: UsuarioModelo;
  endereco?: EnderecoModelo;
}

PedidoModelo.hasMany(ItemPedidoModelo, {
  foreignKey: "id_pedido",
  as: "itens",
});

ItemPedidoModelo.belongsTo(PedidoModelo, {
  foreignKey: "id_pedido",
  as: "pedido",
});

ItemPedidoModelo.belongsTo(ProdutoModelo, {
  foreignKey: "id_produto",
  as: "produto",
});

PedidoModelo.belongsTo(UsuarioModelo, {
  foreignKey: "id_usuario",
  as: "usuario",
});

PedidoModelo.belongsTo(EnderecoModelo, {
  foreignKey: "id_endereco",
  as: "endereco",
});

describe("Teste completo do fluxo de compra", () => {
  let usuarioTeste: UsuarioModelo;
  let produtoTeste: ProdutoModelo;
  let enderecoTeste: EnderecoModelo;
  let token: string;

  beforeAll(async () => {
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await sequelize.sync({ force: true });
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

      produtoTeste = await ProdutoModelo.create({
        nome: "Produto Teste",
        descricao: "Descrição do produto de teste",
        preco: 29.9,
        categoria: "Alimentação",
        foto: "https://placehold.co/400x300?text=ProdutoTeste",
        estoque: 10,
        destaque: false,
      });

      console.log("Produto de teste criado com ID:", produtoTeste.id_produto);
    } catch (error) {
      console.error("Erro na configuração do teste:", error);
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      await sequelize.transaction(async (t) => {
        // Criar usuário de teste
        usuarioTeste = await UsuarioModelo.create(
          {
            nome: "Lucas Teste",
            email: "lucasteste@example.com",
            cpf: "529.982.247-25",
            senha: "Senha123",
            dataNascimento: new Date("1990-01-01"),
            genero: "masculino",
          },
          { transaction: t }
        );

        // Criar endereço de teste
        enderecoTeste = await EnderecoModelo.create(
          {
            id_usuario: usuarioTeste.id_usuario,
            rua: "Rua do Teste",
            numero: "123",
            bairro: "Bairro Teste",
            cidade: "Cidade Teste",
            estado: "SP",
            cep: "12345-678",
            complemento: "Apto 42",
          },
          { transaction: t }
        );

        token = gerarToken(usuarioTeste);
      });
    } catch (error) {
      console.error("Erro ao preparar teste:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

      // Deletar na ordem correta
      await ItemPedidoModelo.destroy({ where: {}, force: true });
      await PedidoModelo.destroy({ where: {}, force: true });
      await EnderecoModelo.destroy({ where: {}, force: true });
      await UsuarioModelo.destroy({ where: {}, force: true });
      await ProdutoModelo.destroy({ where: {}, force: true });

      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      await sequelize.close();
    } catch (error) {
      console.error("Erro ao limpar após testes:", error);
    }
  });

  it("deve realizar o fluxo completo: criar conta, fazer login, adicionar endereço e realizar pedido", async () => {
    // Criar pedido usando transação
    const pedido = await sequelize.transaction(async (t) => {
      const novoPedido = await PedidoModelo.create(
        {
          id_usuario: usuarioTeste.id_usuario,
          id_endereco: enderecoTeste.id_endereco,
          valor_total: produtoTeste.preco,
          status: "Aguardando Pagamento",
          data_pedido: new Date(),
          frete: 10.0,
          observacoes: "Observação do pedido de teste",
        },
        { transaction: t }
      );

      // Criar item do pedido
      await ItemPedidoModelo.create(
        {
          id_pedido: novoPedido.id_pedido,
          id_produto: produtoTeste.id_produto,
          quantidade: 1,
          preco_unitario: produtoTeste.preco,
          subtotal: produtoTeste.preco,
        },
        { transaction: t }
      );

      return novoPedido;
    });

    // Verificações
    expect(pedido).toBeDefined();
    expect(pedido.id_pedido).toBeDefined();

    // Atualizar o tipo do pedidoCompleto
    const pedidoCompleto = await PedidoModelo.findByPk<PedidoCompleto>(
      pedido.id_pedido,
      {
        include: [
          {
            model: ItemPedidoModelo,
            as: "itens",
            include: [{ model: ProdutoModelo, as: "produto" }],
          },
          { model: EnderecoModelo, as: "endereco" },
          {
            model: UsuarioModelo,
            as: "usuario",
            attributes: ["nome", "email"],
          },
        ],
      }
    );

    expect(pedidoCompleto).toBeDefined();
    expect(pedidoCompleto?.id_usuario).toBe(usuarioTeste.id_usuario);
    expect(pedidoCompleto?.id_endereco).toBe(enderecoTeste.id_endereco);
    expect(pedidoCompleto?.itens).toHaveLength(1);
  });
});
