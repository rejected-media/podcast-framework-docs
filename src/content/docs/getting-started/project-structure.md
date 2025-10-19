---
title: Project Structure
description: Understanding the file structure of a Podcast Framework project
---

# Project Structure

This guide explains the file structure of a Podcast Framework project and what each directory and file does.

## Overview

A typical Podcast Framework project looks like this:

```
my-podcast/
├── src/
│   ├── components/          # Your custom components (optional)
│   ├── pages/              # Page templates
│   │   ├── episodes/       # Episode pages
│   │   ├── guest/          # Guest profile pages
│   │   ├── guests/         # Guest directory
│   │   ├── api/            # API routes
│   │   ├── about.astro     # About page
│   │   ├── contribute.astro # Contribution form
│   │   ├── index.astro     # Homepage
│   │   └── 404.astro       # Error page
│   └── env.d.ts            # TypeScript environment types
├── sanity/
│   ├── schemas/            # Sanity schema definitions
│   └── sanity.config.ts    # Sanity configuration
├── public/                 # Static assets
├── node_modules/
│   └── @podcast-framework/ # Framework packages
│       ├── core/           # Components, utilities, helpers
│       └── sanity-schema/  # Sanity CMS schemas
├── .env                    # Environment variables (local)
├── .env.template           # Environment variable template
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.mjs     # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Key Directories

### `src/pages/`

Contains all page templates. Astro uses file-based routing:

```
src/pages/
├── index.astro              → /
├── about.astro              → /about
├── contribute.astro         → /contribute
├── episodes/
│   ├── index.astro          → /episodes
│   └── [slug].astro         → /episodes/episode-1, /episodes/episode-2, etc.
├── guests/
│   └── index.astro          → /guests
├── guest/
│   └── [slug].astro         → /guest/vitalik-buterin, etc.
└── api/
    ├── contribute.ts        → /api/contribute
    └── newsletter-subscribe.ts → /api/newsletter-subscribe
```

**Dynamic Routes:**
- `[slug].astro` creates dynamic routes
- Use `getStaticPaths()` to generate pages at build time
- Framework provides helpers like `getStaticPathsForEpisodes()`

### `src/components/`

Your custom component overrides. When you create a component here with the same name as a framework component, your version is used automatically.

**Example:**

```
src/components/
└── Header.astro  ← Your custom header (overrides framework)

node_modules/@rejected-media/podcast-framework-core/components/
└── Header.astro  ← Framework header (ignored when override exists)
```

This works for any framework component:
- Header.astro
- Footer.astro
- NewsletterSignup.astro
- EpisodeSearch.astro
- TranscriptViewer.astro
- FeaturedEpisodesCarousel.astro
- SkeletonLoader.astro
- BlockContent.astro

### `sanity/`

Sanity CMS configuration and schemas:

```
sanity/
├── schemas/
│   ├── index.ts              # Schema exports
│   ├── episode.ts            # Episode schema
│   ├── guest.ts              # Guest schema
│   ├── host.ts               # Host schema
│   ├── podcast.ts            # Podcast metadata schema
│   ├── theme.ts              # Theme configuration schema
│   ├── homepageConfig.ts     # Homepage configuration schema
│   ├── aboutPageConfig.ts    # About page configuration schema
│   └── contribution.ts       # Contribution schema
└── sanity.config.ts          # Sanity Studio configuration
```

**Key Files:**
- `sanity.config.ts` - Configure Sanity Studio appearance and behavior
- `schemas/index.ts` - Register all schemas

### `node_modules/@rejected-media/podcast-framework-`

Framework packages installed via npm. **Don't edit these files directly** - they'll be overwritten on `npm install`.

**Packages:**

1. **@rejected-media/podcast-framework-core** - Main package
   ```
   core/
   ├── components/     # 8 pre-built Astro components
   ├── layouts/        # BaseLayout
   ├── lib/
   │   ├── utils.ts           # Utilities (formatDate, slugify, etc.)
   │   ├── theme.ts           # Theme system
   │   ├── sanity.ts          # Sanity CMS queries
   │   ├── sanity-helpers.ts  # Auto-configured helpers
   │   ├── static-paths.ts    # getStaticPaths helpers
   │   ├── hosting-adapter.ts # Platform abstraction
   │   └── types.ts           # TypeScript types
   └── server/
       └── services/          # ContributionService, NewsletterService
   ```

2. **@rejected-media/podcast-framework-sanity-schema** - Sanity schemas
   ```
   sanity-schema/
   ├── schemas/       # Episode, Guest, Host, etc.
   └── index.ts       # Schema exports
   ```

### `public/`

Static files served directly. Don't import these in your code - reference them by path.

```
public/
├── favicon.svg
├── robots.txt
└── sitemap.xml
```

**Access in HTML:**
```html
<img src="/favicon.svg" alt="Logo" />
```

## Key Files

### `.env`

Environment variables for local development. **Never commit this file!**

```bash
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID="abc123"
PUBLIC_SANITY_DATASET="production"

# Email Services
RESEND_API_KEY="re_..."
CONVERTKIT_API_KEY="..."

# Analytics
PUBLIC_GA_MEASUREMENT_ID="G-..."
```

### `.env.template`

Template for environment variables. **Commit this** so others know what variables are needed.

```bash
# Sanity CMS (Required)
PUBLIC_SANITY_PROJECT_ID="your-project-id"

# Email (Optional)
RESEND_API_KEY="your-resend-api-key"
```

### `astro.config.mjs`

Astro configuration:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://yourpodcast.com', // For sitemap generation
});
```

**Key Options:**
- `output: 'static'` - Static site generation (SSG)
- `output: 'hybrid'` - SSG + on-demand rendering
- `site` - Your production URL (for sitemap)

### `package.json`

Dependencies and scripts:

```json
{
  "name": "my-podcast",
  "scripts": {
    "dev": "astro dev",
    "dev:sanity": "cd sanity && npx sanity dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "import:episodes": "podcast-framework import-rss"
  },
  "dependencies": {
    "@rejected-media/podcast-framework-cli": "^0.1.20",
    "@rejected-media/podcast-framework-core": "^0.1.2",
    "@rejected-media/podcast-framework-sanity-schema": "^1.1.0",
    "@astrojs/tailwind": "^5.1.0",
    "astro": "^5.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "resend": "^4.0.0",
    "sanity": "^4.0.0",
    "@sanity/client": "^6.0.0",
    "styled-components": "^6.1.15",
    "tailwindcss": "^3.4.0"
  }
}
```

### `tsconfig.json`

TypeScript configuration. Uses Astro's strict config:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### `tailwind.config.mjs`

Tailwind CSS configuration:

```javascript
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@rejected-media/podcast-framework-core/**/*.astro',
  ],
  theme: {
    extend: {},
  },
};
```

**Important:** Include `node_modules/@rejected-media/podcast-framework-core/**/*.astro` so Tailwind processes framework components.

## Where Things Live

### Framework Code

**Location:** `node_modules/@rejected-media/podcast-framework-`

**What's there:**
- All framework components
- All utilities and helpers
- Server services
- TypeScript types

**Rule:** Don't edit files here - they're overwritten on install

### Your Code

**Location:** `src/`

**What goes here:**
- Your page templates
- Component overrides
- Custom utilities
- API routes
- Static assets

**Rule:** This is your code - customize freely!

### Content

**Location:** Sanity CMS (cloud)

**What's there:**
- Episodes
- Guests
- Hosts
- Podcast metadata
- Theme configuration
- Page configurations

**Access:** http://localhost:3333 (Sanity Studio)

## Import Patterns

### Framework Imports

```typescript
// Components
import Header from '@rejected-media/podcast-framework-core/components/Header.astro';
import Footer from '@rejected-media/podcast-framework-core/components/Footer.astro';

// Layouts
import BaseLayout from '@rejected-media/podcast-framework-core/layouts/BaseLayout.astro';

// Utilities
import { formatDate, slugify } from '@rejected-media/podcast-framework-core';

// Helpers
import { getEpisodes, getPodcast } from '@rejected-media/podcast-framework-core';

// Server services
import { ContributionService } from '@rejected-media/podcast-framework-core';
```

### Local Imports

```typescript
// Your components
import Header from '../components/Header.astro';

// Your utilities
import { myHelper } from '../lib/utils';
```

### Sanity Schemas

```typescript
import { episodeSchema } from '@rejected-media/podcast-framework-sanity-schema';
```

## File Naming Conventions

### Pages

- **Lowercase with hyphens:** `about-us.astro`, `privacy-policy.astro`
- **Dynamic routes:** `[slug].astro`, `[id].astro`

### Components

- **PascalCase:** `Header.astro`, `EpisodeCard.astro`, `NewsletterSignup.astro`

### Utilities

- **camelCase:** `formatDate.ts`, `sanity-helpers.ts`

### Types

- **PascalCase:** `Episode.ts`, `Guest.ts`

## Common Workflows

### Adding a New Page

1. Create file in `src/pages/`
2. Use BaseLayout for consistent design
3. Import framework helpers as needed

```astro
---
// src/pages/about.astro
import { getPodcast } from '@rejected-media/podcast-framework-core';
import BaseLayout from '@rejected-media/podcast-framework-core/layouts/BaseLayout.astro';

const podcast = await getPodcast();
---

<BaseLayout title="About">
  <h1>About {podcast?.name}</h1>
</BaseLayout>
```

### Overriding a Component

1. Create component in `src/components/` with same name
2. Copy props interface from framework component
3. Customize implementation

```astro
---
// src/components/Header.astro
export interface Props {
  siteName?: string;
}

const { siteName = "My Podcast" } = Astro.props;
---

<header>
  <!-- Your custom header -->
</header>
```

### Adding a Custom Utility

1. Create file in `src/lib/`
2. Export functions
3. Import in pages

```typescript
// src/lib/my-utils.ts
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// src/pages/index.astro
import { formatPrice } from '../lib/my-utils';
```

## Next Steps

- **[Configuration](/getting-started/configuration/)** - Configure environment variables
- **[Components](/components/overview/)** - Learn about framework components
- **[Customization](/customization/component-overrides/)** - Customize components
- **[Sanity CMS](/sanity/setup/)** - Set up content management
