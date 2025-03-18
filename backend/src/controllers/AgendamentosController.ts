import { Request, Response } from 'express';
import AgendamentoModelo from '../models/AgendamentoModelo';

export const buscarTodosAgendamentos = async (req: Request, res: Response) => {
    const agendamentos = await AgendamentoModelo.findAll();
    res.send(agendamentos);
}

export const buscarAgendamentoPorId = async (req: Request, res: Response) => {
    const agendamento = await AgendamentoModelo.findByPk(req.params.id);
    res.send(agendamento);
}

export const criarNovoAgendamento = async (req: Request, res: Response) => {
    const agendamento = await AgendamentoModelo.create(req.body);
    res.send(agendamento);
}

export const atualizarDadosAgendamento = async (req: Request, res: Response) => {
    await AgendamentoModelo.update(req.body, {
        where: { id_agendamento: req.params.id }
    });
    res.sendStatus(200);
}

export const deletarAgendamento = async (req: Request, res: Response) => {
    await AgendamentoModelo.destroy({
        where: { id_agendamento: req.params.id }
    });
    res.sendStatus(200);
}