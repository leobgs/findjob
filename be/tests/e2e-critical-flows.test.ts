import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Critical Scenarios Integration Test Suite', () => {
  const ts = Date.now();
  const seekerEmail = `crit.seeker.${ts}@test.com`;
  const companyAEmail = `crit.companyA.${ts}@test.com`;
  const companyBEmail = `crit.companyB.${ts}@test.com`;
  const password = 'Password123';

  let seekerToken: string;
  let companyAToken: string;
  let companyBToken: string;

  let jobAId: string;
  let applicationId: string;

  beforeAll(async () => {
    const sRes = await request(app).post('/api/auth/register').send({
      name: 'Critical Seeker',
      email: seekerEmail,
      password,
      role: 'JOB_SEEKER',
    });
    seekerToken = sRes.body.data.token;

    const cARes = await request(app).post('/api/auth/register').send({
      name: 'Admin Company A',
      email: companyAEmail,
      password,
      role: 'COMPANY',
      companyName: 'Company Alpha',
    });
    companyAToken = cARes.body.data.token;

    const cBRes = await request(app).post('/api/auth/register').send({
      name: 'Admin Company B',
      email: companyBEmail,
      password,
      role: 'COMPANY',
      companyName: 'Company Beta',
    });
    companyBToken = cBRes.body.data.token;

    const jRes = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${companyAToken}`)
      .send({
        title: 'Platform Infrastructure Engineer',
        description: 'Membangun arsitektur multi-cloud dengan Terraform, Kubernetes, dan observability suite.',
        location: 'Jakarta',
        jobType: 'FULL_TIME',
        salaryMin: 15000000,
        salaryMax: 25000000,
      });
    jobAId = jRes.body.data.id;
  });

  it('Scenario 1: Register & login success, login with wrong password fails (401)', async () => {
    const loginOk = await request(app)
      .post('/api/auth/login')
      .send({ email: seekerEmail, password });
    expect(loginOk.status).toBe(200);
    expect(loginOk.body.success).toBe(true);
    expect(loginOk.body.data.token).toBeDefined();

    const loginFail = await request(app)
      .post('/api/auth/login')
      .send({ email: seekerEmail, password: 'WrongPassword999' });
    expect(loginFail.status).toBe(401);
    expect(loginFail.body.success).toBe(false);
    expect(loginFail.body.message).toBe('Email atau password salah');
  });

  it('Scenario 2: Company endpoints reject Job Seeker (403) and unauthenticated (401)', async () => {
    const unauth = await request(app)
      .post('/api/jobs')
      .send({
        title: 'Unauthorized Job',
        description: 'Mencoba membuat lowongan tanpa token otorisasi sama sekali.',
        location: 'Jakarta',
        jobType: 'FULL_TIME',
      });
    expect(unauth.status).toBe(401);

    const forbidden = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        title: 'Forbidden Job',
        description: 'Mencoba membuat lowongan menggunakan akun job seeker.',
        location: 'Jakarta',
        jobType: 'FULL_TIME',
      });
    expect(forbidden.status).toBe(403);
  });

  it('Scenario 3: Job Seeker applying twice to the same job returns 409 on second attempt', async () => {
    const firstApply = await request(app)
      .post(`/api/jobs/${jobAId}/apply`)
      .set('Authorization', `Bearer ${seekerToken}`);
    expect(firstApply.status).toBe(201);
    expect(firstApply.body.success).toBe(true);
    applicationId = firstApply.body.data.id;

    const secondApply = await request(app)
      .post(`/api/jobs/${jobAId}/apply`)
      .set('Authorization', `Bearer ${seekerToken}`);
    expect(secondApply.status).toBe(409);
    expect(secondApply.body.success).toBe(false);
    expect(secondApply.body.message).toContain('sudah melamar');
  });

  it('Scenario 4: Company B cannot view candidates or update status of Company A job (404)', async () => {
    const viewCandidates = await request(app)
      .get(`/api/jobs/${jobAId}/applications`)
      .set('Authorization', `Bearer ${companyBToken}`);
    expect(viewCandidates.status).toBe(404);

    const updateCandidate = await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${companyBToken}`)
      .send({
        status: 'REVIEWING',
      });
    expect(updateCandidate.status).toBe(404);
  });

  it('Scenario 5: Status update creates history entry with correct fromStatus and toStatus', async () => {
    const updateRes = await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${companyAToken}`)
      .send({
        status: 'REVIEWING',
        note: 'Memenuhi persyaratan kualifikasi awal',
      });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.status).toBe('REVIEWING');

    const updateRes2 = await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${companyAToken}`)
      .send({
        status: 'SHORTLISTED',
        note: 'Lolos ke tahap technical interview',
      });
    expect(updateRes2.status).toBe(200);
    expect(updateRes2.body.data.status).toBe('SHORTLISTED');

    const historyRes = await request(app)
      .get(`/api/applications/${applicationId}/history`)
      .set('Authorization', `Bearer ${seekerToken}`);
    expect(historyRes.status).toBe(200);
    const history = historyRes.body.data;
    expect(history.length).toBe(3);

    expect(history[0].fromStatus).toBeNull();
    expect(history[0].toStatus).toBe('APPLIED');

    expect(history[1].fromStatus).toBe('APPLIED');
    expect(history[1].toStatus).toBe('REVIEWING');
    expect(history[1].note).toBe('Memenuhi persyaratan kualifikasi awal');

    expect(history[2].fromStatus).toBe('REVIEWING');
    expect(history[2].toStatus).toBe('SHORTLISTED');
    expect(history[2].note).toBe('Lolos ke tahap technical interview');
  });

  it('Scenario 6: Validation rejects invalid input with 400 and field details', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'A',
        email: 'invalid-email-format',
        password: '123',
        role: 'INVALID_ROLE',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validasi gagal');
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);

    const errorFields = res.body.errors.map((e: { field: string }) => e.field);
    expect(errorFields).toContain('name');
    expect(errorFields).toContain('email');
    expect(errorFields).toContain('password');
    expect(errorFields).toContain('role');
  });
});

