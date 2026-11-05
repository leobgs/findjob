import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Health and Error Handling Foundation', () => {
  it('GET /api/health should return status ok with 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { status: 'ok' },
    });
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('GET /api/docs should serve Swagger UI', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });

  it('GET /api/docs/openapi.json should return OpenAPI schema with all paths', async () => {
    const res = await request(app).get('/api/docs/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
    expect(Object.keys(res.body.paths).length).toBe(12);
  });

  it('GET /docs should redirect to /api/docs/', async () => {
    const res = await request(app).get('/docs');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/api/docs/');
  });

  it('GET /api/unregistered-route should return 404 in standard format', async () => {
    const res = await request(app).get('/api/unregistered-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('tidak ditemukan');
    expect(res.body.errors).toEqual([]);
    expect(res.body.requestId).toBeDefined();
  });
});
