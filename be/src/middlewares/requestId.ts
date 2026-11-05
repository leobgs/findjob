import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  req.id = req.headers['x-request-id']?.toString() ?? randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};

