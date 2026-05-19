/**
 * HelloCollab V1: Simple Tab Application
 * Demonstrates a basic Teams tab with no external dependencies
 */
import express, { Express, Request, Response } from 'express';
import { loadConfig, logger } from 'hello-collab-shared';

const app: Express = express();
const config = loadConfig();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Tab configuration endpoint
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    appId: config.teamsAppId,
    environment: config.env,
  });
});

// Tab content endpoint
app.get('/api/tab/content', (req: Request, res: Response) => {
  const { userId } = req.query;
  res.json({
    message: `Hello, user ${userId || 'Guest'}!`,
    title: 'HelloCollab - Tab Application',
    description: 'This is a simple Teams tab demonstrating basic collaboration features.',
    version: 'V1',
    features: ['User identity', 'Static content display', 'Basic navigation'],
  });
});

// Error handler
app.use((err: any, _req: Request, res: Response) => {
  logger.error('Application error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.env === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(config.port, () => {
  logger.info(`V1 Tab Application started on port ${config.port}`);
  logger.info(`Environment: ${config.env}`);
});

export default app;
