# HelloCollab V2: Tab + Message Extension

This version extends V1 by adding **message extension capabilities**, enabling search and action handlers.

## Overview

V2 builds on V1 foundation:

- All V1 features (tab + health + config endpoints)
- Message extension search command
- Adaptive card action handlers
- Message preview functionality
- Compose extension integration

## Prerequisites

- Complete V1 setup
- Understanding of message extensions
- Teams test environment with message extension permissions

## Setup

```bash
cd versions/v2-tab-msgext

# Install dependencies (includes V1 modules)
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Teams credentials
```

## Running V2

```bash
# Build TypeScript
npm run build

# Run development server
npm start

# Server starts on http://localhost:3000
```

## Key Endpoints (V1 + New)

- All V1 endpoints
- `POST /api/messageExtension/search` — Handle search queries
- `POST /api/messageExtension/action` — Handle action commands

## Message Extension Features

### Search Command

- Query parameter: `query`
- Returns list of results
- Supports preview mode

### Action Handlers

- **Edit**: Opens task module for editing
- **Preview**: Shows content preview
- **Send**: Sends message to conversation

## Testing

```bash
npm test

# Run with coverage
npm run test:coverage
```

## Learning Outcomes

After V2, you should understand:

- Message extension architecture
- Search and action commands
- Adaptive card integration
- Task module implementation
- Compose extension in Teams

## Architecture

```
V2 Application
├── Tab Functionality (from V1)
│   ├── User identity
│   ├── Config endpoint
│   └── Health check
└── Message Extension
    ├── Search handler
    └── Action handler
```

## Next Step

Proceed to [V3: Enterprise Graph Integration](../v3-graph-least-privilege/README.md) for secure Microsoft Graph API access.

---

**Version**: 2.0.0  
**Status**: Message Extension Complete
