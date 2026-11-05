import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(AppError.notFound(`Rute ${req.method} ${req.originalUrl} tidak ditemukan`));
};

