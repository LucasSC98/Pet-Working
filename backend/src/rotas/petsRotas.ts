import express from "express";
import { verificarToken } from "../middlewares/autenticacaoemiddleware";
import {
  buscarTodosPets,
  buscarPetPorId,
  criarNovoPet,
  atualizarDadosPet,
  deletarPet,
  buscarPetsPorUsuario,
  deletarPetPorUsuario,
} from "../controllers/PetsController";

const router = express.Router();

router.get("/pets", verificarToken, buscarTodosPets);
router.get("/pets/:id", verificarToken, buscarPetPorId);
router.get("/pets/usuario/:id", verificarToken, buscarPetsPorUsuario);
router.post("/pets", verificarToken, criarNovoPet);
router.patch("/pets/:id", verificarToken, atualizarDadosPet);
router.delete("/pets/:id", verificarToken, deletarPet);
router.delete(
  "/pets/:id/usuario/:userId",
  verificarToken,
  deletarPetPorUsuario
);

export default router;
