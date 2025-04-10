import { Request, Response } from "express";
import PagamentoModelo from "../models/PagamentoModelo";
import PedidoModelo from "../models/PedidoModelo";
import sequelize from "../config/database";

export const registrarPagamento = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { id_pedido, metodo, valor, codigo_transacao } = req.body;
    const id_usuario = req.usuarioId; // Obtido do middleware de autenticação

    // Verificar se o pedido existe e pertence ao usuário
    const pedido = await PedidoModelo.findOne({
      where: {
        id_pedido,
        id_usuario,
      },
      transaction: t,
    });

    if (!pedido) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Pedido não encontrado ou não pertence ao usuário" });
    }

    // Verificar se o pedido já possui pagamento
    const pagamentoExistente = await PagamentoModelo.findOne({
      where: { id_pedido },
      transaction: t,
    });

    if (pagamentoExistente) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Este pedido já possui um pagamento registrado" });
    }

    // Validar método de pagamento
    const metodosValidos = [
      "Cartão de Crédito",
      "Cartão de Débito",
      "PIX",
      "Boleto",
      "Dinheiro",
    ];

    if (!metodosValidos.includes(metodo)) {
      await t.rollback();
      return res.status(400).json({ message: "Método de pagamento inválido" });
    }

    // Simular processamento de pagamento
    // Em um ambiente real, aqui você integraria com um gateway de pagamento
    const statusPagamento = "Aprovado"; // Simulando aprovação para simplificar

    // Registrar o pagamento
    const pagamento = await PagamentoModelo.create(
      {
        id_pedido,
        metodo,
        status: statusPagamento,
        valor,
        data_pagamento: new Date(),
        codigo_transacao,
      },
      { transaction: t }
    );

    // Atualizar status do pedido
    await pedido.update(
      {
        status: "Pagamento Confirmado",
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json(pagamento);
  } catch (error) {
    await t.rollback();
    console.error("Erro ao registrar pagamento:", error);
    res.status(500).json({ message: "Erro ao registrar pagamento" });
  }
};

export const atualizarStatusPagamento = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar status
    const statusValidos = [
      "Pendente",
      "Aprovado",
      "Recusado",
      "Estornado",
      "Em Análise",
    ];

    if (!statusValidos.includes(status)) {
      await t.rollback();
      return res.status(400).json({ message: "Status de pagamento inválido" });
    }

    const pagamento = await PagamentoModelo.findByPk(id, { transaction: t });

    if (!pagamento) {
      await t.rollback();
      return res.status(404).json({ message: "Pagamento não encontrado" });
    }

    // Atualizar status de pagamento
    await pagamento.update({ status }, { transaction: t });

    // Se o pagamento foi aprovado, atualize o status do pedido
    if (status === "Aprovado") {
      await PedidoModelo.update(
        { status: "Pagamento Confirmado" },
        {
          where: { id_pedido: pagamento.id_pedido },
          transaction: t,
        }
      );
    }

    // Se o pagamento foi recusado, atualize o status do pedido
    if (status === "Recusado" || status === "Estornado") {
      await PedidoModelo.update(
        { status: "Aguardando Pagamento" },
        {
          where: { id_pedido: pagamento.id_pedido },
          transaction: t,
        }
      );
    }

    await t.commit();

    res.status(200).json(pagamento);
  } catch (error) {
    await t.rollback();
    console.error("Erro ao atualizar status do pagamento:", error);
    res.status(500).json({ message: "Erro ao atualizar status do pagamento" });
  }
};

export const buscarPagamentoPorPedido = async (req: Request, res: Response) => {
  try {
    const { id_pedido } = req.params;
    const id_usuario = req.usuarioId;

    // Verificar se o pedido pertence ao usuário
    const pedido = await PedidoModelo.findOne({
      where: {
        id_pedido,
        id_usuario,
      },
    });

    if (!pedido) {
      return res
        .status(404)
        .json({ message: "Pedido não encontrado ou não pertence ao usuário" });
    }

    const pagamento = await PagamentoModelo.findOne({
      where: { id_pedido },
    });

    if (!pagamento) {
      return res
        .status(404)
        .json({ message: "Pagamento não encontrado para este pedido" });
    }

    res.status(200).json(pagamento);
  } catch (error) {
    console.error("Erro ao buscar pagamento:", error);
    res.status(500).json({ message: "Erro ao buscar pagamento" });
  }
};
