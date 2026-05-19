# Interview Demo Script: HelloCollab 30-Minute Walkthrough

**Audience**: Microsoft Cloud Solution Architect Interviewers  
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

**What you say:**

> "I've built HelloCollab as a portfolio project demonstrating Microsoft Teams development from basics to enterprise security. It's a monorepo with three versions, each progressively adding complexity: V1 is a simple tab, V2 adds message extension, and V3 implements Graph API with least-privilege access.
>
> The entire project emphasizes security best practices, enterprise readiness, and interview-relevant architecture decisions."

**Visual**: Show repository structure in GitHub or local directory tree

**Why this matters**: Sets context for progressive complexity; shows you think about evolution

---

### Section 2: V1 - Foundation (2-6 minutes)

**Terminal command:**
```bash
cd versions/v1-tab
npm start
```

**What you say:**

> "V1 is intentionally simple. It has:
> 1. **Teams manifest** — defines app ID, tabs, permissions
> 2. **Basic Express server** — serves static content + API endpoints
> 3. **User identity** — Teams SDK provides user context
> 4. **Health & config endpoints** — for testing and lifecycle
>
> Notice the manifest requires specific structure. Teams validates this at upload."

**Demo**: 
- Show `manifest.json` structure (focus on tabs, validDomains, permissions)
- Show `src/app.ts` — simple endpoints
- Hit `http://localhost:3000/api/health` in browser — show JSON response

**Point out:**
- Environment variables for credentials (never hardcoded)
- Test coverage ~80%
- No external dependencies except Express

**Why this matters**: Shows you understand Teams fundamentals; emphasizes security (env vars, no secrets in code)

---

### Section 3: V2 - Message Extension (6-12 minutes)

**Terminal command:**
```bash
cd ../v2-tab-msgext
npm start
```

**What you say:**

> "V2 adds a message extension on top of V1. This is where Teams collaboration really starts:
> 1. **Search command** — users can search from compose area
> 2. **Action handlers** — edit, preview, send messages
> 3. **Adaptive cards** — rich formatting with Teams-native controls
> 4. **No data persistence** — this demo doesn't have a database; focus is on Teams integration
>
> The key architectural decision: message extensions are stateless here. In production, you'd wire this to a backend database."

**Demo**:
- Show `manifest.json` composeExtensions section
- Show `/api/messageExtension/search` endpoint in code
- Explain request/response contract (query params → attachments)
- Show Adaptive card JSON in response

**Ask yourself (for interview):**
- "How would you add persistence?" → Database choice (Cosmos DB for scale)
- "How would you handle concurrency?" → Locks, versioning
- "What about authentication?" → User context from Teams SDK

**Point out:**
- Manifest defines what Teams shows (UI for search)
- Backend handles the logic (filtering, formatting)
- Separation of concerns

**Why this matters**: Shows you understand Teams ecosystem (manifest-driven); think about architectural decisions (stateless vs. stateful)

---

### Section 4: V3 - Enterprise Graph Integration (12-25 minutes)

**Terminal command:**
```bash
cd ../v3-graph-least-privilege
npm start
```

**What you say:**

> "V3 is where enterprise security comes into play. We're integrating Microsoft Graph API with a least-privilege mindset:
>
> 1. **Only three permissions**: User.Read (low), Calendars.ReadWrite (medium), ChannelMessage.Send (high, app-only)
> 2. **Delegated vs. Application**: Delegated for user-specific (calendar); Application for org operations (notifications)
> 3. **Audit logging**: Every Graph call is logged
> 4. **Admin consent**: Application permissions require tenant admin approval"

**Demo Part 1: Permission Matrix**
```bash
curl http://localhost:3000/api/security/permissions
```

**What to highlight**:
```json
{
  "permissions": [
    {
      "scope": "User.Read",
      "type": "delegated",
      "riskLevel": "low",
      "justification": "Needed to identify current user in collaboration context"
    },
    // ...
  ]
}
```

**Say:**
> "Notice each permission has a justification. This is critical in enterprise: never request more access than you need. We explicitly don't request User.Read.All (all org users), Mail.Send (email), or Directory.ReadWrite.All (dangerous). We ask only for what we use, and we document why."

**Demo Part 2: Audit Endpoint**
```bash
curl http://localhost:3000/api/security/audit
```

**Say:**
> "This is compliance theater in action. We track what permissions we request, what we use, and provide an audit endpoint. In production, this hooks to Azure Monitor or a SIEM. Auditors love this."

**Demo Part 3: Graph Call with Token (Optional)**
```bash
# If you have a valid token from Teams SDK
curl -X POST http://localhost:3000/api/graph/me \
  -H "Content-Type: application/json" \
  -d '{"accessToken":"token-here"}'
```

**Say:**
> "To call Graph, the app receives a token from Teams. We validate it, use it scoped to only what we need, and immediately log the operation. No silent operations. User sees what we're doing."

**Key Architecture Decisions** (Interviewer will love this):

1. **Why Application Permission for ChannelMessage.Send?**
   > "We need to notify the *team*, not the individual. So the app itself (not a user) sends the message. Admin must approve this at tenant level. It's auditable, controlled, and explicit."

2. **Why NOT use Mail.Send?**
   > "Collaboration happens in Teams channels, not email. Adding mail sends would expand our attack surface unnecessarily. Plus, it invites phishing vectors. Least privilege means saying 'no' to scope creep."

3. **Why Delegated for Calendars.ReadWrite?**
   > "User owns their calendar. They should control whether HelloCollab accesses it. If we used application permissions, the app would read all team members' calendars — privacy nightmare. Delegated means user consent."

---

### Section 5: Testing & CI/CD (25-28 minutes)

**Show the GitHub Actions workflows:**

```bash
# From repo root, show:
cat .github/workflows/ci.yml
cat .github/workflows/security.yml
```

**What you say:**

> "Every push runs:
> 1. **CI Pipeline**: Lint, build, test all three versions, validate manifests
> 2. **Security Pipeline**: npm audit, secret scanning, manifest integrity
> 3. **Deploy Pipeline**: (placeholder) would build Docker, push to ACR, deploy to Container Apps
>
> The deploy pipeline is intentionally incomplete because this is a POC, but the structure shows you know production deployment patterns."

**Show test results:**
```bash
npm run test:all
```

**Point out:**
- ~80-90% coverage across versions
- Tests verify endpoints, permissions, error handling
- V3 specifically tests Graph permission enforcement

**Why this matters**: Enterprise apps need CI/CD. You're showing you know testing, automation, and progressive integration

---

### Section 6: Security Posture & Interview Questions (28-30 minutes)

**You say:**

> "Let me address some follow-up questions you might have:

1. **"How would you scale this?"**
   > Separate app tiers: frontend (Static Web App), API tier (Container Apps or Functions), database (Cosmos DB for global scale). Add caching (Redis) for performance.

2. **"What about multi-tenant?"**
   > Each tenant gets separate app registration. Manifest ID and app ID differ per tenant. V3's admin consent flow handles this.

3. **"How do you handle token refresh?"**
   > In production, we'd implement token cache with automatic refresh. Right now, demo assumes short-lived tokens and doesn't handle expiry, but the architecture is ready.

4. **"What about rate limiting?"**
   > Not in this POC, but production would add middleware to throttle requests. Graph API itself returns 429 (too many requests); we'd implement exponential backoff.

5. **"How do you prevent privilege escalation?"**
   > By being intentional about permissions. We audit every Graph call. We never request permissions we don't document. Admin consent for sensitive operations.

6. **"What would you do differently in a real project?"**
   > - Database (Cosmos DB or Azure SQL)
   > - Proper secrets management (Key Vault, not .env)
   > - Message queue for async notifications (Service Bus)
   > - Comprehensive monitoring (App Insights)
   > - Rate limiting & circuit breakers
   > - Automated security scanning (pipeline included, but expanded in prod)"

---

## Fallback Plan

If demo crashes:

1. **Show code** — Walk through key files (app.ts, manifest.json, permission matrix)
2. **Show architecture diagram** — Explain components and data flow
3. **Show tests** — "Here's how we validate each version"
4. **Show CI/CD** — "This is how we'd deploy to production"

**Time should still work** — You're demonstrating knowledge even without live running app

---

## Post-Demo Interview Flow

**Interviewer may ask:**

- "What would you add next?" → Database, user management, analytics
- "How would you handle Teams client compatibility?" → Version negotiation, feature detection
- "What's the most complex part?" → Least-privilege design; balancing security vs. functionality
- "How do you think about Teams as a platform vs. traditional web app?" → Emphasize ecosystem (manifest, consent, identity)

---

## Timing Notes

- **Overrun on V3 demo** — This is the interesting part; take the time
- **Have code snippets ready** — Don't type; have terminals pre-positioned
- **Don't dive too deep into React/frontend** — This POC focuses on backend/security
- **Prepare 1-2 architectural diagrams** — Even crude whiteboard sketches show you think visually

---

**Key Takeaways for Interviewer:**

✅ You understand Teams platform fundamentals  
✅ You think about security (least privilege, audit)  
✅ You can design progressively (V1 → V3)  
✅ You know enterprise practices (CI/CD, logging, compliance)  
✅ You can articulate architectural trade-offs  
✅ You've thought about production hardening  

---

**Last Updated**: May 19, 2026  
**Demo Status**: Ready  
**Estimated Runtime**: 30 minutes + 10 min Q&A
