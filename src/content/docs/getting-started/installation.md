---
title: Installation
description: Detailed installation guide for Podcast Framework
---

# Installation

This guide covers installing Podcast Framework in detail, including system requirements, manual setup, and troubleshooting.

## System Requirements

### Required

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm 9+** or **pnpm 8+** or **yarn 1.22+**
- **Git** - [Download](https://git-scm.com/)

### Recommended

- **VS Code** - [Download](https://code.visualstudio.com/)
- **Astro Extension** - [Install](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)

### Account Setup

You'll need accounts for:

1. **Sanity** ([free tier](https://www.sanity.io/)) - Required for CMS
2. **GitHub** ([free](https://github.com/)) - Recommended for deployment
3. **Cloudflare** ([free tier](https://cloudflare.com/)) - Recommended for hosting

Optional services:
- **ConvertKit** ([free tier](https://convertkit.com/)) - Newsletter signups
- **Resend** ([free tier](https://resend.com/)) - Contribution emails
- **Google Analytics** ([free](https://analytics.google.com/)) - Site analytics
- **Sentry** ([free tier](https://sentry.io/)) - Error tracking

## Installation Methods

### Method 1: CLI (Recommended)

The fastest way to get started:

```bash
# Create new project
npm create podcast-framework my-podcast

# Navigate to project
cd my-podcast

# Install dependencies
npm install
```

This uses the [podcast-template](https://github.com/podcast-framework/podcast-template) repository as a starting point.

### Method 2: Clone Template

Clone the template repository directly:

```bash
# Clone template
git clone https://github.com/podcast-framework/podcast-template.git my-podcast

# Navigate to project
cd my-podcast

# Remove git history
rm -rf .git
git init

# Install dependencies
npm install
```

### Method 3: GitHub Template

Use GitHub's template feature:

1. Go to [podcast-template](https://github.com/podcast-framework/podcast-template)
2. Click **"Use this template"**
3. Click **"Create a new repository"**
4. Name your repository
5. Click **"Create repository"**
6. Clone your new repository:

```bash
git clone https://github.com/your-username/your-podcast.git
cd your-podcast
npm install
```

### Method 4: Manual Setup

For advanced users who want full control:

```bash
# Create new Astro project
npm create astro@latest my-podcast

# Navigate to project
cd my-podcast

# Install Podcast Framework packages
npm install @podcast-framework/core @podcast-framework/sanity-schema

# Install peer dependencies
npm install @sanity/client @sanity/cli

# Install Tailwind CSS
npx astro add tailwind

# Create required directories
mkdir -p src/pages/{episodes,guest,guests,api}
mkdir -p src/components
mkdir -p sanity/schemas
```

:::caution[Advanced]
Manual setup requires creating all page templates yourself. The template method is recommended for most users.
:::

## Sanity CMS Setup

### Step 1: Install Sanity CLI

```bash
npm install -g @sanity/cli
```

### Step 2: Initialize Sanity Project

```bash
npx sanity@latest init
```

Answer the prompts:

```
? Create new project? Yes
? Project name: my-podcast
? Use default dataset configuration? Yes
? Output path: ./sanity
? Select project template: Clean project with no predefined schemas
```

:::tip[Save your Project ID]
The CLI will output your Project ID. Save this - you'll need it for the `.env` file!
:::

### Step 3: Deploy Schemas

```bash
cd sanity
npx sanity schema deploy
cd ..
```

This adds all podcast schemas to your Sanity project:
- Episode
- Guest
- Host
- Podcast
- Theme
- Homepage Config
- About Page Config
- Contribution

## Environment Configuration

### Step 1: Create .env File

```bash
cp .env.template .env
```

### Step 2: Required Variables

Add these required variables to `.env`:

```bash
# Sanity CMS (Required)
PUBLIC_SANITY_PROJECT_ID="your-project-id"
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_API_VERSION="2024-01-01"

# Site Configuration (Required)
PUBLIC_SITE_URL="http://localhost:4321"
```

:::danger[Project ID]
Replace `your-project-id` with the actual Project ID from Sanity init!
:::

### Step 3: Optional Variables

Add optional services as needed:

```bash
# Newsletter (Optional - ConvertKit)
CONVERTKIT_API_KEY="your-convertkit-api-key"
CONVERTKIT_FORM_ID="your-form-id"

# Contributions (Optional - Resend)
RESEND_API_KEY="your-resend-api-key"
NOTIFICATION_EMAIL="your@email.com"

# Analytics (Optional - Google Analytics)
PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Error Tracking (Optional - Sentry)
SENTRY_DSN="your-sentry-dsn"

# RSS Import (Optional)
RSS_FEED_URL="https://your-podcast.com/feed.xml"
```

## Verify Installation

### Check Dependencies

```bash
npm list @podcast-framework/core
```

Should output:

```
my-podcast@1.0.0
└── @podcast-framework/core@0.1.0
```

### Start Dev Server

```bash
npm run dev
```

Visit http://localhost:4321 - you should see your podcast homepage!

### Start Sanity Studio

In a new terminal:

```bash
npm run dev:sanity
```

Visit http://localhost:3333 - you should see Sanity Studio!

## Package Versions

Current stable versions:

```json
{
  "dependencies": {
    "@podcast-framework/core": "^0.1.0",
    "@podcast-framework/sanity-schema": "^1.0.0",
    "@sanity/client": "^6.0.0",
    "astro": "^5.0.0"
  }
}
```

## TypeScript Configuration

Podcast Framework requires TypeScript with strict mode. Your `tsconfig.json` should include:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

## Build Configuration

Your `astro.config.mjs` should include:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});
```

## Troubleshooting

### Installation Issues

#### npm install fails

Try using a different package manager:

```bash
# Try pnpm
npm install -g pnpm
pnpm install

# Or try yarn
npm install -g yarn
yarn install
```

#### "ERESOLVE unable to resolve dependency tree"

Use the legacy peer deps flag:

```bash
npm install --legacy-peer-deps
```

#### "Module not found: @podcast-framework/core"

Make sure the package is installed:

```bash
npm install @podcast-framework/core
```

### Sanity Issues

#### "Project not found"

Check your `.env` file - `PUBLIC_SANITY_PROJECT_ID` must match your Sanity project:

```bash
# List your Sanity projects
npx sanity projects list
```

#### "Dataset not found"

Create the production dataset:

```bash
cd sanity
npx sanity dataset create production
cd ..
```

#### "Schema deploy failed"

Make sure you're in the sanity directory:

```bash
cd sanity
npx sanity schema deploy
cd ..
```

### Build Issues

#### "Build failed: Type error"

Check your Node.js version:

```bash
node --version  # Must be v18.0.0 or higher
```

Update if needed:

```bash
# Using nvm
nvm install 18
nvm use 18
```

#### "Cannot find module '...'"

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

#### "Out of memory" during build

Increase Node.js memory:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Port Conflicts

#### Port 4321 already in use

Change the dev server port:

```bash
npm run dev -- --port 3000
```

#### Port 3333 already in use (Sanity)

Change Sanity's port:

```bash
cd sanity
npx sanity dev --port 3334
cd ..
```

## IDE Setup

### VS Code

Recommended extensions:

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  }
}
```

## Updating Podcast Framework

### Update Core Package

```bash
npm update @podcast-framework/core
```

### Update All Packages

```bash
npm update
```

### Check for Updates

```bash
npm outdated
```

### Breaking Changes

Check the [Changelog](/contributing/changelog/) before updating to a new major version.

## Next Steps

Now that you have Podcast Framework installed:

1. **[Project Structure](/getting-started/project-structure/)** - Understand the file layout
2. **[Configuration](/getting-started/configuration/)** - Configure your site
3. **[Quick Start](/getting-started/quick-start/)** - Build your first page
4. **[Components](/components/overview/)** - Learn about the components

## Getting Help

- **[GitHub Discussions](https://github.com/podcast-framework/podcast-framework/discussions)** - Ask questions
- **[GitHub Issues](https://github.com/podcast-framework/podcast-framework/issues)** - Report installation problems
- **[Quick Start](/getting-started/quick-start/)** - Simplified guide
