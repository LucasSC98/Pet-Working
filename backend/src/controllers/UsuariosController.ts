import { Request, Response } from "express";
import UsuarioModelo from "../models/UsuarioModelo";
import { formatarErros } from "../interfaces/Erros";
import { RequisicaoAutenticada } from "../interfaces/usuarioAuth";
import sequelize from "../config/database";
import EnderecoModelo from "../models/EnderecoModelo";
import PetModelo from "../models/PetModelo";
import PedidoModelo from "../models/PedidoModelo";
import AgendamentoModelo from "../models/AgendamentoModelo";

interface AuthRequest extends Request {
  usuarioId?: number;
}

export const buscarTodosUsuarios = async (req: Request, res: Response) => {
  const users = await UsuarioModelo.findAll();
  res.send(users);
};

export const buscarUsuarioPorId = async (req: Request, res: Response) => {
  const usuario = await UsuarioModelo.findByPk(req.params.id);
  if (usuario) {
    return res.json(usuario);
  } else {
    res.status(404).send({ message: `O Usuario não foi encontrado` });
  }
};

export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const dadosUsuario = {
      nome: req.body.nome,
      email: req.body.email,
      cpf: req.body.cpf,
      senha: req.body.senha,
      dataNascimento: req.body.dataNascimento,
      fotoDePerfil: req.body.fotoDePerfil,
      genero: req.body.genero,
    };
    if (!dadosUsuario.nome || dadosUsuario.nome.length < 3) {
      return res.status(400).json({
        message: "O nome deve ter pelo menos 3 caracteres",
      });
    }
    const emailExistente = await UsuarioModelo.findOne({
      where: { email: dadosUsuario.email },
    });
    if (emailExistente) {
      return res.status(400).json({
        message: "Este email já está cadastrado",
      });
    }
    const cpfExistente = await UsuarioModelo.findOne({
      where: { cpf: dadosUsuario.cpf },
    });
    if (cpfExistente) {
      return res.status(400).json({
        message: "Este CPF já está cadastrado",
      });
    }

    if (!dadosUsuario.senha || dadosUsuario.senha.length < 8) {
      return res.status(400).json({
        message: "A senha deve ter pelo menos 8 caracteres",
      });
    }

    const usuario = await UsuarioModelo.create(dadosUsuario);
    res.status(201).json({
      message: "Usuário criado com sucesso",
      usuario,
    });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    res.status(400).json({
      message: error.message || "Erro ao criar usuário",
    });
  }
};

export const atualizarUsuario = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = { ...req.body };

    const usuario = await UsuarioModelo.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    if (req.usuarioId !== parseInt(id)) {
      return res.status(403).json({
        message: "Você não tem permissão para editar este usuário",
      });
    }
    delete dadosAtualizacao.email;
    if (!dadosAtualizacao.fotoDePerfil) {
      dadosAtualizacao.fotoDePerfil = usuario.fotoDePerfil;
    }

    try {
      await usuario.update(dadosAtualizacao);

      return res.status(200).json({
        message: "Usuário atualizado com sucesso",
        usuario: {
          id: usuario.id_usuario,
          nome: usuario.nome,
          cpf: usuario.cpf,
          dataNascimento: usuario.dataNascimento,
          fotoDePerfil: usuario.fotoDePerfil,
          genero: usuario.genero,
        },
      });
    } catch (erro: any) {
      return res.status(400).json({
        message: erro.message,
      });
    }
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return res.status(400).json({
      message: "Erro ao atualizar o usuário",
      error: true,
    });
  }
};

export const deletarUsuario = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const usuarioId = req.usuarioId;
    const usuario = await UsuarioModelo.findByPk(id);
    if (!usuario) {
      await t.rollback();
      return res.status(404).send({
        message: "Usuário não encontrado",
      });
    }
    if (Number(id) !== Number(usuarioId)) {
      await t.rollback();
      return res.status(403).send({
        message: "Você só pode deletar sua própria conta",
      });
    }

    try {
      await AgendamentoModelo.destroy({
        where: { id_usuario: id },
        transaction: t,
      });
      await PedidoModelo.destroy({
        where: { id_usuario: id },
        transaction: t,
      });
      await PetModelo.destroy({
        where: { id_usuario: id },
        transaction: t,
      });
      await EnderecoModelo.destroy({
        where: { id_usuario: id },
        transaction: t,
      });

      await usuario.destroy({ transaction: t });
      await t.commit();

      return res.status(200).send({
        message:
          "Usuário e todos os dados relacionados foram deletados com sucesso",
      });
    } catch (error) {
      await t.rollback();
      if (formatarErros(error)) {
        return res.status(400).send({
          message: "Erro ao deletar usuário",
          errors: error.errors.map((err) => err.message),
        });
      }
      throw error;
    }
  } catch (error) {
    await t.rollback();
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).send({
      message: "Erro interno ao deletar usuário",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
