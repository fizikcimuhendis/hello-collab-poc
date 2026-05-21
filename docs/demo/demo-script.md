# HelloCollab Demo Script: 30-Minute Walkthrough

**Duration**: 30 minutes
**Goal**: Demonstrate architecture, security, and enterprise readiness

## Pre-Demo Checklist (5 min before start)

- [ ] All three versions built and tested
- [ ] Environment variables set correctly
- [ ] Network connectivity verified
- [ ] Browser dev tools ready
- [ ] Terminal windows arranged
- [ ] Screenshots/docs bookmarked
- [ ] Fallback demo available (no live deployment needed)

---

## Timeline & Talking Points

### Section 1: Introduction (0-2 minutes)

**What to cover:**

> "HelloCollab is a Microsoft Teams POC demonstrating enterprise collaboration features. It's a monorepo with three versions, each progressively adding complexity: V1 is a simple tab, V2 adds message extension, and V3 implements Graph API with least-privilege access.
>
> The project emphasizes security best practices and enterprise readiness throughout."

**Visual**: Show repository structure in GitHub or local directory tree

---

### Section 2: V1 - Foundation (2-6 minutes)

**Terminal command:**

```bash
cd versions/v1-tab
npm start
```

**What to cover:**

> "V1 is intentionally simple. It has:
>
> 1. **Teams manifest** — defines app ID, tabs, permissions
> 2. **Basic Express server** — serves static content + API endpoints
> 3. **User identity** — Teams SDK provides user context
> 4. **Health & config endpoints** — for testing and lifecycle
>
> The manifest requires specific structure. Teams validates this at upload."

**Demo:**

- Show `manifest.json` structure (focus on tabs, validDomains, permissions)
- Show `src/app.ts` — simple endpoints
- Hit `http://localhost:3000/api/health` in browser — show JSON response

**Key points:**

- Environment variables for credentials (never hardcoded)
- Test coverage ~80%
- No external dependencies except Express

---

### Section 3: V2 - Message Extension (6-12 minutes)

**Terminal command:**

```bash
cd ../v2-tab-msgext
npm start
```

**What to cover:**

> "V2 adds a message extension on top of V1. This is where Teams collaboration really starts:
>
> 1. **Search command** — users can search from compose area
> 2. **Action handlers** — edit, preview, send messages
> 3. **Adaptive cards** — rich formatting with Teams-native controls
> 4. **No data persistence** — focus is on Teams integration patterns
>
> The key architectural decision: message extensions are stateless here. In production, you'd wire this to a backend database."

**Demo:**

- Show `manifest.json` composeExtensions section
- Show `/api/messageExtension/search` endpoint in code
- Explain request/response contract (query params → attachments)
- Show Adaptive card JSON in response

**Key points:**

- Manifest defines what Teams shows (UI for search)
- Backend handles the logic (filtering, formatting)
- Separation of concerns

---

### Section 4: V3 - Enterprise Graph Integration (12-25 minutes)

**Terminal command:**

```bash
cd ../v3-graph-least-privilege
npm start
```

**What to cover:**

> "V3 is where enterprise security comes into play. We're integrating Microsoft Graph API with a least-privilege mindset:
>
> 1. **Only three permissions**: User.Read (low), Calendars.ReadWrite (medium), ChannelMessage.Send (high, app-only)
> 2. **Delegated vs. Application**: Delegated for user-specific (calendar); Application for org operations (notifications)
> 3. **Audit logging**: Every Graph call is logged
> 4. **Admin consent**: Application permissions require tenant admin approval"

#### Demo Part 1: Permission Matrix

```bash
curl http://localhost:3000/api/security/permissions
```

**What to highlight:**

```json
{
  "permissions": [
    {
      "scope": "User.Read",
      "type": "delegated",
      "riskLevel": "low",
      "justification": "Needed to identify current user in collaboration context"
    }
  ]
}
```

> "Each permission has a justification. This is critical in enterprise: never request more access than you need. We explicitly don't request User.Read.All, Mail.Send, or Directory.ReadWrite.All. We ask only for what we use, and we document why."

#### Demo Part 2: Audit Endpoint

```bash
curl http://localhost:3000/api/security/audit
```

> "We track what permissions we request, what we use, and provide an audit endpoint. In production, this hooks to Azure Monitor or a SIEM."

#### Demo Part 3: Graph Call with Token (Optional)

```bash
curl -X POST http://localhost:3000/api/graph/me \
  -H "Content-Type: application/json" \
  -d '{"accessToken":"token-here"}'
```

**Key Architecture Decisions:**

1. **Why Application Permission for ChannelMessage.Send?**
   > "The app notifies the team, not an individual. Admin must approve this at tenant level. It's auditable, controlled, and explicit."

2. **Why NOT use Mail.Send?**
   > "Collaboration happens in Teams channels, not email. Adding mail sends would expand the attack surface unnecessarily. Least privilege means saying 'no' to scope creep."

3. **Why Delegated for Calendars.ReadWrite?**
   > "Users own their calendars. Delegated means user consent is required — they control access."

---

### Section 5: Testing & CI/CD (25-28 minutes)

**Show the GitHub Actions workflows:**

```bash
cat .github/workflows/ci.yml
cat .github/workflows/security.yml
```

**What to cover:**

> "Every push runs:
>
> 1. **CI Pipeline**: Lint, build, test all three versions, validate manifests
> 2. **Security Pipeline**: npm audit, secret scanning, manifest integrity
> 3. **Deploy Pipeline**: (placeholder) builds Docker, pushes to ACR, deploys to Container Apps"

**Show test results:**

```bash
npm run test:all
```

**Key points:**

- ~80-90% coverage across versions
- Tests verify endpoints, permissions, error handling
- V3 specifically tests Graph permission enforcement

---

### Section 6: Security Posture & Q&A (28-30 minutes)

**Common questions and answers:**

1. **"How would you scale this?"**
   > Separate app tiers: frontend (Static Web App), API tier (Container Apps or Functions), database (Cosmos DB for global scale). Add caching (Redis) for performance.

2. **"What about multi-tenant?"**
   > Each tenant gets a separate app registration. Manifest ID and app ID differ per tenant. V3's admin consent flow handles this.

3. **"How do you handle token refresh?"**
   > In production, implement token cache with automatic refresh. Graph API returns 429 (too many requests); use exponential backoff.

4. **"How do you prevent privilege escalation?"**
   > By being intentional about permissions. Every Graph call is audited. Admin consent required for sensitive operations.

5. **"What would you do differently in a real project?"**
   > - Database (Cosmos DB or Azure SQL)
   > - Proper secrets management (Key Vault, not .env)
   > - Message queue for async notifications (Service Bus)
   > - Comprehensive monitoring (App Insights)
   > - Rate limiting & circuit breakers

---

## Fallback Plan

If demo crashes:

1. **Show code** — Walk through key files (app.ts, manifest.json, permission matrix)
2. **Show architecture diagram** — Explain components and data flow
3. **Show tests** — Validate each version
4. **Show CI/CD** — Production deployment structure

---

## Timing Notes

- **Spend extra time on V3** — This is the most complex and interesting part
- **Have code snippets ready** — Don't type; have terminals pre-positioned
- **Prepare 1-2 architectural diagrams** — Even crude whiteboard sketches help

---

**Last Updated**: May 19, 2026
**Demo Status**: Ready
**Estimated Runtime**: 30 minutes + 10 min Q&A
