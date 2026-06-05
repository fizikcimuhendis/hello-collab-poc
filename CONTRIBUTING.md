# Contributing to HelloCollab

Thank you for your interest in contributing to HelloCollab! This document outlines guidelines for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/hello-collab-poc.git`
3. Create a branch: `git checkout -b feature/your-feature`
4. Install dependencies: `npm install`

## Development Workflow

1. Make your changes
2. Run validation: `npm run validate`
3. Run tests: `npm run test:all`
4. Commit with descriptive message: `git commit -m "feat: add feature X"`
5. Push to your fork
6. Create a Pull Request

## Commit Message Convention

Follow conventional commits:

```
feat: add new feature
fix: fix a bug
docs: update documentation
test: add tests
chore: maintenance
```

## Code Style

- **Linting**: `npm run lint:all`
- **Formatting**: `npm run lint:all --fix` (uses Prettier)
- **TypeScript**: Strict mode enabled; no `any` unless justified

## Testing Requirements

- Minimum 80% test coverage for new code
- All tests must pass: `npm run test:all`
- Write tests for edge cases and error scenarios

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Add description of changes
4. Link to related issues
5. Request review from maintainers

## Reporting Issues

Include:

- **Reproduction steps**
- **Expected behavior**
- **Actual behavior**
- **Environment** (Node version, OS, etc.)
- **Screenshots** if applicable

## Feature Requests

Describe:

- **Use case** — why is this needed?
- **Proposed solution** — how would you implement it?
- **Alternatives considered** — what else did you think of?

## Questions?

Open a GitHub Discussion or issue with label `question`.

Thank you for contributing!

---

**Maintained by**: HelloCollab Team  
**Last Updated**: May 19, 2026
