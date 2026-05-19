/**
 * HelloCollab V2: Tab Application + Message Extension
 * Extends V1 with message extension capabilities
 */
import express, { Express, Request, Response } from 'express';
import { loadConfig, logger, type MessageExtensionRequest } from 'hello-collab-shared';

const app: Express = express();
const config = loadConfig();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    features: ['tab', 'messageExtension'],
  });
});

// Tab configuration endpoint
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    appId: config.teamsAppId,
    environment: config.env,
    capabilities: ['tab', 'messageExtension'],
  });
});

// Tab content endpoint
app.get('/api/tab/content', (req: Request, res: Response) => {
  const { userId } = req.query;
  res.json({
    message: `Hello, user ${userId || 'Guest'}!`,
    title: 'HelloCollab - Tab + Message Extension',
    description: 'This version adds message extension capabilities for richer collaboration.',
    version: 'V2',
    features: ['User identity', 'Static content display', 'Message extensions', 'Action handlers'],
  });
});

// Message Extension search endpoint
app.post('/api/messageExtension/search', (req: Request, res: Response) => {
  const { commandId, parameters }: MessageExtensionRequest = req.body;

  logger.info(`Message Extension search: ${commandId}`, parameters);

  const searchResults = [
    {
      type: 'result',
      value: {
        compact: `Result 1 for "${parameters?.query || 'all'}"`,
        full: `This is a detailed result for search query: ${parameters?.query || 'all'}`,
      },
    },
  ];

  res.json({
    composeExtension: {
      type: 'result',
      attachmentLayout: 'list',
      attachments: searchResults,
    },
  });
});

// Message Extension action handler
app.post('/api/messageExtension/action', (req: Request, res: Response) => {
  const { botMessagePreviewAction, parameters }: MessageExtensionRequest = req.body;

  logger.info(`Message Extension action: ${botMessagePreviewAction}`, parameters);

  if (botMessagePreviewAction === 'edit') {
    res.json({
      task: {
        type: 'continue',
        value: {
          title: 'Edit Action',
          card: {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.4',
            body: [
              {
                type: 'TextBlock',
                text: 'Edit your content here',
              },
            ],
          },
        },
      },
    });
  } else if (botMessagePreviewAction === 'send') {
    res.json({
      composeExtension: {
        type: 'result',
        attachmentLayout: 'list',
        attachments: [
          {
            contentType: 'application/vnd.microsoft.teams.card.adaptive',
            content: {
              $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
              type: 'AdaptiveCard',
              version: '1.4',
              body: [
                {
                  type: 'TextBlock',
                  text: 'Content shared successfully',
                },
              ],
            },
          },
        ],
      },
    });
  }
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
  logger.info(`V2 Tab + Message Extension Application started on port ${config.port}`);
  logger.info(`Environment: ${config.env}`);
});

export default app;
