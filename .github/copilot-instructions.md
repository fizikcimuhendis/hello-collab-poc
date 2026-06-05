<!-- Use this file to provide workspace-specific custom instructions to Copilot. -->

## HelloCollab POC Development Guidelines

This is a multi-version Microsoft Teams application showcasing enterprise collaboration features.

### Project Context

- **Monorepo structure**: Shared utilities + 3 independent versions (V1, V2, V3)
- **Purpose**: Portfolio project demonstrating enterprise Microsoft Teams development
- **Focus**: Security (least-privilege), enterprise readiness, progressive complexity
- **Tech**: Node.js 20, TypeScript, Express, Jest, GitHub Actions

### Key Principles

1. **Security First**
   - Never hardcode secrets or credentials
   - All environment variables use `.env.example` templates
   - Azure Key Vault for production secrets
   - Least-privilege Graph API permissions (V3)

2. **Enterprise Ready**
   - Full test coverage (80%+ per version)
   - Comprehensive logging (Winston)
   - CI/CD pipeline (GitHub Actions)
   - Audit trails for compliance
   - Documentation for every major feature

3. **Progressive Complexity**
   - V1: Foundation (tab only)
   - V2: Extended (tab + message extension)
   - V3: Enterprise (graph API + security)
   - Each version backward compatible; can run independently

### Development Rules

- **Code Style**: ESLint + Prettier (run `npm run lint:all --fix`)
- **Testing**: Jest (`npm run test:all`)
- **Validation**: `npm run validate` before commits
- **Type Safety**: TypeScript strict mode (no `any` without justification)
- **Commit Messages**: Conventional commits (feat:, fix:, docs:, etc.)

### Workspace Structure

- `/versions/v1-tab` → V1 implementation
- `/versions/v2-tab-msgext` → V2 implementation
- `/versions/v3-graph-least-privilege` → V3 implementation
- `/shared` → Shared utilities (logger, config, types)
- `/docs` → Architecture, security, demo, deployment
- `.github/workflows` → CI/CD pipelines

### When Adding Features

1. **Maintain backward compatibility** — Each version should work independently
2. **Update tests** — Minimum 80% coverage
3. **Document security implications** — Especially for Graph scopes (V3)
4. **Update manifests** — If adding Teams capabilities
5. **Validate CI/CD passes** — All lint, build, test must pass

### Common Tasks

```bash
# Install all dependencies
npm install

# Build everything
npm run build:all

# Run tests with coverage
npm run test:all && npm run test:coverage

# Validate (lint + test + build)
npm run validate

# Start V1, V2, or V3
npm run start:v1
npm run start:v2
npm run start:v3

# Run specific version tests
npm test -w versions/v3-graph-least-privilege
```

### Security Checklist (V3)

- [ ] Graph scopes in permission matrix (justification required)
- [ ] All Graph calls logged
- [ ] Admin consent flow documented
- [ ] Token validation on every request
- [ ] No silent/background access to user data
- [ ] Error messages don't leak sensitive info

### Resources

- [Teams Platform Docs](https://learn.microsoft.com/en-us/microsoftteams/platform/)
- [Graph API Scopes](https://learn.microsoft.com/en-us/graph/permissions-reference)
- [Least Privilege](../../docs/security/graph-permission-matrix.md)
- [Architecture Overview](../../docs/architecture/overview.md)

---

**Last Updated**: May 19, 2026  
**Status**: Active Development
