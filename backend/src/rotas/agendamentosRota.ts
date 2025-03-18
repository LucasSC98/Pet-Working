import express from "express";
import { buscarTodosAgendamentos, buscarAgendamentoPorId, criarNovoAgendamento, atualizarDadosAgendamento, deletarAgendamento } from "../controllers/AgendamentosController";

const router = express.Router();

router.get('/agendamentos', buscarTodosAgendamentos);
router.get('/agendamentos/:id', buscarAgendamentoPorId);
router.post('/agendamentos', criarNovoAgendamento);
router.patch('/agendamentos/:id', atualizarDadosAgendamento);
router.delete('/agendamentos/:id', deletarAgendamento);

export default router;
