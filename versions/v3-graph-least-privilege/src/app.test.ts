/**
 * V3 Enterprise Application Tests
 */
import request from 'supertest';
import app from '../src/app.js';

describe('V3 Enterprise Application (Graph + Least Privilege)', () => {
  it('should return health status with enterprise features', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.features).toContain('graphAPI');
    expect(response.body.securityLevel).toBe('enterprise-grade');
  });

  it('should provide permission matrix', async () => {
    const response = await request(app).get('/api/security/permissions');
    expect(response.status).toBe(200);
    expect(response.body.permissions).toHaveLength(3);
    expect(response.body.rationale).toBeDefined();
  });

  it('should handle message extension search with Graph', async () => {
    const response = await request(app)
      .post('/api/messageExtension/search')
      .send({
        commandId: 'search',
        parameters: { query: 'test' },
      });

    expect(response.status).toBe(200);
    expect(response.body.composeExtension.attachments).toHaveLength(1);
  });

  it('should return security audit', async () => {
    const response = await request(app).get('/api/security/audit');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('compliant');
    expect(response.body.checks.length).toBeGreaterThan(0);
  });

  it('should require access token for Graph endpoints', async () => {
    const response = await request(app)
      .post('/api/graph/me')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('should return tab configuration with Graph permissions', async () => {
    const response = await request(app).get('/api/config');
    expect(response.status).toBe(200);
    expect(response.body.graphPermissions).toBeDefined();
    expect(response.body.graphPermissions.length).toBeGreaterThan(0);
  });
});
