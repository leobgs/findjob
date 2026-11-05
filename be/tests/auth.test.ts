import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Auth Module Integration Tests', () => {
  const timestamp = Date.now();
  const testSeekerEmail = `test.seeker.${timestamp}@example.com`;
  const testCompanyEmail = `test.company.${timestamp}@example.com`;
  const testPassword = 'Password123';

  let seekerToken: string;
  let companyToken: string;

  it('POST /api/auth/register should register a new Job Seeker successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Seeker',
        email: testSeekerEmail,
        password: testPassword,
        role: 'JOB_SEEKER',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(testSeekerEmail);
    expect(res.body.data.user.role).toBe('JOB_SEEKER');
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.body.data.token).toBeDefined();

    seekerToken = res.body.data.token;
  });

  it('POST /api/auth/register should register a new Company successfully with company record', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Company HR',
        email: testCompanyEmail,
        password: testPassword,
        role: 'COMPANY',
        companyName: 'Acme Innovation Corp',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('COMPANY');
    expect(res.body.data.token).toBeDefined();

    companyToken = res.body.data.token;
  });

  it('POST /api/auth/register should fail when registering company without companyName', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'No Company Name',
        email: `nocompany.${timestamp}@example.com`,
        password: testPassword,
        role: 'COMPANY',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validasi gagal');
  });

  it('POST /api/auth/register should reject duplicate email with 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Seeker',
        email: testSeekerEmail,
        password: testPassword,
        role: 'JOB_SEEKER',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('sudah terdaftar');
  });

  it('POST /api/auth/register should reject invalid password format (< 8 chars)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Weak Pass',
        email: `weak.${timestamp}@example.com`,
        password: 'short',
        role: 'JOB_SEEKER',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login should authenticate successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testSeekerEmail,
        password: testPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testSeekerEmail);
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/auth/login should fail with 401 when password is wrong', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testSeekerEmail,
        password: 'WrongPassword999',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email atau password salah');
  });

  it('POST /api/auth/login should return the same generic message when email does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent.user.123@example.com',
        password: 'Password123',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email atau password salah');
  });

  it('GET /api/auth/me should return current user profile for seeker', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${seekerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testSeekerEmail);
    expect(res.body.data.role).toBe('JOB_SEEKER');
  });

  it('GET /api/auth/me should return company profile for company user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${companyToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testCompanyEmail);
    expect(res.body.data.role).toBe('COMPANY');
    expect(res.body.data.company).toBeDefined();
    expect(res.body.data.company.name).toBe('Acme Innovation Corp');
  });

  it('GET /api/auth/me should return 401 without authentication token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

