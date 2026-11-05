import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  status = 200,
  meta?: PaginationMeta
): Response => {
  return res.status(status).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors: ValidationErrorDetail[] = [],
  requestId?: string
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 ? { errors } : { errors: [] }),
    ...(requestId ? { requestId } : {}),
  });
};

