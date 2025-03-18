import { Request } from 'express';

export interface RequisicaoAutenticada extends Request {
    usuarioId: number | undefined;
}