/**
 * Shared utilities tests
 */
import { loadConfig } from '../src/config/index.js';

describe('Shared Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should throw error when required env vars are missing', () => {
    expect(() => {
      loadConfig();
    }).toThrow('Missing required environment variables');
  });

  it('should load config successfully with all env vars', () => {
    process.env.CLIENT_ID = 'test-id';
    process.env.CLIENT_SECRET = 'test-secret';
    process.env.TENANT_ID = 'test-tenant';
    process.env.BOT_ID = 'test-bot';
    process.env.BOT_PASSWORD = 'test-pass';
    process.env.TEAMS_APP_ID = 'test-app';
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'test';

    const config = loadConfig();
    expect(config.clientId).toBe('test-id');
    expect(config.port).toBe(3000);
  });
});
