import express from "express";
import {
  listarProdutos,
  buscarProdutoPorId,
  buscarProdutosPorCategoria,
  buscarProdutosDestaque,
  criarNovoProduto,
  atualizarProduto,
  deletarProduto,
} from "../controllers/ProdutosController";
import { verificarToken } from "../middlewares/autenticacaoemiddleware";

const router = express.Router();

// Rota paginada para listar produtos
router.get("/produtos", listarProdutos);
router.get("/produtos/:id", buscarProdutoPorId);
router.get("/produtos/categoria/:categoria", buscarProdutosPorCategoria);
router.get("/produtos/destaque", buscarProdutosDestaque);

// Rotas protegidas (requerem autenticação)
router.post("/produtos", verificarToken, criarNovoProduto);
router.patch("/produtos/:id", verificarToken, atualizarProduto);
router.delete("/produtos/:id", verificarToken, deletarProduto);

export default router;
