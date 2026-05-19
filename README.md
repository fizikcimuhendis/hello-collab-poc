# HelloCollab POC: Multi-Version Microsoft Teams Application

[![CI - Build & Test](https://github.com/yourusername/hello-collab-poc/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/hello-collab-poc/actions/workflows/ci.yml)
[![Security Checks](https://github.com/yourusername/hello-collab-poc/actions/workflows/security.yml/badge.svg)](https://github.com/yourusername/hello-collab-poc/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**HelloCollab** is a proof-of-concept Microsoft Teams application showcasing enterprise collaboration features across three progressively complex versions, with emphasis on security best practices and least-privilege Microsoft Graph API access.

## 📚 Learning Path

This repository is designed for **learning and demonstration purposes**. Start here and progress through versions:

```text
V1: Simple Tab App (Foundation)
  ↓
V2: Tab + Message Extension (Extended Features)
  ↓
V3: Enterprise Graph Integration (Security & Scale)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git
- (For deployment) Azure subscription with Teams app publishing capability

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/hello-collab-poc.git
cd hello-collab-poc

# Install all dependencies
npm install --workspaces

# Build all packages
npm run build:all

# Run all tests
npm run test:all

# Validate (lint + test + build)
npm run validate
```

### Running Individual Versions

```bash
# V1: Simple Tab Application
npm run start:v1

# V2: Tab + Message Extension
npm run start:v2

# V3: Enterprise Graph Integration
npm run start:v3
```

## 📖 Documentation Structure

| Document | Purpose |
|----------|---------|
| [V1 Tab Application](versions/v1-tab/README.md) | Foundation: basic tab setup |
| [V2 Tab + Message Extension](versions/v2-tab-msgext/README.md) | Extended features: search & actions |
| [V3 Enterprise Graph](versions/v3-graph-least-privilege/README.md) | Advanced: secure Graph API integration |
| [Architecture Overview](docs/architecture/overview.md) | System design and components |
| [Version Differences](docs/architecture/version-diff.md) | Feature matrix across versions |
| [Graph Permission Matrix](docs/security/graph-permission-matrix.md) | Least-privilege scope analysis |
| [Security & Admin Guide](docs/security/consent-and-admin-guide.md) | Tenant setup and admin consent |
| [Interview Demo Script](docs/demo/interview-demo-script.md) | 30-minute demo narrative |
| [Contribution Guide](CONTRIBUTING.md) | How to contribute |

## 🏗️ Project Structure

```text
hello-collab-poc/
├── versions/
│   ├── v1-tab/              # Version 1: Simple Tab App
│   ├── v2-tab-msgext/       # Version 2: Tab + Message Extension
│   └── v3-graph-least-privilege/  # Version 3: Graph API
├── shared/                  # Shared utilities (logger, config, types)
├── docs/
│   ├── architecture/        # System design docs
│   ├── security/            # Security & compliance docs
│   └── demo/                # Demo scripts & checklists
├── .github/
│   └── workflows/           # GitHub Actions CI/CD pipelines
├── .eslintrc.json          # ESLint configuration
├── .prettierrc.json        # Prettier code formatting
└── package.json            # Monorepo root
```

## ✨ Key Features by Version

### V1: Simple Tab Application

- **Focus**: Foundation & user identity
- **Features**:
  - Basic Teams tab configuration
  - User identity resolution
  - Static content display
  - Tab lifecycle management
- **Security**: Basic HTTPS, manifest validation
- **Test Coverage**: ~80%

### V2: Tab + Message Extension

- **Focus**: Extended collaboration capabilities
- **Features**:
  - Tab from V1 + Message Extension
  - Search command with query parameters
  - Action handlers (edit, preview, send)
  - Adaptive card support
- **Security**: Request validation, error handling
- **Test Coverage**: ~85%

### V3: Enterprise Graph Integration (Least Privilege)

- **Focus**: Enterprise-grade with secure Graph API access
- **Features**:
  - Tab + Message Extension from V2
  - Microsoft Graph API integration
  - User profile & calendar access
  - **Least-privilege permissions**
  - Permission matrix & audit endpoints
  - Admin consent flow documentation
- **Security**: Token validation, permission enforcement, audit logging
- **Compliance**: Enterprise readiness checklist
- **Test Coverage**: ~90%

## 🔐 Security Highlights

### Least-Privilege Access (V3)

HelloCollab V3 demonstrates enterprise security best practices:

- **Delegated Permissions Only**: Uses only delegated scopes (except ChannelMessage.Send which is application-scoped with admin control)
- **Minimal Scope**: Only requests what's needed (User.Read, Calendars.ReadWrite, ChannelMessage.Send)
- **No Silent Access**: Requires explicit user consent for delegated operations
- **Audit Trail**: All Graph API calls are logged
- **Permission Justification**: Every scope includes business rationale

See [Graph Permission Matrix](docs/security/graph-permission-matrix.md) for detailed analysis.

## 🧪 Testing & Quality

All versions include comprehensive tests:

```bash
# Run all tests
npm run test:all

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint:all

# Fix lint issues
npm run lint:all --fix
```

### CI/CD Pipelines

- **CI Pipeline** (`.github/workflows/ci.yml`):
  - Lint validation
  - TypeScript compilation
  - Unit tests
  - Coverage reporting
  - Manifest validation

- **Security Pipeline** (`.github/workflows/security.yml`):
  - npm audit
  - Secret scanning
  - Manifest integrity checks

- **Deploy Pipeline** (`.github/workflows/deploy.yml`):
  - Build & test
  - Docker image preparation
  - Azure deployment (placeholder)

## 📊 Supported Scenarios

### Learning Scenarios

- Teams app development basics (V1)
- Message extension implementation (V2)
- Enterprise Graph API integration (V3)
- Least-privilege security design (V3)

### Interview Preparation Scenarios

- Architecture storytelling (all versions)
- Feature evolution & backward compatibility
- Security & compliance trade-offs (V3)
- Enterprise readiness demonstration (V3)

### Demo Scenarios

- 30-minute guided walkthrough with talking points
- Live debugging in dev environment
- Permission matrix & consent flow demonstration
- Security audit endpoint validation

## 🛠️ Development Workflow

1. **Make changes** to one or more versions
2. **Run validation**: `npm run validate`
3. **Run tests**: `npm run test:all`
4. **Commit** with descriptive message
5. **Push** to feature branch
6. **Create Pull Request** (CI/CD runs automatically)
7. **Review** and merge

## 📝 Environment Configuration

Each version includes `.env.example`:

```bash
# Copy template to .env
cp versions/v1-tab/.env.example versions/v1-tab/.env

# Fill in your Azure/Teams credentials
NODE_ENV=development
PORT=3000
CLIENT_ID=your-app-id
CLIENT_SECRET=your-app-secret
TENANT_ID=your-tenant-id
BOT_ID=your-bot-id
BOT_PASSWORD=your-bot-password
TEAMS_APP_ID=your-teams-app-id
```

⚠️ **Never commit `.env` files with real credentials.** Use Azure Key Vault or similar for production.

## 🚀 Deployment

### Local Development

```bash
npm run start:v3  # Starts development server on port 3000
```

### Azure Container Apps (Placeholder)

See [Deployment Guide](docs/deployment/azure-deployment.md) for full instructions.

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/hello-collab-poc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/hello-collab-poc/discussions)
- **Email**: [your-email@example.com]

## 📋 Interview Preparation Checklist

Use this repo to prepare for Microsoft Collaboration Cloud Solution Architect interviews:

- [ ] Understand V1 tab fundamentals and Teams manifest
- [ ] Explain V2 message extension architecture
- [ ] Deep dive into V3 least-privilege Graph design
- [ ] Run demo script (30 minutes) smoothly
- [ ] Answer permission trade-off questions
- [ ] Discuss scalability & enterprise hardening
- [ ] Review CI/CD & deployment strategy
- [ ] Prepare for follow-up questions on security

## 📚 Resources

- [Microsoft Teams Platform Documentation](https://learn.microsoft.com/en-us/microsoftteams/platform/)
- [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/api/overview)
- [Azure App Service Deployment](https://learn.microsoft.com/en-us/azure/app-service/)
- [Teams App Security Best Practices](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/security)

## 📜 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🙏 Acknowledgments

This POC was created as a portfolio and interview preparation project, demonstrating enterprise-grade Microsoft Teams development practices.

---

**Last Updated**: May 19, 2026  
**Version**: 3.0.0 (V3 Enterprise)  
**Status**: Production-Ready Demo
