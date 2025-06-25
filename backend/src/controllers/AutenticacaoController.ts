import { Request, Response } from "express";
import UsuarioModelo from "../models/UsuarioModelo";
import { gerarToken as gerarJwt } from "../utils/jwt";

const buscarUsuarioPorEmail = async (
  email: string
): Promise<UsuarioModelo | null> => {
  return await UsuarioModelo.findOne({ where: { email } });
};

const validarCredenciais = async (
  usuario: UsuarioModelo | null,
  senha: string
): Promise<boolean> => {
  if (!usuario) return false;
  return await usuario.verificarSenha(senha);
};

const formatarRespostaUsuario = (usuario: UsuarioModelo, token: string) => {
  return {
    token,
    usuario: {
      id: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      fotoDePerfil: usuario.fotoDePerfil,
    },
  };
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email é obrigatório" });
      return;
    }

    if (!senha) {
      res.status(400).json({ message: "Senha é obrigatória" });
      return;
    }

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario) {
      res.status(404).json({ message: "Email ou senha incorretos" });
      return;
    }

    const credenciaisValidas = await validarCredenciais(usuario, senha);

    if (!credenciaisValidas) {
      res.status(401).json({ message: "Email ou senha incorretos" });
      return;
    }

    const token = gerarJwt(usuario);
    const resposta = formatarRespostaUsuario(usuario, token);

    res.json(resposta);
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      message: "Erro interno do servidor. Tente novamente mais tarde.",
    });
  }
};
