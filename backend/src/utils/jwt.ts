import jwt from "jsonwebtoken";
import UsuarioModelo from "../models/UsuarioModelo";

const JWT_SECRET = process.env.JWT_SECRET || "uma_senha_boa_e_segura";
const JWT_EXPIRATION = "7d";

export const gerarToken = (usuario: UsuarioModelo): string => {
  return jwt.sign(
    { id: usuario.id_usuario, email: usuario.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
};

export const verificarToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
