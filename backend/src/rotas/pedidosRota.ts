import express from "express";
import { verificarToken } from "../middlewares/autenticacaoemiddleware";
import {
  criarPedido,
  buscarPedidosDoUsuario,
  buscarPedidoPorId,
  atualizarStatusPedido,
  deletarPedido,
} from "../controllers/PedidosController";

const router = express.Router();

// Todas as rotas de pedidos requerem autenticação
router.post("/pedidos", verificarToken, criarPedido);
router.get("/pedidos/usuario/:id", verificarToken, buscarPedidosDoUsuario); // Corrigido para incluir :id
router.get("/pedidos/:id", verificarToken, buscarPedidoPorId);
router.patch("/pedidos/:id/status", verificarToken, atualizarStatusPedido);
router.delete("/pedidos/:id", verificarToken, deletarPedido);

export default router;
