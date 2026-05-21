# Architecture Overview

## System Context

HelloCollab is a Microsoft Teams application that enables team collaboration with progressive capabilities across three versions:

- **V1**: Basic tab application (foundation)
- **V2**: Tab + Message Extension (extended features)
- **V3**: Graph API integration with least-privilege security (enterprise)

## High-Level Architecture

```text
┌────────────────────────────────────────────────────────────────┐
│                      Microsoft Teams Client                     │
│  ┌──────────┐                                                   │
│  │   Tab    │  ← User opens HelloCollab tab                    │
│  └────┬─────┘                                                   │
│       │ (User context + OAuth token)                            │
└───────┼──────────────────────────────────────────────────────────┘
        │
        │ HTTPS
        │
┌───────▼──────────────────────────────────────────────────────────┐
│                    HelloCollab Backend API                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Express.js Server                         │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │ │
│  │  │ Tab Handler  │  │ Message Ext. │  │ Graph API Client │  │ │
│  │  │              │  │ Handler      │  │ (V3 only)        │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │ Shared Utilities (Logger, Config, Types)             │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────┬─────────┬──────────────┬───────────────────────────────────┘
        │         │              │
        │         │              │
    ┌───▼──┐  ┌──▼───┐    ┌─────▼────────────┐
    │ .env │  │ Logs │    │ Microsoft Graph  │
    │      │  │      │    │ API (V3 only)    │
    └──────┘  └──────┘    └──────────────────┘
```

## Component Interactions

### Request Flow: V1 (Tab)

```
Teams User
    ↓
Teams Client loads tab
    ↓
GET /api/tab/content?userId=XXX
    ↓
Backend resolves user identity
    ↓
Returns user greeting + collaboration context
    ↓
Teams Client displays tab content
```

### Request Flow: V2 (Message Extension)

```
Teams User
    ↓
User uses "..." menu → "Search"
    ↓
Sends search query
    ↓
POST /api/messageExtension/search
    ↓
Backend processes query
    ↓
Returns adaptive card results
    ↓
Teams Client displays search results
    ↓
User clicks "Edit" or "Send"
    ↓
POST /api/messageExtension/action
    ↓
Backend handles action (edit → task module, send → card)
```

### Request Flow: V3 (Graph API with Least Privilege)

```
Teams User
    ↓
User logs in (OAuth 2.0 with Teams context)
    ↓
Teams SDK provides access token (delegated + application scopes)
    ↓
Frontend sends token to backend
    ↓
POST /api/graph/me + token
    ↓
Backend validates token
    ↓
Backend calls Microsoft Graph /me endpoint (User.Read scope)
    ↓
Response logged (audit trail)
    ↓
User profile returned to client
    ↓
Similar for calendar, notifications, etc.
```

## Monorepo Structure

```
hello-collab-poc/
│
├── versions/              ← Three independent versions
│   ├── v1-tab/
│   │   ├── src/
│   │   │   ├── app.ts     ← Express server
│   │   │   └── *.test.ts
│   │   ├── manifest.json  ← Teams metadata
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── v2-tab-msgext/     ← V1 + message extension
│   │   └── (same structure)
│   │
│   └── v3-graph-least-privilege/  ← V1 + V2 + Graph
│       └── (same structure)
│
├── shared/                ← Shared utilities
│   ├── src/
│   │   ├── logger/        ← Winston logging wrapper
│   │   ├── config/        ← Environment config loader
│   │   ├── types/         ← Shared TypeScript types
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                  ← Documentation
│   ├── architecture/      ← This file + version diff
│   ├── security/          ← Permission matrix, consent flow
│   ├── demo/              ← Demo scripts
│   └── deployment/        ← Azure deployment guide
│
├── .github/
│   ├── workflows/         ← GitHub Actions CI/CD
│   │   ├── ci.yml
│   │   ├── security.yml
│   │   └── deploy.yml
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
│
├── .eslintrc.json
├── .prettierrc.json
├── .gitignore
├── package.json           ← Root monorepo config
├── tsconfig.json          ← Root TypeScript config
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
```

## Technology Stack

| Layer              | Technologies         | Notes |
| -----------        | -------------------- | ------- |
| Frontend           | Teams Web Client     | Browser-based |
| Client SDK         | @microsoft/teams-js  | Teams context, identity |
| Runtime            | Node.js 20           | TypeScript runtime |
| Framework          | Express.js 4.x       | HTTP server |
| Language           | TypeScript 5.x       | Type safety |
| Testing            | Jest 29.x            | Unit & integration tests |
| Linting            | ESLint + Prettier    | Code quality |
| Build              | TypeScript Compiler  | tsc → dist/ |
| CI/CD              | GitHub Actions       | Lint, build, test, deploy |
| Deployment         | Azure Container Apps | Serverless containers |
| Secrets            | Azure Key Vault      | Production credentials |
| Logging            | Winston 3.x          | Structured logging |
| Graph API          | @microsoft/graph     | Microsoft ecosystem (V3) |
| Auth               | Azure AD + OAuth 2.0 | Identity platform |

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    Microsoft Azure AD                     │
│  ┌─────────────┐           ┌──────────────────┐          │
│  │ App Reg.    │◄─────────►│ OAuth 2.0 Token  │          │
│  │ (Client ID) │           │ (Access Token)   │          │
│  └─────────────┘           └──────────────────┘          │
└──────────────────────────────────────────────────────────┘
        │                             │
        │                             │ (V3)
        │                             │
┌───────▼─────────────────────────────▼──────────────────────┐
│              Teams Client + HelloCollab Tab                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ├─ User Identity                                      │ │
│  │ ├─ Access Token (scoped to Graph permissions)        │ │
│  │ ├─ Tab Context (team, channel, user)                 │ │
│  │ └─ UI State (V1/V2/V3 features)                      │ │
│  └───────────────────────────────────────────────────────┘ │
└───────┬─────────────────────────────────────────────────────┘
        │ HTTPS Request + Token
        │
┌───────▼──────────────────────────────────────────────────┐
│             HelloCollab Backend API                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Middleware: Auth, CORS, Logging                    │ │
│  └────────────────────────────────────────────────────┘ │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Route Handlers:                                    │ │
│  │ - GET  /api/health                                │ │
│  │ - GET  /api/config                                │ │
│  │ - GET  /api/tab/content                           │ │
│  │ - POST /api/messageExtension/search (V2+)         │ │
│  │ - POST /api/messageExtension/action (V2+)         │ │
│  │ - POST /api/graph/me (V3 only)                    │ │
│  │ - POST /api/graph/calendar (V3 only)              │ │
│  │ - GET  /api/security/permissions (V3 only)        │ │
│  │ - GET  /api/security/audit (V3 only)              │ │
│  └────────────────────────────────────────────────────┘ │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Services:                                          │ │
│  │ - Logger (Winston)                                 │ │
│  │ - Config Loader (dotenv)                           │ │
│  │ - Graph Client (axios → Microsoft Graph) (V3)     │ │
│  └────────────────────────────────────────────────────┘ │
│                        ↓ (V3 only)                      │
│                        │                                 │
└────────────────────────┼─────────────────────────────────┘
                         │
              ┌──────────▼─────────────┐
              │ Microsoft Graph API    │
              │ /v1.0/me               │
              │ /v1.0/me/calendarview │
              │ /v1.0/teams/.../msg   │
              └────────────────────────┘
```

## Data Structures

### Tab Context (Teams → App)

```typescript
interface TabContext {
  theme: 'default' | 'dark' | 'contrast';
  teamId: string;
  channelId: string;
  userId: string;
}
```

### Message Extension Request

```typescript
interface MessageExtensionRequest {
  commandId: string;
  parameters: Record<string, string>;
  botMessagePreviewAction?: 'edit' | 'send' | 'cancel';
}
```

### Graph Permission (V3)

```typescript
interface GraphPermission {
  scope: string;
  type: 'delegated' | 'application';
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  justification: string;
}
```

## Error Handling

```
Request → Middleware validation
            ↓
         ✓ Auth check
            ↓
         ✓ Route handler
            ↓
         ✓ Graph call (V3)
            ↓
         Response (or error)
            ↓
         Error handler → Log + Respond (500 or specific code)
```

## Performance Considerations

- **Caching**: No caching in this POC (stateless); production would cache tokens
- **Rate Limiting**: Not implemented; would be middleware
- **Database**: No DB in POC; production needs data store (Cosmos DB recommended)
- **Async Operations**: No async jobs; notifications are sync in POC

## Security Model

```
┌────────────────────────────────────────────────────────┐
│           Least-Privilege Security Model               │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Layer 1: Authentication                               │
│ └─ Azure AD OAuth 2.0                                 │
│    └─ Teams SDK validates identity                    │
│                                                        │
│ Layer 2: Authorization                                │
│ └─ Token scope validation (Graph scopes)              │
│    └─ Permission matrix enforcement (V3)              │
│                                                        │
│ Layer 3: Auditing                                     │
│ └─ All operations logged                              │
│    └─ Graph calls tracked for compliance              │
│                                                        │
│ Layer 4: Data Protection                              │
│ └─ HTTPS/TLS in transit                               │
│    └─ Secrets in Key Vault (production)               │
│    └─ No sensitive data at rest (stateless)           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

**Last Updated**: May 19, 2026  
**Version**: 3.0.0  
**Status**: Architecture Documented
