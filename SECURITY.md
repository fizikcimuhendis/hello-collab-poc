# Security Policy

## Reporting Security Issues

**Do not** open public GitHub issues for security vulnerabilities.

Instead, email security concerns to: [your-email@example.com]

Include:

- Description of the vulnerability
- Affected version(s)
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

## Security Best Practices

This section documents security practices used in HelloCollab.

### Authentication & Authorization

- All users authenticated via Azure AD
- Teams SDK provides identity context
- OAuth 2.0 for Graph API access
- Admin consent required for application permissions

### Data Protection

- Least-privilege Graph permissions (User.Read, Calendars.ReadWrite, ChannelMessage.Send)
- No sensitive data stored locally
- Environment variables for credentials (never in code)
- Audit logging for all operations

### Deployment

- Secrets stored in Azure Key Vault (production)
- HTTPS/TLS for all communications
- Regular security patching (npm audit, GitHub dependabot)
- CI/CD security scanning enabled

### Secrets Management

```bash
# Local development: use .env (add to .gitignore)
# Production: use Azure Key Vault
# Never commit credentials
```

### Dependency Management

- Regular `npm audit` runs in CI/CD
- GitHub Dependabot alerts enabled
- Minimal third-party dependencies

### Compliance

- GDPR: Only processes data with explicit user consent
- SOC 2: Audit logging and access controls
- ISO 27001: Information security controls implemented

## Vulnerability Disclosure

Once reported and fixed, vulnerabilities will be disclosed in a GitHub Security Advisory.

---

**Last Updated**: May 19, 2026  
**Status**: Security-First Design
