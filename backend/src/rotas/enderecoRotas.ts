import express from "express";
import { verificarToken } from '../middlewares/autenticacaoemiddleware';
import { buscarEnderecoPorId,  criarEnderecoParaUsuario, atualizarEndereco, deletarEndereco, buscarEnderecosPorUsuario } from "../controllers/EnderecoController";

const router = express.Router();

router.get('/enderecos/:id', verificarToken, buscarEnderecoPorId);
router.get('/enderecos/usuario/:id', verificarToken, buscarEnderecosPorUsuario);
router.post('/enderecos', verificarToken, criarEnderecoParaUsuario);
router.patch('/enderecos/:id', verificarToken, atualizarEndereco);
router.delete('/enderecos/:id', verificarToken, deletarEndereco);

export default router;