import express from "express";
import { verificarToken } from '../middlewares/autenticacaoemiddleware';
import { buscarTodosAgendamentos, buscarAgendamentoPorId, criarNovoAgendamento, atualizarDadosAgendamento, deletarAgendamento, buscarAgendamentosPorUsuario } from "../controllers/AgendamentosController";

const router = express.Router();

router.get('/agendamentos', verificarToken, buscarTodosAgendamentos);
router.get('/agendamentos/:id', verificarToken, buscarAgendamentoPorId);
router.get('/agendamentos/usuario/:id', verificarToken, buscarAgendamentosPorUsuario);
router.post('/agendamentos', verificarToken, criarNovoAgendamento);
router.patch('/agendamentos/:id', verificarToken, atualizarDadosAgendamento);
router.delete('/agendamentos/:id', verificarToken, deletarAgendamento);

export default router;
