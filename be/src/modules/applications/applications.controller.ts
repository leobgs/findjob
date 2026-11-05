import { Request, Response } from 'express';
import { applicationsService } from './applications.service';
import { sendSuccess } from '../../utils/response';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';
import {
  MyApplicationsQuery,
  JobApplicationsQuery,
  UpdateStatusBody,
} from './applications.schema';

export const apply = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const jobId = req.params.id as string;
  const application = await applicationsService.apply(jobId, req.user.id);
  sendSuccess(res, application, 201);
});

export const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const query = req.query as unknown as MyApplicationsQuery;
  const { applications, meta } = await applicationsService.getMyApplications(
    req.user.id,
    query
  );
  sendSuccess(res, applications, 200, meta);
});

export const getJobApplications = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const jobId = req.params.id as string;
  const query = req.query as unknown as JobApplicationsQuery;
  const { applications, meta } = await applicationsService.getJobApplications(
    jobId,
    req.user.id,
    query
  );
  sendSuccess(res, applications, 200, meta);
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const applicationId = req.params.id as string;
  const body = req.body as UpdateStatusBody;
  const application = await applicationsService.updateStatus(
    applicationId,
    req.user.id,
    body
  );
  sendSuccess(res, application, 200);
});

export const getApplicationHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const applicationId = req.params.id as string;
  const history = await applicationsService.getApplicationHistory(
    applicationId,
    req.user.id,
    req.user.role
  );
  sendSuccess(res, history, 200);
});

