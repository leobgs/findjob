import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { env } from '../config/env';
import { sendError } from '../utils/response';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === 'test' ? 1000 : 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    sendError(
      res,
      'Terlalu banyak percobaan akses dari IP ini. Silakan coba lagi setelah 15 menit.',
      429,
      [],
      req.id
    );
  },
});

