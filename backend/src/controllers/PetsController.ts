import { Request, Response } from 'express';
import PetModelo from '../models/PetModelo';


export const buscarTodosPets = async (req: Request, res: Response) => {
    const pets = await PetModelo.findAll();
    res.send(pets);
}  

export const buscarPetPorId = async (req: Request, res: Response) => {
    const pet = await PetModelo.findByPk(req.params.id);
    res.send(pet);
}

export const criarNovoPet = async (req: Request, res: Response) => {
    const pet = await PetModelo.create(req.body);
    res.send(pet);
}

export const atualizarDadosPet = async (req: Request, res: Response) => {
        await PetModelo.update(req.body, {
            where: { id_pet: req.params.id }
        });
        res.sendStatus(200);
    }

export const deletarPet = async (req: Request, res: Response) => {
    await PetModelo.destroy({
        where: { id_pet: req.params.id }
    });
    res.sendStatus(200);
}
