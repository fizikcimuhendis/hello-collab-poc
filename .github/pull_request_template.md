# Pull Request Template

## Description

Please include a summary of the changes and related context.

### Type of Change

- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking)
- [ ] Breaking change
- [ ] Documentation update
- [ ] Test improvement
- [ ] CI/CD enhancement

### Related Issue

Closes #(issue number)

## Changes Made

- [ ] Change 1
- [ ] Change 2
- [ ] Change 3

## Testing

- [ ] Unit tests added/updated
- [ ] All tests pass (`npm run test:all`)
- [ ] Manual testing completed

### Test Results

```bash
npm run validate
# Paste output here
```

## Security & Compliance

- [ ] No hardcoded secrets or credentials
- [ ] No new external dependencies added (or justified)
- [ ] Environment variables properly managed
- [ ] Logging includes no sensitive data

### Security Review

- Does this change introduce any new permissions? If so, justify in PR.
- Does this change access external APIs? If so, confirm least-privilege scopes.

## Documentation

- [ ] README updated (if needed)
- [ ] Code comments added (if needed)
- [ ] Docstrings updated
- [ ] CHANGELOG updated

## Deployment Notes

- [ ] Backward compatible (yes/no)
- [ ] Requires environment variable changes (list below)
- [ ] Requires database changes (describe)
- [ ] Requires manifest update (describe)

### New Environment Variables

```env
# If applicable
NEW_VAR=description
```

## Checklist

- [ ] Code follows project style guidelines (ESLint passes)
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No breaking changes (or documented)

## Additional Notes

Any additional context for reviewers?

---

**Before submitting**: Run `npm run validate` to ensure all checks pass.
