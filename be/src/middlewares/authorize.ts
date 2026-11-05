import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../utils/AppError';

export const authorize = (...allowedRoles: Role[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized('Autentikasi diperlukan sebelum mengakses sumber daya ini');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden('Akses ditolak: role Anda tidak memiliki izin untuk aksi ini');
    }

    next();
  };
};
