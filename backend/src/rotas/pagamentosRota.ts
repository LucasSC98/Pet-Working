import express from "express";
import { verificarToken } from "../middlewares/autenticacaoemiddleware";
import {
  registrarPagamento,
  atualizarStatusPagamento,
  buscarPagamentoPorPedido,
} from "../controllers/PagamentosController";

const router = express.Router();

// Todas as rotas de pagamentos requerem autenticação
router.post("/pagamentos", verificarToken, registrarPagamento);
router.patch(
  "/pagamentos/:id/status",
  verificarToken,
  atualizarStatusPagamento
);
router.get(
  "/pagamentos/pedido/:id_pedido",
  verificarToken,
  buscarPagamentoPorPedido
);

export default router;
