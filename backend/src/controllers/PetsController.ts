import { Request, Response } from "express";
import PetModelo from "../models/PetModelo";

export const buscarTodosPets = async (req: Request, res: Response) => {
  const pets = await PetModelo.findAll();
  res.send(pets);
};

export const buscarPetPorId = async (req: Request, res: Response) => {
  const pet = await PetModelo.findByPk(req.params.id);
  res.send(pet);
};

export const criarNovoPet = async (req: Request, res: Response) => {
  const pet = await PetModelo.create(req.body);
  res.send(pet);
};

export const atualizarDadosPet = async (req: Request, res: Response) => {
  try {
    const pet = await PetModelo.findByPk(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: "Pet não encontrado",
      });
    }

    await pet.update(req.body);
    return res.json(pet);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar pet",
    });
  }
};

export const deletarPet = async (req: Request, res: Response) => {
  await PetModelo.destroy({
    where: { id_pet: req.params.id },
  });
  res.sendStatus(200);
};

export const buscarPetsPorUsuario = async (req: Request, res: Response) => {
  try {
    const pets = await PetModelo.findAll({
      where: {
        id_usuario: req.params.id,
      },
    });
    res.json(pets);
  } catch (error) {
    console.error("Erro ao buscar pets do usuário:", error);
    res.status(500).json({
      message: "Erro ao buscar pets do usuário",
    });
  }
};

export const deletarPetPorUsuario = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    // Verifica se o pet pertence ao usuário
    const pet = await PetModelo.findOne({
      where: {
        id_pet: id,
        id_usuario: userId,
      },
    });

    if (!pet) {
      return res.status(404).json({
        message: "Pet não encontrado ou não pertence a este usuário",
      });
    }

    // Deleta o pet
    await PetModelo.destroy({
      where: {
        id_pet: id,
        id_usuario: userId,
      },
    });

    res.status(200).json({ message: "Pet deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar pet:", error);
    res.status(500).json({ message: "Erro ao deletar pet" });
  }
};
