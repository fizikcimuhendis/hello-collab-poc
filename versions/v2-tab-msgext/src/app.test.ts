/**
 * V2 Tab + Message Extension Tests
 */
import request from 'supertest';
import app from '../src/app.js';

describe('V2 Tab + Message Extension Application', () => {
  it('should return health status with message extension capability', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.features).toContain('messageExtension');
  });

  it('should handle message extension search', async () => {
    const response = await request(app)
      .post('/api/messageExtension/search')
      .send({
        commandId: 'search',
        parameters: { query: 'test' },
      });

    expect(response.status).toBe(200);
    expect(response.body.composeExtension).toBeDefined();
    expect(response.body.composeExtension.attachments).toHaveLength(1);
  });

  it('should handle message extension action', async () => {
    const response = await request(app)
      .post('/api/messageExtension/action')
      .send({
        commandId: 'action',
        botMessagePreviewAction: 'send',
        parameters: {},
      });

    expect(response.status).toBe(200);
    expect(response.body.composeExtension).toBeDefined();
  });

  it('should return tab configuration with message extension', async () => {
    const response = await request(app).get('/api/config');
    expect(response.status).toBe(200);
    expect(response.body.capabilities).toContain('messageExtension');
  });
});
