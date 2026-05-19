# HelloCollab V1: Simple Tab Application

This is the first version of HelloCollab, demonstrating a **basic Teams tab application** with minimal complexity.

## Overview

V1 establishes the foundation for Teams app development:

- Simple Express.js server
- Teams SDK configuration
- User identity resolution
- Static content serving
- Basic error handling

## Prerequisites

- Node.js 18.0.0+
- npm 9.0.0+
- Azure AD tenant
- Teams test environment

## Setup

```bash
# From repository root
cd versions/v1-tab

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# CLIENT_ID, CLIENT_SECRET, TENANT_ID, BOT_ID, BOT_PASSWORD, TEAMS_APP_ID
```

## Running V1

```bash
# Build TypeScript
npm run build

# Run development server
npm start

# Server starts on http://localhost:3000
```

## Testing

```bash
npm test

# Run with coverage
npm run test:coverage
```

## Key Endpoints

- `GET /api/health` — Health check
- `GET /api/config` — Tab configuration
- `GET /api/tab/content` — Tab content with user greeting

## Learning Outcomes

After completing V1, you should understand:

- Teams manifest structure and configuration
- Tab lifecycle in Teams
- User identity and context
- Basic Express.js setup for Teams
- Testing patterns for Teams apps

## Next Step

Proceed to [V2: Tab + Message Extension](../v2-tab-msgext/README.md) to add search and action capabilities.

---

**Version**: 1.0.0  
**Status**: Foundation Complete
