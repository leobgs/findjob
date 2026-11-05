import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { sendError, ValidationErrorDetail } from '../utils/response';
import { env } from '../config/env';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = req.id;

  if (err instanceof ZodError) {
    const errors: ValidationErrorDetail[] = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    sendError(res, 'Validasi gagal', 400, errors, requestId);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, [], requestId);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      sendError(res, 'Data sudah terdaftar atau terjadi duplikasi data', 409, [], requestId);
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 'Data tidak ditemukan', 404, [], requestId);
      return;
    }
  }

  if (err instanceof TokenExpiredError) {
    sendError(res, 'Token telah kedaluwarsa, silakan login kembali', 401, [], requestId);
    return;
  }
  if (err instanceof JsonWebTokenError) {
    sendError(res, 'Token tidak valid, silakan login kembali', 401, [], requestId);
    return;
  }

  if (env.NODE_ENV !== 'test') {
    console.error(`[Error] Request ID: ${requestId ?? 'N/A'}`);
    console.error(err);
  }

  sendError(res, 'Terjadi kesalahan internal pada server', 500, [], requestId);
};
