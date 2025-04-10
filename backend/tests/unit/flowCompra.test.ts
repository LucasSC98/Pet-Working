import sequelize from "../../src/config/database";
import UsuarioModelo from "../../src/models/UsuarioModelo";
import ProdutoModelo from "../../src/models/ProdutoModelo";
import EnderecoModelo from "../../src/models/EnderecoModelo";
import PedidoModelo from "../../src/models/PedidoModelo";
import ItemPedidoModelo from "../../src/models/ItemPedidoModelo";
import { gerarToken } from "../../src/utils/jwt";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

interface PedidoCompletoInterface extends PedidoModelo {
  itens?: ItemPedidoModelo[];
  usuario?: UsuarioModelo;
  endereco?: EnderecoModelo;
}
// vai criar um pedido completo com os itens, usuario e endereco
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
      // Limpeza inicial do banco de dados
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await Promise.all([
        UsuarioModelo.destroy({ where: {}, force: true }),
        ProdutoModelo.destroy({ where: {}, force: true }),
        EnderecoModelo.destroy({ where: {}, force: true }),
        PedidoModelo.destroy({ where: {}, force: true }),
        ItemPedidoModelo.destroy({ where: {}, force: true }),
      ]);
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

      // Criar produto de teste
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

  afterAll(async () => {
    try {
      // Limpeza após os testes para não ter dados ao finalizar
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await Promise.all([
        UsuarioModelo.destroy({ where: {}, force: true }),
        ProdutoModelo.destroy({ where: {}, force: true }),
        EnderecoModelo.destroy({ where: {}, force: true }),
        PedidoModelo.destroy({ where: {}, force: true }),
        ItemPedidoModelo.destroy({ where: {}, force: true }),
      ]);
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

      await sequelize.close();
    } catch (error) {
      console.error("Erro ao limpar após testes:", error);
    }
  });

  it("deve realizar o fluxo completo: criar conta, fazer login, adicionar endereço e realizar pedido", async () => {
    //criar usuario de teste
    const dadosUsuario = {
      nome: "Lucas Teste",
      email: `lucasteste@example.com`,
      cpf: "529.982.247-25",
      senha: "Senha123",
      dataNascimento: new Date("1990-01-01"),
      genero: "masculino",
    };

    usuarioTeste = await UsuarioModelo.create(dadosUsuario);
    expect(usuarioTeste).toBeDefined();
    expect(usuarioTeste.id_usuario).toBeDefined();

    console.log("Usuário de teste criado com ID:", usuarioTeste.id_usuario);

    // vai gerar o token para o usuario de teste
    token = gerarToken(usuarioTeste);
    expect(token).toBeDefined();

    // adiciona um endereço para o usuario de teste
    const dadosEndereco = {
      id_usuario: usuarioTeste.id_usuario,
      rua: "Rua do Teste",
      numero: "123",
      bairro: "Bairro Teste",
      cidade: "Cidade Teste",
      estado: "SP",
      cep: "12345-678",
      complemento: "Apto 42",
    };

    enderecoTeste = await EnderecoModelo.create(dadosEndereco);
    expect(enderecoTeste).toBeDefined();
    expect(enderecoTeste.id_endereco).toBeDefined();

    console.log("Endereço de teste criado com ID:", enderecoTeste.id_endereco);

    //vai criar o pedido de teste
    const pedido = await PedidoModelo.create({
      id_usuario: usuarioTeste.id_usuario,
      id_endereco: enderecoTeste.id_endereco,
      valor_total: produtoTeste.preco,
      status: "Aguardando Pagamento",
      data_pedido: new Date(),
      frete: 10.0,
      observacoes: "Observação do pedido de teste",
    });

    expect(pedido).toBeDefined();
    expect(pedido.id_pedido).toBeDefined();

    console.log("Pedido de teste criado com ID:", pedido.id_pedido);

    // adiciona o item do pedido
    const itemPedido = await ItemPedidoModelo.create({
      id_pedido: pedido.id_pedido,
      id_produto: produtoTeste.id_produto,
      quantidade: 1,
      preco_unitario: produtoTeste.preco,
      subtotal: produtoTeste.preco,
    });

    expect(itemPedido).toBeDefined();
    expect(itemPedido.id_item_pedido).toBeDefined();

    console.log("Item de pedido criado com ID:", itemPedido.id_item_pedido);

    // verifica se o item do pedido foi adicionado corretamente e se o estoque foi atualizado
    await produtoTeste.update({
      estoque: produtoTeste.estoque - 1,
    });

    // Verificar se o estoque foi atualizado
    const produtoAtualizado = await ProdutoModelo.findByPk(
      produtoTeste.id_produto
    );
    expect(produtoAtualizado).toBeDefined();
    expect(produtoAtualizado?.estoque).toBe(9);
    // Passo 7: Buscar o pedido completo para verificação
    const pedidoCompleto = await PedidoModelo.findByPk(pedido.id_pedido, {
      include: [
        {
          model: ItemPedidoModelo,
          as: "itens",
          include: [
            {
              model: ProdutoModelo,
              as: "produto",
            },
          ],
        },
        {
          model: EnderecoModelo,
          as: "endereco",
        },
        {
          model: UsuarioModelo,
          as: "usuario",
          attributes: ["nome", "email"],
        },
      ],
    });

    expect(pedidoCompleto).toBeDefined();
    expect(pedidoCompleto?.id_usuario).toBe(usuarioTeste.id_usuario);
    expect(pedidoCompleto?.id_endereco).toBe(enderecoTeste.id_endereco);
    expect(pedidoCompleto?.status).toBe("Aguardando Pagamento");

    // caso o pedido tenha sido criado corretamente, ele deve ter pelo menos um item
    const itens = await ItemPedidoModelo.findAll({
      where: { id_pedido: pedido.id_pedido },
    });

    expect(itens).toBeDefined();
    expect(itens.length).toBe(1);
    expect(itens[0].id_produto).toBe(produtoTeste.id_produto);
    expect(itens[0].quantidade).toBe(1);
    expect(parseFloat(itens[0].preco_unitario.toString())).toBe(
      parseFloat(produtoTeste.preco.toString())
    );

    console.log("Deu bom, teste de pedido completo com sucesso!");
  });
});
