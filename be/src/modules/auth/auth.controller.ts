import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendSuccess(res, result, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  sendSuccess(res, result, 200);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const result = await authService.getMe(req.user.id);
  sendSuccess(res, result, 200);
});

