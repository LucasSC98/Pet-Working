import express from "express";
import { verificarToken } from "../middlewares/autenticacaoemiddleware";
import {
  buscarTodosUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/UsuariosController";

const router = express.Router();

router.post("/usuarios", criarUsuario);

router.get("/usuarios", verificarToken, buscarTodosUsuarios);
router.get("/usuarios/:id", verificarToken, buscarUsuarioPorId);
router.patch("/usuarios/:id", verificarToken, atualizarUsuario);
router.delete("/usuarios/:id", verificarToken, deletarUsuario);

export default router;
