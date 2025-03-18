import { Request, Response } from 'express';
import ServicoModelo from '../models/ServicoModelo';

export const buscarTodosServicos = async (req: Request, res: Response) => {
    const servicos = await ServicoModelo.findAll();
    res.send(servicos);
}

export const buscarServicoPorId = async (req: Request, res: Response) => {
    const servico = await ServicoModelo.findByPk(req.params.id);
    res.send(servico);
}
