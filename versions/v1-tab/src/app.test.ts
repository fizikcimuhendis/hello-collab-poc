/**
 * V1 Tab Application Tests
 */
import request from 'supertest';
import app from '../src/app.js';

describe('V1 Tab Application', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });

  it('should return app configuration', async () => {
    const response = await request(app).get('/api/config');
    expect(response.status).toBe(200);
    expect(response.body.appId).toBeDefined();
  });

  it('should return tab content with user greeting', async () => {
    const response = await request(app).get('/api/tab/content?userId=test-user');
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('test-user');
    expect(response.body.version).toBe('V1');
  });

  it('should serve static files', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200) || expect(response.status).toBe(404); // Depends on public folder
  });
});
