---
title: Overview
description: Learn about Podcast Framework and what makes it special
---

# Podcast Framework Overview

Podcast Framework is a modern, production-ready framework for building beautiful podcast websites. Built on Astro, TypeScript, and Sanity CMS, it provides everything you need to launch a professional podcast site in minutes.

## What is Podcast Framework?

Podcast Framework is an **NPM-based framework** that provides:

- **Pre-built Components** - 8 production-ready components (Header, Footer, Newsletter, Search, etc.)
- **Page Templates** - Complete templates for episodes, guests, about, and contribution pages
- **CMS Integration** - Sanity CMS with pre-configured schemas for episodes, guests, and hosts
- **Type Safety** - Full TypeScript support with strict mode enabled
- **Multi-Platform** - Deploy to Cloudflare Pages, Netlify, or Vercel without platform-specific code
- **Extensibility** - Override any component, extend schemas, customize themes

## Philosophy

### 1. Convention over Configuration

Podcast Framework provides sensible defaults that work out of the box, but allows customization when needed:

```typescript
// Works immediately
import { getEpisodes } from '@rejected-media/podcast-framework-core';
const episodes = await getEpisodes();

// Customize when needed
import { getAllEpisodes } from '@rejected-media/podcast-framework-core';
const episodes = await getAllEpisodes(client, { orderBy: 'asc' });
```

### 2. Override Anything

Don't like a component? Create your own with the same name in your project:

```
my-podcast/
├── src/
│   └── components/
│       └── Header.astro  <-- Your custom header
└── node_modules/
    └── @rejected-media/podcast-framework-core/
        └── components/
            └── Header.astro  <-- Framework header (ignored)
```

The framework automatically detects and uses your version.

### 3. CMS-Driven Design

Configuration lives in Sanity CMS, not in code:

- **Theme** - Colors, fonts, and layout configured in Sanity
- **Navigation** - Menu items managed in CMS
- **Homepage** - Sections configured visually
- **About Page** - Content managed in CMS

This means non-developers can manage the site without touching code.

### 4. Platform Agnostic

The hosting adapter pattern means your code works everywhere:

```typescript
import { getEnv } from '@rejected-media/podcast-framework-core';

// Works on Cloudflare, Netlify, Vercel, and more
const apiKey = getEnv('API_KEY');
```

No `process.env`, no `import.meta.env` - just platform-agnostic code.

## Architecture

### NPM Package Pattern

Podcast Framework lives in `node_modules/@rejected-media/podcast-framework-`, not in your source code:

- **Upgrades** - `npm update` to get new features
- **No Merge Conflicts** - Your code stays separate
- **Type Safety** - Full TypeScript support via declaration files
- **Semantic Versioning** - Clear versioning (`0.1.0`, `0.2.0`, etc.)

### Four Packages

1. **@rejected-media/podcast-framework-core** - Components, utilities, helpers
2. **@rejected-media/podcast-framework-sanity-schema** - Sanity CMS schemas
3. **@rejected-media/podcast-framework-cli** - Command-line tool for project management
4. **@rejected-media/create-podcast-framework** - NPM create wrapper for scaffolding

### Component Resolution

The framework uses a clever resolution system:

1. Check `src/components/ComponentName.astro` (your override)
2. If not found, use `@rejected-media/podcast-framework-core/components/ComponentName.astro`

This happens automatically at build time using Astro's `import.meta.glob`.

## What's Included

### Components (8 total)

- **Header** - Navigation with mobile menu and theme toggle
- **Footer** - Social links, newsletter, and custom sections
- **NewsletterSignup** - Email subscription with spam protection
- **EpisodeSearch** - Client-side search with fuzzy matching
- **TranscriptViewer** - Collapsible transcript with timestamps
- **FeaturedEpisodesCarousel** - Auto-progressing episode carousel
- **SkeletonLoader** - Loading placeholders (4 variants)
- **BlockContent** - Sanity portable text renderer

### Page Templates (8 total)

- **Homepage** - Hero, featured episodes, recent episodes
- **Episodes Archive** - All episodes with search
- **Individual Episode** - Spotify player, transcript, show notes
- **Guests Directory** - All guests with photos
- **Guest Profile** - Bio, social links, all episodes
- **About** - CMS-configurable about page
- **Contribute** - Community contribution form
- **404** - Custom error page

### Utilities

- **Date Formatting** - `formatDate()`, `parseDuration()`
- **Text Utilities** - `slugify()`, `truncate()`, `stripHTML()`
- **Theme System** - `generateThemeCSS()`, `mergeTheme()`
- **Sanity Helpers** - `getEpisodes()`, `getPodcast()`, `getGuests()`
- **Static Paths** - `getStaticPathsForEpisodes()`, `getStaticPathsForGuests()`
- **Hosting Adapter** - `getEnv()`, `detectPlatform()`, `getClientIP()`

### Server Services

- **ContributionService** - Handle community contributions
- **NewsletterService** - Manage newsletter subscriptions
- **Error Tracking** - Sentry integration (optional)

## Battle-Tested

Podcast Framework powers **Strange Water**, a production podcast with:

- 69 episodes
- 72 guests
- 65 guest photos
- Thousands of visitors per month
- Zero downtime since launch

## Next Steps

Ready to build your podcast site?

1. **[Quick Start](/getting-started/quick-start/)** - Get running in 10 minutes
2. **[Installation](/getting-started/installation/)** - Detailed setup guide
3. **[Components](/components/overview/)** - Explore the components
4. **[Deployment](/deployment/cloudflare-pages/)** - Go live

## Questions?

- [GitHub Discussions](https://github.com/rejected-media/podcast-framework/discussions)
- [GitHub Issues](https://github.com/rejected-media/podcast-framework/issues)
- [Contributing Guide](/contributing/guidelines/)
