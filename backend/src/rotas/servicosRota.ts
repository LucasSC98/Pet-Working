import express from 'express';
import { buscarTodosServicos, buscarServicoPorId } from '../controllers/ServicosController';

const router = express.Router();

router.get('/servicos/', buscarTodosServicos);
router.get('/servicos/:id', buscarServicoPorId);


export default router;