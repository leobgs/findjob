import { Router } from 'express';
import { Role } from '@prisma/client';
import { listJobs, getMyJobs, createJob, getJobById } from './jobs.controller';
import { listJobsQuerySchema, createJobSchema, jobIdParamSchema } from './jobs.schema';
import { apply, getJobApplications } from '../applications/applications.controller';
import { jobApplicationsQuerySchema } from '../applications/applications.schema';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';

const router = Router();

router.get('/', authenticate, validate({ query: listJobsQuerySchema }), listJobs);
router.get('/mine', authenticate, authorize(Role.COMPANY), getMyJobs);
router.post('/', authenticate, authorize(Role.COMPANY), validate({ body: createJobSchema }), createJob);
router.get('/:id', authenticate, validate({ params: jobIdParamSchema }), getJobById);

router.post(
  '/:id/apply',
  authenticate,
  authorize(Role.JOB_SEEKER),
  validate({ params: jobIdParamSchema }),
  apply
);

router.get(
  '/:id/applications',
  authenticate,
  authorize(Role.COMPANY),
  validate({ params: jobIdParamSchema, query: jobApplicationsQuerySchema }),
  getJobApplications
);

export default router;
