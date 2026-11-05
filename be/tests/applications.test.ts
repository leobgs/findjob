import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Applications Module Integration Tests', () => {
  let seekerToken: string;
  let seeker2Token: string;
  let company1Token: string;
  let company2Token: string;

  let techCorpJobId: string;
  let closedJobId: string;
  let createdApplicationId: string;

  beforeAll(async () => {
    const seekerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'seeker@test.com', password: 'Password123' });
    seekerToken = seekerRes.body.data.token;

    const seeker2Res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'seeker2@test.com', password: 'Password123' });
    seeker2Token = seeker2Res.body.data.token;

    const company1Res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'company@test.com', password: 'Password123' });
    company1Token = company1Res.body.data.token;

    const company2Res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'company2@test.com', password: 'Password123' });
    company2Token = company2Res.body.data.token;

    const jobRes = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${company1Token}`)
      .send({
        title: 'Security Analyst Specialist',
        description: 'Menganalisis kerentanan sistem, melakukan audit keamanan, dan penetration testing.',
        location: 'Jakarta Selatan',
        jobType: 'FULL_TIME',
      });
    techCorpJobId = jobRes.body.data.id;

    const jobsList = await request(app)
      .get('/api/jobs/mine')
      .set('Authorization', `Bearer ${company1Token}`);
    const closedJob = jobsList.body.data.find(
      (j: { title: string }) => j.title === 'Cloud Architect Lead'
    );
    if (closedJob) {
      closedJobId = closedJob.id;
    }
  });

  it('POST /api/jobs/:id/apply should allow Job Seeker to apply successfully', async () => {
    const res = await request(app)
      .post(`/api/jobs/${techCorpJobId}/apply`)
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('APPLIED');
    expect(res.body.data.jobId).toBe(techCorpJobId);
    createdApplicationId = res.body.data.id;
  });

  it('POST /api/jobs/:id/apply should reject duplicate application with 409', async () => {
    const res = await request(app)
      .post(`/api/jobs/${techCorpJobId}/apply`)
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('sudah melamar');
  });

  it('POST /api/jobs/:id/apply should reject applying to CLOSED job with 400', async () => {
    if (closedJobId) {
      const res = await request(app)
        .post(`/api/jobs/${closedJobId}/apply`)
        .set('Authorization', `Bearer ${seekerToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('ditutup');
    }
  });

  it('POST /api/jobs/:id/apply should reject Company account with 403', async () => {
    const res = await request(app)
      .post(`/api/jobs/${techCorpJobId}/apply`)
      .set('Authorization', `Bearer ${company1Token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/applications/mine should return list of applications for Job Seeker', async () => {
    const res = await request(app)
      .get('/api/applications/mine')
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.meta).toBeDefined();

    const appItem = res.body.data[0];
    expect(appItem).toHaveProperty('id');
    expect(appItem).toHaveProperty('status');
    expect(appItem).toHaveProperty('appliedAt');
    expect(appItem).toHaveProperty('job');
    expect(appItem).toHaveProperty('company');
  });

  it('GET /api/applications/mine should reject Company with 403', async () => {
    const res = await request(app)
      .get('/api/applications/mine')
      .set('Authorization', `Bearer ${company1Token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/jobs/:id/applications should return candidate list for company owner', async () => {
    const res = await request(app)
      .get(`/api/jobs/${techCorpJobId}/applications`)
      .set('Authorization', `Bearer ${company1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.meta).toBeDefined();

    const candidate = res.body.data[0];
    expect(candidate.applicant).toHaveProperty('id');
    expect(candidate.applicant).toHaveProperty('name');
    expect(candidate.applicant).toHaveProperty('email');
    expect(candidate.applicant.passwordHash).toBeUndefined();
  });

  it('GET /api/jobs/:id/applications should return 404 when Company B tries to view Company A candidates', async () => {
    const res = await request(app)
      .get(`/api/jobs/${techCorpJobId}/applications`)
      .set('Authorization', `Bearer ${company2Token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('PATCH /api/applications/:id/status should update application status and record history', async () => {
    const res = await request(app)
      .patch(`/api/applications/${createdApplicationId}/status`)
      .set('Authorization', `Bearer ${company1Token}`)
      .send({
        status: 'REVIEWING',
        note: 'Kandidat memiliki sertifikasi keamanan yang relevan',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('REVIEWING');
  });

  it('PATCH /api/applications/:id/status should reject transition if new status equals current status (400)', async () => {
    const res = await request(app)
      .patch(`/api/applications/${createdApplicationId}/status`)
      .set('Authorization', `Bearer ${company1Token}`)
      .send({
        status: 'REVIEWING',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('tidak boleh sama');
  });

  it('PATCH /api/applications/:id/status should return 404 when Company B tries to update Company A application', async () => {
    const res = await request(app)
      .patch(`/api/applications/${createdApplicationId}/status`)
      .set('Authorization', `Bearer ${company2Token}`)
      .send({
        status: 'SHORTLISTED',
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/applications/:id/history should return chronological history for applicant', async () => {
    const res = await request(app)
      .get(`/api/applications/${createdApplicationId}/history`)
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);

    const firstEntry = res.body.data[0];
    expect(firstEntry.fromStatus).toBeNull();
    expect(firstEntry.toStatus).toBe('APPLIED');
    expect(firstEntry.changedBy).toBeDefined();

    const secondEntry = res.body.data[1];
    expect(secondEntry.fromStatus).toBe('APPLIED');
    expect(secondEntry.toStatus).toBe('REVIEWING');
    expect(secondEntry.note).toContain('sertifikasi keamanan');
  });

  it('GET /api/applications/:id/history should return chronological history for company owner', async () => {
    const res = await request(app)
      .get(`/api/applications/${createdApplicationId}/history`)
      .set('Authorization', `Bearer ${company1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it('GET /api/applications/:id/history should return 404 for unrelated user', async () => {
    const res = await request(app)
      .get(`/api/applications/${createdApplicationId}/history`)
      .set('Authorization', `Bearer ${seeker2Token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

