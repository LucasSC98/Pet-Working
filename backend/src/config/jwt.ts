import { Secret } from 'jsonwebtoken';

export const JWT_SECRET: Secret = process.env.JWT_SECRET || 'uma_senha_boa_e_segura';
export const JWT_EXPIRATION = '24h';