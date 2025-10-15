---
title: Contributing Guidelines
description: How to contribute to Podcast Framework
---

# Contributing Guidelines

Thank you for your interest in contributing to Podcast Framework! This guide explains how to contribute code, documentation, and ideas.

## Ways to Contribute

### 1. Report Bugs

Found a bug? Report it on GitHub:

1. Check [existing issues](https://github.com/podcast-framework/podcast-framework/issues)
2. If not found, create new issue
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (OS, Node version, package versions)
   - Screenshots/error messages

### 2. Suggest Features

Have an idea? Create a feature request:

1. Check [discussions](https://github.com/podcast-framework/podcast-framework/discussions)
2. Create new discussion in "Ideas" category
3. Explain:
   - Problem you're solving
   - Proposed solution
   - Use cases
   - Why it benefits the community

### 3. Contribute Code

Submit pull requests:

1. Fork repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes
4. Add tests
5. Ensure tests pass: `npm test`
6. Commit: `git commit -m "feat: add feature"`
7. Push: `git push origin feature/my-feature`
8. Create pull request

### 4. Improve Documentation

Documentation improvements welcome:

1. Fork [podcast-framework-docs](https://github.com/podcast-framework/podcast-framework-docs)
2. Make changes to `.md` files
3. Test locally: `npm run dev`
4. Create pull request

### 5. Help Others

Answer questions in:
- [GitHub Discussions](https://github.com/podcast-framework/podcast-framework/discussions)
- [GitHub Issues](https://github.com/podcast-framework/podcast-framework/issues)

## Development Setup

### Clone Repository

```bash
git clone https://github.com/podcast-framework/podcast-framework.git
cd podcast-framework
```

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Build Packages

```bash
npm run build
```

### Link Locally

Test changes in your podcast:

```bash
# In podcast-framework
npm link

# In your podcast
npm link @podcast-framework/core
```

## Code Standards

### TypeScript

- Use strict mode
- Add types for all functions
- Avoid `any` type

```typescript
// ✅ Good
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

// ❌ Bad
function formatDate(date: any): any {
  return new Date(date).toLocaleDateString();
}
```

### Naming Conventions

- **Components:** PascalCase (`Header.astro`)
- **Functions:** camelCase (`formatDate()`)
- **Files:** kebab-case (`sanity-helpers.ts`)
- **Types:** PascalCase (`Episode`, `Theme`)

### Documentation

Add JSDoc comments:

```typescript
/**
 * Format date to human-readable string
 *
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date
 *
 * @example
 * ```typescript
 * formatDate('2024-01-15') // "January 15, 2024"
 * ```
 */
export function formatDate(dateString: string, locale = 'en-US'): string {
  // ...
}
```

### Testing

Add tests for new features:

```typescript
import { describe, test, expect } from 'vitest';
import { formatDate } from '../src/lib/utils';

describe('formatDate', () => {
  test('formats ISO dates', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
  });

  test('supports locales', () => {
    expect(formatDate('2024-01-15', 'es-ES')).toBe('15 de enero de 2024');
  });
});
```

## Commit Messages

Use conventional commits:

```
feat: add episode search component
fix: correct date formatting bug
docs: update installation guide
test: add utils test coverage
refactor: simplify theme generation
chore: update dependencies
```

**Format:**
```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `chore` - Maintenance

## Pull Request Process

1. **Fork** repository
2. **Create branch** from `main`
3. **Make changes**
4. **Add tests** for new features
5. **Run tests:** `npm test`
6. **Build:** `npm run build`
7. **Commit** with conventional commit message
8. **Push** to your fork
9. **Create pull request**
10. **Address review feedback**

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor

## Testing
- [ ] All tests pass
- [ ] Added tests for new features
- [ ] Tested manually

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Code Review

All PRs require review before merging:

- **Automated:** Tests must pass
- **Manual:** Code review by maintainer
- **Timeline:** Usually within 2-3 days

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Ask in [GitHub Discussions](https://github.com/podcast-framework/podcast-framework/discussions).

## Related

- **[Development Setup](/contributing/development-setup/)** - Detailed setup guide
- **[Roadmap](/contributing/roadmap/)** - Future plans
- **[Changelog](/contributing/changelog/)** - Version history

## Thank You!

Every contribution helps make Podcast Framework better for everyone. Thank you for your support!
