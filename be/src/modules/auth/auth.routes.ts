import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { registerSchema, loginSchema } from './auth.schema';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { authLimiter } from '../../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), register);
router.post('/login', authLimiter, validate({ body: loginSchema }), login);
router.get('/me', authenticate, getMe);

export default router;

