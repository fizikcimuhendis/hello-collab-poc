# HelloCollab V3: Enterprise Graph Integration (Least Privilege)

This version adds **enterprise-grade Microsoft Graph API integration** with least-privilege security principles.

## Overview

V3 is the complete enterprise solution:

- All V2 features (tab + message extension)
- Microsoft Graph API integration
- Least-privilege permission model
- Permission matrix & justification
- Admin consent flow
- Audit logging
- Security validation endpoints

## Prerequisites

- Complete V2 setup
- Azure AD app with Graph API permissions
- Admin consent capability
- Understanding of OAuth 2.0 and delegated access

## Permissions (Least Privilege)

| Permission            | Type        | Justification |
| --------------------- | ----------- | ------------- |
| User.Read             | Delegated   | Read user identity |
| Calendars.ReadWrite   | Delegated   | Access user calendar |
| ChannelMessage.Send   | Application | Send team notifications |

See [Graph Permission Matrix](../../docs/security/graph-permission-matrix.md) for detailed analysis.

## Setup

```bash
cd versions/v3-graph-least-privilege

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with:
# - Azure AD app credentials
# - Graph API scopes
# - Logging configuration
```

## Running V3

```bash
# Build TypeScript
npm run build

# Run development server
npm start

# Server starts on http://localhost:3000
```

## Key Endpoints (V1 + V2 + New)

- All V1 & V2 endpoints
- `GET /api/security/permissions` — Permission matrix
- `POST /api/graph/me` — Fetch user profile (requires token)
- `POST /api/graph/calendar` — Fetch calendar events (requires token)
- `GET /api/security/audit` — Security audit status

## Security Features

### Least-Privilege Access

- Only requests necessary permissions
- Uses delegated access (user-granted)
- Application permissions require admin consent
- No silent access to user data

### Audit & Logging

- All Graph API calls logged
- Token validation on every request
- Error logging with context
- Audit endpoint for compliance

### Admin Consent

- Admin-only operations require explicit consent
- Consent flow documented
- Tenant-level permission validation

## Testing

```bash
npm test

# Run with coverage
npm run test:coverage
```

## Demo Endpoints

Test security configuration:

```bash
# Get permission matrix
curl http://localhost:3000/api/security/permissions

# Check audit status
curl http://localhost:3000/api/security/audit

# Get user profile (with token)
curl -X POST http://localhost:3000/api/graph/me \
  -H "Content-Type: application/json" \
  -d '{"accessToken":"your-token-here"}'
```

## Learning Outcomes

After V3, you should understand:

- Least-privilege principle in practice
- Microsoft Graph API integration
- Delegated vs application permissions
- Admin consent workflows
- Audit logging for compliance
- Enterprise security hardening
- Token-based authentication

## Architecture

```
V3 Enterprise Application
├── Tab Functionality (V1)
├── Message Extension (V2)
└── Graph API Integration (New)
    ├── User profile access
    ├── Calendar operations
    ├── Permission validation
    ├── Audit logging
    └── Security checks
```

## Production Hardening Checklist

- [ ] Credentials in Azure Key Vault
- [ ] Token caching & refresh strategy
- [ ] Rate limiting implemented
- [ ] Request logging enabled
- [ ] Error monitoring configured
- [ ] Admin consent pre-obtained
- [ ] Manifest permissions validated
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Secrets encrypted at rest

## Troubleshooting

### Graph API 401 Unauthorized

- Verify access token validity
- Check permission scopes
- Confirm admin consent for application permissions

### Permission Denied Errors

- Review least-privilege matrix
- Verify user/admin roles
- Check consent status in Azure AD

## Resources

- [Graph Permission Reference](https://learn.microsoft.com/en-us/graph/permissions-reference)
- [Delegated vs Application](https://learn.microsoft.com/en-us/graph/auth/auth-concepts)
- [Admin Consent Flow](https://learn.microsoft.com/en-us/graph/auth-v2-service)
- [Security Best Practices](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/security)

---

**Version**: 3.0.0  
**Status**: Enterprise Ready  
**Security Level**: Production-Grade
