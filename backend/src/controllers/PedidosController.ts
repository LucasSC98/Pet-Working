import { Request, Response } from "express";
import { Transaction } from "sequelize";
import sequelize from "../config/database";
import PedidoModelo from "../models/PedidoModelo";
import ItemPedidoModelo from "../models/ItemPedidoModelo";
import ProdutoModelo from "../models/ProdutoModelo";
import EnderecoModelo from "../models/EnderecoModelo";
import UsuarioModelo from "../models/UsuarioModelo";

// Interface para o carrinho de compras
interface CarrinhoItem {
  id_produto: number;
  quantidade: number;
}

export const criarPedido = async (req: Request, res: Response) => {
  const t: Transaction = await sequelize.transaction();

  try {
    const { id_endereco, itens, observacoes } = req.body;
    const id_usuario = req.usuarioId; // Obtido do middleware de autenticação

    // Validar endereço
    const endereco = await EnderecoModelo.findOne({
      where: {
        id_endereco,
        id_usuario,
      },
      transaction: t,
    });

    if (!endereco) {
      await t.rollback();
      return res.status(404).json({
        message: "Endereço não encontrado ou não pertence ao usuário",
      });
    }

    // Verificar se o array de itens está vazio
    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Nenhum item no pedido" });
    }

    // Calcular valor total e verificar estoque
    let valorTotal = 0;
    const itensPedido = [];

    for (const item of itens) {
      const produto = await ProdutoModelo.findByPk(item.id_produto, {
        transaction: t,
      });

      if (!produto) {
        await t.rollback();
        return res.status(404).json({
          message: `Produto com ID ${item.id_produto} não encontrado`,
        });
      }

      if (produto.estoque < item.quantidade) {
        await t.rollback();
        return res.status(400).json({
          message: `Estoque insuficiente para o produto ${produto.nome}`,
        });
      }

      const subtotal = parseFloat(produto.preco.toString()) * item.quantidade;
      valorTotal += subtotal;

      itensPedido.push({
        id_produto: produto.id_produto,
        quantidade: item.quantidade,
        preco_unitario: produto.preco,
        subtotal,
      });

      // Atualizar estoque
      await produto.update(
        {
          estoque: produto.estoque - item.quantidade,
        },
        { transaction: t }
      );
    }

    // Criar o pedido
    const pedido = await PedidoModelo.create(
      {
        id_usuario,
        id_endereco,
        valor_total: valorTotal,
        observacoes: observacoes || "",
        status: "Aguardando Pagamento",
        data_pedido: new Date(),
      },
      { transaction: t }
    );

    // Criar os itens do pedido
    for (const item of itensPedido) {
      await ItemPedidoModelo.create(
        {
          id_pedido: pedido.id_pedido,
          id_produto: item.id_produto,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
          subtotal: item.subtotal,
        },
        { transaction: t }
      );
    }

    await t.commit();

    // Retornar o pedido criado com seus itens
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
      ],
    });

    res.status(201).json(pedidoCompleto);
  } catch (error) {
    await t.rollback();
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
};

export const buscarPedidosDoUsuario = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "ID do usuário não fornecido" });
    }

    const pedidos = await PedidoModelo.findAll({
      where: { id_usuario: userId },
      include: [
        {
          model: ItemPedidoModelo,
          as: "itens",
          include: [
            {
              model: ProdutoModelo,
              as: "produto",
              attributes: ["id_produto", "nome", "preco", "foto"],
            },
          ],
        },
        {
          model: EnderecoModelo,
          as: "endereco",
          attributes: [
            "id_endereco",
            "rua",
            "numero",
            "bairro",
            "cidade",
            "estado",
            "cep",
          ],
        },
      ],
      order: [["data_pedido", "DESC"]],
    });

    res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
};

export const buscarPedidoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuarioId; // Obtido do middleware de autenticação

    const pedido = await PedidoModelo.findOne({
      where: {
        id_pedido: id,
        id_usuario, // Garante que o usuário só veja seus próprios pedidos
      },
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

    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({ message: "Erro ao buscar pedido" });
  }
};

export const atualizarStatusPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Verificar se o status é válido
    const statusValidos = [
      "Aguardando Pagamento",
      "Pagamento Confirmado",
      "Em Preparação",
      "Enviado",
      "Entregue",
      "Cancelado",
    ];

    if (!statusValidos.includes(status)) {
      return res.status(400).json({ message: "Status inválido" });
    }

    const pedido = await PedidoModelo.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    // Se estiver cancelando um pedido, devolver os itens ao estoque
    if (status === "Cancelado" && pedido.status !== "Cancelado") {
      const itens = await ItemPedidoModelo.findAll({
        where: { id_pedido: pedido.id_pedido },
      });

      const t: Transaction = await sequelize.transaction();

      try {
        for (const item of itens) {
          const produto = await ProdutoModelo.findByPk(item.id_produto, {
            transaction: t,
          });
          if (produto) {
            await produto.update(
              {
                estoque: produto.estoque + item.quantidade,
              },
              { transaction: t }
            );
          }
        }

        await t.commit();
      } catch (error) {
        await t.rollback();
        throw error;
      }
    }

    await pedido.update({ status });

    res.status(200).json(pedido);
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    res.status(500).json({ message: "Erro ao atualizar status do pedido" });
  }
};

export const deletarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuarioId; // Obtido do middleware de autenticação

    const pedido = await PedidoModelo.findOne({
      where: {
        id_pedido: id,
        id_usuario,
      },
    });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    await pedido.destroy();

    res.status(200).json({ message: "Pedido deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    res.status(500).json({ message: "Erro ao deletar pedido" });
  }
};
