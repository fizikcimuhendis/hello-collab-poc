# Graph Permission Matrix: Least-Privilege Design

## Executive Summary

HelloCollab V3 implements **least-privilege access** to Microsoft Graph API, requesting only permissions absolutely necessary for collaboration features while maintaining security and audit trails.

## Permission Matrix

| Permission            | Type        | Scope Level | Risk | Justification | Delegated/App | Admin Consent |
| --------------------- | ----------- | ----------- | ---- | ------------- | ------------- | ------------- |
| User.Read             | Delegated   | User        | Low  | Read current user profile for identity | Delegated | User |
| Calendars.ReadWrite   | Delegated   | User        | Med  | Read/write user calendar for scheduling | Delegated | User |
| ChannelMessage.Send   | Application | Organization | Med | Send notifications to Teams channels | Application | Admin |

## Detailed Permission Rationale

### User.Read (LOW RISK)

**What it allows**: Read current user's profile (name, email, photo, timezone)

**Why we need it**: Establish user identity within Teams collaboration context

**Why NOT more**: We don't request `User.Read.All` (would allow reading all org users)

**Alternatives considered**: Identity claims from Teams SDK alone insufficient for Graph integration scenarios

**Least-privilege approach**: Delegated access, user-granted, limited to calling user

---

### Calendars.ReadWrite (MEDIUM RISK)

**What it allows**: Read and write user's calendar, create/modify events

**Why we need it**: Enable calendar-based collaboration scheduling

**Why NOT more**: We don't request Calendar access for other users or org calendars

**Alternatives considered**: 
- Read-only (Calendars.Read) — insufficient for write scenarios
- Event-only access — not available; granular scoping limited in Graph

**Least-privilege approach**: Delegated access, user-granted, limited to calling user's calendar

**Risk mitigation**:
- Audit log all write operations
- User consent required before any action
- No automatic calendar modifications

---

### ChannelMessage.Send (MEDIUM RISK)

**What it allows**: Send messages to Teams channels as the application

**Why we need it**: Deliver collaboration notifications/updates to teams

**Why NOT more**: We don't request Mail.Send (would allow email access)

**Alternatives considered**: 
- User-impersonated messaging — would require per-user tokens
- Webhook notifications — simpler but less flexible

**Least-privilege approach**: 
- **Application permission** (NOT delegated)
- Requires **admin consent** (tenant-level control)
- Sent as application, not user
- Auditable with application-specific logging

**Risk mitigation**:
- Only application service principal can use
- Admin must explicitly approve
- All sends logged with context
- No user impersonation

---

## Why NOT These Common Scopes

### Mail.Send ❌

- **Would allow**: Send emails on behalf of user
- **Why excluded**: Collaboration notifications go via Teams, not email
- **Risk if included**: Email spoofing, phishing vector

### Calendars.Read.Shared ❌

- **Would allow**: Read colleagues' calendars
- **Why excluded**: HelloCollab focuses on individual scheduling
- **Risk if included**: Privacy violation, unnecessary data exposure

### Directory.ReadWrite.All ❌

- **Would allow**: Modify org directory, create/delete users
- **Why excluded**: HelloCollab has no admin provisioning needs
- **Risk if included**: Catastrophic security exposure

### Application Mail.Send ❌

- **Would allow**: Send email as app (service account)
- **Why excluded**: Notifications via Teams channels, not email
- **Risk if included**: Spam/phishing vector

---

## Consent Flow

### Delegated Permissions (User.Read, Calendars.ReadWrite)

```
1. User navigates to tab
2. App requests delegated scope
3. User sees consent prompt: "Allow HelloCollab to read your profile and calendar?"
4. User grants consent (or denies)
5. User-specific access token issued
6. Consent stored in Azure AD (can be revoked by user)
```

### Application Permissions (ChannelMessage.Send)

```
1. Admin deploys app to tenant
2. App registered in Azure AD with application permissions
3. Admin visits Azure AD portal → Enterprise Apps → HelloCollab
4. Admin grants admin consent: "Allow HelloCollab to send messages to Teams?"
5. Tenant-wide permission granted (can be revoked by admin)
6. Application token issued at startup
```

---

## Audit & Logging

### What We Log

✅ Every Graph API call:
- Timestamp
- User/App performing action
- Permission used
- Operation (read/write/send)
- Result (success/failure)
- Any errors or warnings

✅ Consent events:
- When user grants delegated consent
- When admin grants application consent
- Consent revocation

✅ Permission denials:
- Attempts to use unavailable permissions
- Token validation failures

### Example Logs

```json
{
  "timestamp": "2024-05-19T14:30:00Z",
  "operation": "Graph.POST",
  "permission": "Calendars.ReadWrite",
  "user": "user@example.com",
  "action": "Create calendar event",
  "status": "success",
  "details": "Event 'Team Standup' created on May 20"
}
```

```json
{
  "timestamp": "2024-05-19T14:35:00Z",
  "operation": "Graph.POST",
  "permission": "ChannelMessage.Send",
  "app": "HelloCollab-Service",
  "channelId": "19:xxx@thread.skype",
  "status": "success",
  "messageId": "msg-12345"
}
```

---

## Compliance Mapping

| Requirement | V3 Implementation |
| ----------- | ------ |
| Least privilege | Only 3 permissions; all with business justification |
| No silent access | Delegated perms require user consent; app perms require admin |
| Audit trail | All Graph calls logged with context |
| Revocation | Users can revoke consent in Azure AD; admins can revoke tenant consent |
| Data minimization | No directory reads, no org-wide access |
| Admin oversight | Application permissions require admin consent |
| User control | Delegated permissions user-controlled |

---

## Security Posture

### Threat Mitigations

| Threat | Mitigation |
| ------ | ---------- |
| Phishing/Spam via mail | No Mail.Send; notifications via Teams only |
| Directory enumeration | No Directory.Read permissions |
| Privilege escalation | No admin provisioning permissions |
| Unauthorized messaging | ChannelMessage.Send app-only; admin-approved; audited |
| User impersonation | Delegated access only for delegated; no app-user impersonation |
| Token theft | Tokens expire; refresh strategy in place; logging on use |

### Compliance Alignments

- **GDPR**: Only processes data user explicitly consents to
- **HIPAA**: Audit logging for accountability
- **SOC 2**: Least privilege, access logging, admin controls
- **ISO 27001**: Authentication, authorization, audit trail

---

## Recommendations for Production

1. **Implement token caching & refresh** — Minimize Graph calls
2. **Enable request signing** — Verify app identity
3. **Implement rate limiting** — Prevent abuse
4. **Central audit log** — Send logs to Azure Monitor or SIEM
5. **Regular audit reviews** — Monthly permission usage audit
6. **User education** — Document consent flows
7. **Incident response** — Plan for token compromise
8. **Regular penetration testing** — Validate security posture

---

**Last Updated**: May 19, 2026  
**Status**: Enterprise-Ready  
**Compliance**: GDPR, SOC 2, ISO 27001 aligned
