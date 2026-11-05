import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getMyApplications,
  updateStatus,
  getApplicationHistory,
} from './applications.controller';
import {
  applicationIdParamSchema,
  myApplicationsQuerySchema,
  updateStatusBodySchema,
} from './applications.schema';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';

const router = Router();

router.get(
  '/mine',
  authenticate,
  authorize(Role.JOB_SEEKER),
  validate({ query: myApplicationsQuerySchema }),
  getMyApplications
);

router.patch(
  '/:id/status',
  authenticate,
  authorize(Role.COMPANY),
  validate({ params: applicationIdParamSchema, body: updateStatusBodySchema }),
  updateStatus
);

router.get(
  '/:id/history',
  authenticate,
  validate({ params: applicationIdParamSchema }),
  getApplicationHistory
);

export default router;

