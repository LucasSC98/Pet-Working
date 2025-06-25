import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';

declare global {
    namespace Express {
        interface Request {
            usuarioId?: number;
        }
    }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        req.usuarioId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};