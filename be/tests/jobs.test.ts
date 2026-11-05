import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Jobs Module Integration Tests', () => {
  let seekerToken: string;
  let companyToken: string;
  let createdJobId: string;

  beforeAll(async () => {
    const seekerLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'seeker@test.com', password: 'Password123' });
    seekerToken = seekerLogin.body.data.token;

    const companyLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'company@test.com', password: 'Password123' });
    companyToken = companyLogin.body.data.token;
  });

  it('GET /api/jobs should return list of open jobs with pagination meta', async () => {
    const res = await request(app)
      .get('/api/jobs?page=1&limit=5')
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(5);
    expect(res.body.meta.total).toBeGreaterThan(0);

    const firstJob = res.body.data[0];
    expect(firstJob).toHaveProperty('id');
    expect(firstJob).toHaveProperty('title');
    expect(firstJob).toHaveProperty('company');
    expect(firstJob).toHaveProperty('location');
    expect(firstJob).toHaveProperty('jobType');
    expect(typeof firstJob.hasApplied).toBe('boolean');
  });

  it('GET /api/jobs should filter by search keyword', async () => {
    const res = await request(app)
      .get('/api/jobs?search=Backend')
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].title).toContain('Backend');
  });

  it('GET /api/jobs should filter by jobType', async () => {
    const res = await request(app)
      .get('/api/jobs?jobType=FULL_TIME')
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(200);
    for (const job of res.body.data) {
      expect(job.jobType).toBe('FULL_TIME');
    }
  });

  it('POST /api/jobs should create a job when called by COMPANY', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        title: 'Lead QA Automation Engineer',
        description: 'Membangun framework pengujian otomatis end-to-end dengan Playwright, Cypress, dan CI/CD integrasi.',
        location: 'Jakarta Selatan',
        jobType: 'FULL_TIME',
        salaryMin: 14000000,
        salaryMax: 22000000,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Lead QA Automation Engineer');
    expect(res.body.data.company.name).toBe('Tech Corp');
    createdJobId = res.body.data.id;
  });

  it('POST /api/jobs should reject creation with salaryMax < salaryMin', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        title: 'Invalid Salary Job Posting',
        description: 'Lowongan ini memiliki gaji maksimal yang lebih kecil daripada gaji minimal untuk test.',
        location: 'Jakarta',
        jobType: 'FULL_TIME',
        salaryMin: 20000000,
        salaryMax: 10000000,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validasi gagal');
  });

  it('POST /api/jobs should reject Job Seeker with 403', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        title: 'Hacker Attempt Job',
        description: 'Lowongan yang coba dibuat oleh job seeker tanpa hak akses.',
        location: 'Remote',
        jobType: 'CONTRACT',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/jobs/mine should return only jobs created by the authenticated company', async () => {
    const res = await request(app)
      .get('/api/jobs/mine')
      .set('Authorization', `Bearer ${companyToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('applicantCount');
  });

  it('GET /api/jobs/mine should reject Job Seeker with 403', async () => {
    const res = await request(app)
      .get('/api/jobs/mine')
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/jobs/:id should return complete job detail', async () => {
    const res = await request(app)
      .get(`/api/jobs/${createdJobId}`)
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdJobId);
    expect(res.body.data.description).toBeDefined();
    expect(res.body.data.company).toBeDefined();
    expect(res.body.data).toHaveProperty('application');
  });

  it('GET /api/jobs/:id should return 404 for non-existent job ID', async () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';
    const res = await request(app)
      .get(`/api/jobs/${fakeUuid}`)
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/jobs/:id should return 400 for invalid UUID format', async () => {
    const res = await request(app)
      .get('/api/jobs/not-a-valid-uuid')
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validasi gagal');
  });
});

