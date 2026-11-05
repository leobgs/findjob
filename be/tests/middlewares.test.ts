import { describe, it, expect } from 'vitest';
import express, { Request, Response } from 'express';
import request from 'supertest';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { authenticate } from '../src/middlewares/authenticate';
import { authorize } from '../src/middlewares/authorize';
import { validate } from '../src/middlewares/validate';
import { errorHandler } from '../src/middlewares/errorHandler';
import { sendSuccess } from '../src/utils/response';
import { signToken } from '../src/utils/jwt';

describe('Middlewares Test Suite', () => {
  const testApp = express();
  testApp.use(express.json());

  const testSchema = z
    .object({
      title: z.string().min(3),
    })
    .strict();

  testApp.post(
    '/test-validate',
    validate({ body: testSchema }),
    (_req: Request, res: Response) => {
      sendSuccess(res, { ok: true });
    }
  );

  testApp.get(
    '/test-auth',
    authenticate,
    (req: Request, res: Response) => {
      sendSuccess(res, { user: req.user });
    }
  );

  testApp.get(
    '/test-company-only',
    authenticate,
    authorize(Role.COMPANY),
    (req: Request, res: Response) => {
      sendSuccess(res, { authorized: true });
    }
  );

  testApp.use(errorHandler);

  it('validate middleware should reject payload not matching schema with 400', async () => {
    const res = await request(testApp).post('/test-validate').send({ title: 'a' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validasi gagal');
    expect(res.body.errors[0].field).toBe('title');
  });

  it('validate middleware should reject unknown fields with .strict()', async () => {
    const res = await request(testApp)
      .post('/test-validate')
      .send({ title: 'Valid Title', maliciousField: true });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('authenticate middleware should return 401 if no auth header', async () => {
    const res = await request(testApp).get('/test-auth');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('authenticate middleware should pass with valid token', async () => {
    const token = signToken({ sub: 'user-123', role: Role.JOB_SEEKER });
    const res = await request(testApp)
      .get('/test-auth')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user).toEqual({ id: 'user-123', role: Role.JOB_SEEKER });
  });

  it('authorize middleware should return 403 for wrong role', async () => {
    const token = signToken({ sub: 'user-123', role: Role.JOB_SEEKER });
    const res = await request(testApp)
      .get('/test-company-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('authorize middleware should return 200 for allowed role', async () => {
    const token = signToken({ sub: 'company-123', role: Role.COMPANY });
    const res = await request(testApp)
      .get('/test-company-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.authorized).toBe(true);
  });
});

