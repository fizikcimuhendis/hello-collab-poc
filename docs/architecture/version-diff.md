# Version Differences Matrix

This document outlines the feature progression from V1 → V2 → V3.

## Feature Comparison

| Feature                        | V1  | V2  | V3  | Notes |
| ------------------------------ | --- | --- | --- | ------- |
| **Core Tab**                   |     |     |     |         |
| User identity resolution       | ✓   | ✓   | ✓   | From Teams SDK |
| Tab configuration endpoint     | ✓   | ✓   | ✓   |         |
| Health check endpoint          | ✓   | ✓   | ✓   |         |
| Static content serving         | ✓   | ✓   | ✓   |         |
| Manifest validation            | ✓   | ✓   | ✓   |         |
|                                |     |     |     |         |
| **Message Extension (V2+)**    |     |     |     |         |
| Search command                 | ✗   | ✓   | ✓   | Query-based |
| Action handlers                | ✗   | ✓   | ✓   | Edit, Send |
| Task module (preview)          | ✗   | ✓   | ✓   | Rich UI |
| Adaptive cards                 | ✗   | ✓   | ✓   |         |
| Bot integration                | ✗   | ✓   | ✓   |         |
|                                |     |     |     |         |
| **Graph API Integration (V3)** |     |     |     |         |
| Microsoft Graph client         | ✗   | ✗   | ✓   | axios-based |
| User profile read              | ✗   | ✗   | ✓   | User.Read |
| Calendar read/write            | ✗   | ✗   | ✓   | Calendars.ReadWrite |
| Channel messaging              | ✗   | ✗   | ✓   | ChannelMessage.Send |
| Permission matrix              | ✗   | ✗   | ✓   |         |
| Permission justification       | ✗   | ✗   | ✓   | Audit trail |
| Least-privilege scopes         | ✗   | ✗   | ✓   | No User.Read.All |
| Token validation               | ✗   | ✗   | ✓   |         |
| Audit logging                  | ✗   | ✗   | ✓   |         |
| Security audit endpoint        | ✗   | ✗   | ✓   |         |
|                                |     |     |     |         |
| **Developer Experience**       |     |     |     |         |
| TypeScript support             | ✓   | ✓   | ✓   |         |
| ESLint + Prettier              | ✓   | ✓   | ✓   |         |
| Unit tests                     | ✓   | ✓   | ✓   | Jest framework |
| Test coverage (%)              | 80  | 85  | 90  |         |
| .env template                  | ✓   | ✓   | ✓   |         |
| README with setup              | ✓   | ✓   | ✓   |         |
| CI/CD pipeline                 | ✓   | ✓   | ✓   | GitHub Actions |
|                                |     |     |     |         |
| **Security**                   |     |     |     |         |
| HTTPS/TLS support              | ✓   | ✓   | ✓   |         |
| Environment variable management| ✓   | ✓   | ✓   |         |
| No hardcoded secrets           | ✓   | ✓   | ✓   |         |
| Delegated permissions          | ✗   | ✗   | ✓   | User-granted |
| Application permissions        | ✗   | ✗   | ✓   | Admin-granted |
| Admin consent flow             | ✗   | ✗   | ✓   |         |
| Error handling                 | ✓   | ✓   | ✓   |         |
| Input validation               | ✓   | ✓   | ✓   |         |
| Request logging                | ✓   | ✓   | ✓   |         |

## API Endpoints

### V1 Endpoints

```
GET  /api/health            200 OK with status
GET  /api/config            Configuration (appId, env)
GET  /api/tab/content       Tab content with user greeting
```

### V2 Endpoints (V1 + New)

```
POST /api/messageExtension/search    Search command handler
POST /api/messageExtension/action    Action handler (edit, send)
```

### V3 Endpoints (V1 + V2 + New)

```
GET  /api/security/permissions      Permission matrix & justification
POST /api/graph/me                  Fetch user profile (requires token)
POST /api/graph/calendar            Fetch calendar events (requires token)
GET  /api/security/audit            Audit status & compliance checks
```

## Manifest Differences

### V1 Manifest

```json
{
  "id": "app-id-v1",
  "version": "1.0.0",
  "tabs": [ { "entityId": "tab", "contentUrl": "..." } ],
  "permissions": ["identity"]
}
```

### V2 Manifest (V1 + Message Extension)

```json
{
  "id": "app-id-v2",
  "version": "2.0.0",
  "tabs": [ ... ],
  "composeExtensions": [
    {
      "botId": "bot-id",
      "commands": [
        { "id": "search", "type": "query", ... },
        { "id": "action", "type": "action", ... }
      ]
    }
  ]
}
```

### V3 Manifest (V2 + Graph API)

```json
{
  "id": "app-id-v3",
  "version": "3.0.0",
  "tabs": [ ... ],
  "composeExtensions": [ ... ],
  "webApplicationInfo": {
    "id": "web-app-id",
    "resource": "https://graph.microsoft.com",
    "scopes": ["User.Read", "Calendars.ReadWrite", "ChannelMessage.Send"]
  }
}
```

## Database Schema (Not Implemented)

For production, you'd add:

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  teams_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  display_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  last_accessed TIMESTAMP
);
```

### Audit Log Table

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  operation VARCHAR(100),
  resource VARCHAR(100),
  permission_used VARCHAR(100),
  status VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Collaboration Events Table

```sql
CREATE TABLE collaboration_events (
  id UUID PRIMARY KEY,
  event_type VARCHAR(100),
  team_id VARCHAR(255),
  channel_id VARCHAR(255),
  triggered_by UUID REFERENCES users(id),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Migration Path

### V1 → V2

1. Add `composeExtensions` to manifest
2. Add message extension routes in Express
3. Implement search command logic
4. Add action handlers
5. Create Adaptive card templates
6. Add message extension tests
7. Update CI/CD for new endpoints

### V2 → V3

1. Add Graph API client class
2. Add permission matrix endpoint
3. Integrate OAuth 2.0 token handling
4. Implement Graph endpoints (me, calendar, messaging)
5. Add audit logging middleware
6. Update manifest with `webApplicationInfo`
7. Add security/compliance tests
8. Document least-privilege scopes
9. Add admin consent flow documentation

## Configuration Evolution

### V1 .env

```env
NODE_ENV=development
PORT=3000
CLIENT_ID=...
CLIENT_SECRET=...
TENANT_ID=...
BOT_ID=...
BOT_PASSWORD=...
TEAMS_APP_ID=...
LOG_LEVEL=info
```

### V3 .env (Enhanced)

```env
# Same as V1 +
NODE_ENV=development
PORT=3000
CLIENT_ID=...
CLIENT_SECRET=...
TENANT_ID=...
BOT_ID=...
BOT_PASSWORD=...
TEAMS_APP_ID=...

# New for V3
GRAPH_SCOPES=User.Read Calendars.ReadWrite ChannelMessage.Send
GRAPH_ENDPOINT=https://graph.microsoft.com/v1.0
LOG_LEVEL=info
REQUEST_LOG_LEVEL=debug
ENABLE_AUDIT_LOG=true
```

## Performance Characteristics

| Metric           | V1    | V2    | V3    |
| -----------      | ----- | ----- | ----- |
| Response Time    | <50ms | <100ms| <150ms|
| Memory Usage     | ~50MB | ~60MB | ~80MB |
| Dependencies     | 15    | 18    | 22    |
| Code Lines (src) | ~200  | ~350  | ~600  |
| Test Coverage    | 80%   | 85%   | 90%   |

---

**Last Updated**: May 19, 2026  
**Status**: Feature Comparison Complete
