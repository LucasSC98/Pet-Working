import { Request, Response } from 'express';
import EnderecoModelo from '../models/EnderecoModelo';

export const buscarEnderecoPorId = async (req: Request, res: Response) => {
    const endereco = await EnderecoModelo.findByPk(req.params.id);
    res.send(endereco);
}

export const criarEnderecoParaUsuario = async (req: Request, res: Response) => {
    const endereco = await EnderecoModelo.create(req.body);
    res.send(endereco);
}

export const atualizarEndereco = async (req: Request, res: Response) => {
    await EnderecoModelo.update(req.body, {
        where: { id_endereco: req.params.id }
    });
    res.sendStatus(200);
}

export const deletarEndereco = async (req: Request, res: Response) => {
    await EnderecoModelo.destroy({
        where: { id_endereco: req.params.id }
    });
    res.sendStatus(200);
}

export const buscarEnderecosPorUsuario = async (req: Request, res: Response) => {
    try {
        const enderecos = await EnderecoModelo.findAll({
            where: {
                id_usuario: req.params.id
            }
        });
        res.json(enderecos);
    } catch (error) {
        console.error("Erro ao buscar endereços do usuário:", error);
        res.status(500).json({ 
            message: "Erro ao buscar endereços do usuário" 
        });
    }
}