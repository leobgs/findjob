import { Request, Response } from 'express';
import { jobsService } from './jobs.service';
import { sendSuccess } from '../../utils/response';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';
import { ListJobsQuery } from './jobs.schema';

export const listJobs = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const query = req.query as unknown as ListJobsQuery;
  const { jobs, meta } = await jobsService.listJobs(req.user.id, req.user.role, query);
  sendSuccess(res, jobs, 200, meta);
});

export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const id = req.params.id as string;
  const job = await jobsService.getJobById(id, req.user.id, req.user.role);
  sendSuccess(res, job, 200);
});

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const job = await jobsService.createJob(req.user.id, req.body);
  sendSuccess(res, job, 201);
});

export const getMyJobs = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Sesi tidak valid');
  }
  const jobs = await jobsService.getMyJobs(req.user.id);
  sendSuccess(res, jobs, 200);
});
