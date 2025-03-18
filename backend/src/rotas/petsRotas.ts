import express from 'express';
import { verificarToken } from '../middlewares/autenticacaoemiddleware';
import { buscarTodosPets, buscarPetPorId, criarNovoPet, atualizarDadosPet, deletarPet } from '../controllers/PetsController';

const router = express.Router();

router.get('/pets',verificarToken, buscarTodosPets);
router.get('/pets/:id',verificarToken, buscarPetPorId);
router.post('/pets', verificarToken, criarNovoPet);
router.patch('/pets/:id', verificarToken, atualizarDadosPet);
router.delete('/pets/:id', verificarToken, deletarPet);


export default router;