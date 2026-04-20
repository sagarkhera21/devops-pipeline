const request = require('supertest');
const app = require('../src/app');

describe('Core App Endpoints', () => {
  it('should return health status (GET /health)', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('UP');
  });

  it('should return api metrics (GET /api/metrics)', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('memoryUsage');
  });

  it('should return prometheus metrics (GET /metrics)', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(typeof res.text).toBe('string');
  });

  it('should increment counter (GET /api/counter)', async () => {
    const res = await request(app).get('/api/counter');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('count');
    expect(res.body.count).toBeGreaterThan(0);
  });
});
