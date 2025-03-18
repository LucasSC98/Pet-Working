import { Request, Response, Router } from 'express';
import { login } from '../controllers/AutenticacaoController';

const router = Router();

router.post('/auth/login', login);

export default router;