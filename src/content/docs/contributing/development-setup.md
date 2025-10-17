---
title: Development Setup
description: Set up local development environment for contributing to Podcast Framework
---

# Development Setup

Set up your local environment for contributing to Podcast Framework.

## Prerequisites

- Node.js 18+
- npm 9+
- Git
- VS Code (recommended)

## Clone Repository

```bash
git clone https://github.com/rejected-media/podcast-framework.git
cd podcast-framework
```

## Install Dependencies

```bash
npm install
```

This installs dependencies for all packages in the monorepo.

## Repository Structure

```
podcast-framework/
├── packages/
│   ├── core/                      # @rejected-media/podcast-framework-core
│   ├── sanity-schema/             # @rejected-media/podcast-framework-sanity-schema
│   ├── cli/                       # @rejected-media/podcast-framework-cli
│   └── create-podcast-framework/  # @rejected-media/create-podcast-framework
├── package.json                   # Monorepo config
└── README.md
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests for specific package
cd packages/core
npm test
```

## Building Packages

```bash
# Build all packages
npm run build

# Build specific package
cd packages/core
npm run build
```

## Testing Changes Locally

### Link Packages

```bash
# In podcast-framework/packages/core
npm link

# In your test podcast
npm link @rejected-media/podcast-framework-core
```

Now your test podcast uses your local development version!

### Test Workflow

1. Make changes in `packages/core/`
2. Build: `npm run build`
3. Test in linked podcast: `npm run dev`
4. Verify changes work
5. Write tests
6. Run tests: `npm test`

## Code Style

### ESLint

```bash
npm run lint
```

### Prettier

```bash
npm run format
```

### TypeScript

```bash
npm run type-check
```

## VS Code Setup

### Recommended Extensions

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Running Examples

The template repository serves as an example:

```bash
git clone https://github.com/rejected-media/podcast-template.git
cd podcast-template
npm install
npm run dev
```

## Common Tasks

### Add New Component

1. Create `packages/core/src/components/NewComponent.astro`
2. Add tests: `packages/core/src/components/NewComponent.test.ts`
3. Export in `packages/core/src/index.ts`
4. Build: `npm run build`
5. Test: `npm test`
6. Document in docs

### Add New Utility

1. Add to `packages/core/src/lib/utils.ts`
2. Add tests: `packages/core/src/lib/utils.test.ts`
3. Export in `packages/core/src/index.ts`
4. Build and test

### Update Schema

1. Edit `packages/sanity-schema/src/schemas/[schema].ts`
2. Add tests
3. Build and test
4. Update migration guide if breaking change

## Release Process

Maintainers only:

```bash
# Update version
npm version patch  # or minor, major

# Build
npm run build

# Publish
npm publish
```

## Getting Help

- **Questions:** [GitHub Discussions](https://github.com/rejected-media/podcast-framework/discussions)
- **Bugs:** [GitHub Issues](https://github.com/rejected-media/podcast-framework/issues)
- **Chat:** Discord (coming soon)

## Related

- **[Contributing Guidelines](/contributing/guidelines/)** - Contribution process
- **[Testing](/advanced/testing/)** - Testing guide (coming soon)
- **[Roadmap](/contributing/roadmap/)** - Future plans (coming soon)

## Thank You!

Your contributions make Podcast Framework better for everyone!
