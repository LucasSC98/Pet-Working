import { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

export const JWT_SECRET: Secret =
  process.env.JWT_SECRET || "uma_senha_boa_e_segura";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";
