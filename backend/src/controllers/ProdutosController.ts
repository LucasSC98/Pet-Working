import { Request, Response } from "express";
import ProdutoModelo from "../models/ProdutoModelo";
import { Op } from "sequelize";

export const listarProdutos = async (req: Request, res: Response) => {
  try {
    const pagina = Number(req.query.pagina) || 1;
    const itensPorPagina = Number(req.query.itensPorPagina) || 8;
    const categoria = req.query.categoria as string;
    const busca = req.query.busca as string;
    const offset = (pagina - 1) * itensPorPagina;
    let where: any = {};

    if (categoria && categoria !== "todos") {
      where.categoria = categoria;
    }

    if (busca) {
      where = {
        ...where,
        [Op.or]: [
          { nome: { [Op.like]: `%${busca}%` } },
          { descricao: { [Op.like]: `%${busca}%` } },
        ],
      };
    }
    const { count, rows: produtos } = await ProdutoModelo.findAndCountAll({
      where,
      limit: itensPorPagina,
      offset,
      order: [
        ["destaque", "DESC"],
        ["nome", "ASC"],
      ],
    });
    res.json({
      produtos,
      paginacao: {
        total: count,
        paginas: Math.ceil(count / itensPorPagina),
        atual: pagina,
        itensPorPagina,
      },
    });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ mensagem: "Erro ao buscar produtos" });
  }
};

export const buscarTodosProdutos = async (req: Request, res: Response) => {
  try {
    const produtos = await ProdutoModelo.findAll();
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
};

export const buscarProdutoPorId = async (req: Request, res: Response) => {
  try {
    const produto = await ProdutoModelo.findByPk(req.params.id);

    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.status(200).json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ message: "Erro ao buscar produto" });
  }
};

export const criarNovoProduto = async (req: Request, res: Response) => {
  try {
    const produto = await ProdutoModelo.create(req.body);
    res.status(201).json(produto);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ message: "Erro ao criar produto" });
  }
};

export const atualizarProduto = async (req: Request, res: Response) => {
  try {
    const produto = await ProdutoModelo.findByPk(req.params.id);

    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    await produto.update(req.body);
    res.status(200).json(produto);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ message: "Erro ao atualizar produto" });
  }
};

export const deletarProduto = async (req: Request, res: Response) => {
  try {
    const produto = await ProdutoModelo.findByPk(req.params.id);

    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    await produto.destroy();
    res.status(200).json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ message: "Erro ao deletar produto" });
  }
};

export const buscarProdutosPorCategoria = async (
  req: Request,
  res: Response
) => {
  try {
    const produtos = await ProdutoModelo.findAll({
      where: {
        categoria: req.params.categoria,
      },
    });
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error);
    res.status(500).json({ message: "Erro ao buscar produtos por categoria" });
  }
};

export const buscarProdutosDestaque = async (req: Request, res: Response) => {
  try {
    const produtos = await ProdutoModelo.findAll({
      where: {
        destaque: true,
      },
    });

    if (produtos.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    res.status(500).json({ message: "Erro ao buscar produtos em destaque" });
  }
};
