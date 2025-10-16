---
title: Configuration
description: Configure your Podcast Framework project with environment variables and settings
---

# Configuration

This guide covers all configuration options for your Podcast Framework project, including environment variables, Astro configuration, and Sanity setup.

## Environment Variables

Environment variables are stored in a `.env` file in your project root.

### Required Variables

These variables are **required** for the framework to work:

```bash
# Sanity CMS (Required)
PUBLIC_SANITY_PROJECT_ID="your-sanity-project-id"
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_API_VERSION="2024-01-01"

# Site Configuration (Required)
PUBLIC_SITE_URL="http://localhost:4321"
```

:::danger[Important]
`PUBLIC_SANITY_PROJECT_ID` must match your Sanity project ID. Get it from:
```bash
npx sanity projects list
```
:::

### Optional Variables

Add these as needed for additional features:

#### Newsletter (ConvertKit)

```bash
CONVERTKIT_API_KEY="your-api-key"
CONVERTKIT_FORM_ID="your-form-id"
```

**Where to get:**
1. Sign up at [convertkit.com](https://convertkit.com/)
2. API Key: Settings → Advanced → API Secret
3. Form ID: Forms → Select form → Form ID in URL

#### Contribution Emails (Resend)

```bash
RESEND_API_KEY="re_..."
NOTIFICATION_EMAIL="contributions@yourpodcast.com"
```

**Where to get:**
1. Sign up at [resend.com](https://resend.com/)
2. Create API key in dashboard
3. Set notification email to where you want contributions sent

#### Analytics (Google Analytics 4)

```bash
PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Where to get:**
1. Create GA4 property at [analytics.google.com](https://analytics.google.com/)
2. Admin → Data Streams → Web → Measurement ID

#### Error Tracking (Sentry)

```bash
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_ENVIRONMENT="production"
```

**Where to get:**
1. Create project at [sentry.io](https://sentry.io/)
2. Settings → Client Keys (DSN)

#### RSS Import

```bash
RSS_FEED_URL="https://yourpodcast.com/feed.xml"
```

Used by `npm run import:episodes` to import existing episodes.

### Variable Naming

Podcast Framework follows Astro's environment variable conventions:

**Public Variables (accessible in browser):**
```bash
PUBLIC_SANITY_PROJECT_ID="..."
PUBLIC_SITE_URL="..."
PUBLIC_GA_MEASUREMENT_ID="..."
```

**Private Variables (server-only):**
```bash
RESEND_API_KEY="..."
CONVERTKIT_API_KEY="..."
SENTRY_DSN="..."
```

:::caution[Security]
Never expose private variables in client-side code! They're only available in:
- Server-side code (API routes)
- Astro component frontmatter
- Server services
:::

### Environment-Specific Configuration

Use different `.env` files for different environments:

```bash
.env                 # Local development
.env.production      # Production (not committed)
.env.template        # Template (committed to git)
```

**Production deployment:**
1. Don't commit `.env` or `.env.production`
2. Set variables in your hosting platform (Cloudflare, Netlify, etc.)
3. Commit `.env.template` so team knows what's needed

## Astro Configuration

Edit `astro.config.mjs` to configure Astro:

### Basic Configuration

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://yourpodcast.com',
  output: 'static',
  integrations: [tailwind()],
});
```

### Key Options

#### `site`

Your production URL. Required for:
- Sitemap generation
- RSS feeds
- Canonical URLs

```javascript
site: 'https://yourpodcast.com'
```

#### `output`

Rendering mode:

```javascript
// Static Site Generation (recommended)
output: 'static'

// Hybrid: SSG + on-demand rendering
output: 'hybrid'

// Full server-side rendering
output: 'server'
```

:::tip[Recommendation]
Use `'static'` for best performance and simplicity.
:::

#### `build.inlineStylesheets`

Control CSS inlining:

```javascript
build: {
  inlineStylesheets: 'auto' // Auto-inline small CSS files
}
```

Options:
- `'auto'` - Inline small stylesheets automatically
- `'always'` - Inline all stylesheets
- `'never'` - Never inline (separate CSS files)

### Advanced Configuration

#### Custom Base Path

Deploy to a subdirectory:

```javascript
base: '/podcast',
// Site will be at https://yoursite.com/podcast
```

#### Trailing Slashes

```javascript
trailingSlash: 'ignore' // /about or /about/ both work
trailingSlash: 'always' // Always /about/
trailingSlash: 'never'  // Always /about
```

#### Image Optimization

```javascript
image: {
  service: {
    entrypoint: 'astro/assets/services/sharp',
    config: {
      limitInputPixels: false,
    },
  },
}
```

## Tailwind Configuration

Edit `tailwind.config.mjs` to customize Tailwind:

### Default Configuration

```javascript
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@rejected-media/podcast-framework-core/**/*.astro',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

:::danger[Critical]
Always include `./node_modules/@rejected-media/podcast-framework-core/**/*.astro` in content paths!

This ensures Tailwind processes framework components. Without it, framework styles won't work.
:::

### Custom Theme

Extend the default theme:

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        // ... more shades
        900: '#0c4a6e',
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
}
```

### Plugins

Add Tailwind plugins:

```javascript
plugins: [
  require('@tailwindcss/typography'),
  require('@tailwindcss/forms'),
],
```

Install first:
```bash
npm install @tailwindcss/typography @tailwindcss/forms
```

## TypeScript Configuration

Edit `tsconfig.json` for TypeScript settings:

### Recommended Configuration

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

### Path Aliases

Use path aliases for cleaner imports:

```typescript
// Without aliases
import { helper } from '../../../../lib/utils';

// With aliases
import { helper } from '@lib/utils';
```

Configure in `tsconfig.json`:
```json
"paths": {
  "@components/*": ["src/components/*"],
  "@lib/*": ["src/lib/*"],
  "@layouts/*": ["src/layouts/*"]
}
```

## Sanity Configuration

Edit `sanity/sanity.config.ts` for Sanity Studio:

### Basic Configuration

```typescript
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'My Podcast',

  projectId: process.env.PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
```

### Studio Customization

#### Custom Theme

```typescript
import { defineConfig } from 'sanity';

export default defineConfig({
  // ... other config
  theme: {
    fonts: {
      heading: {
        family: 'Inter, sans-serif',
      },
    },
    colors: {
      primary: '#3B82F6',
    },
  },
});
```

#### Custom Document Actions

```typescript
import { defineConfig } from 'sanity';

export default defineConfig({
  // ... other config
  document: {
    actions: (prev, context) => {
      // Customize document actions
      return prev;
    },
  },
});
```

## Script Configuration

Add custom scripts to `package.json`:

### Common Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "dev:sanity": "cd sanity && npx sanity dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "import:episodes": "node scripts/import-episodes.js",
    "init:theme": "node scripts/init-theme.js",
    "upload:photos": "node scripts/upload-guest-photos.js"
  }
}
```

### Custom Scripts

Create scripts in `scripts/` directory:

```javascript
// scripts/my-script.js
import { getPodcast } from '@rejected-media/podcast-framework-core';

async function myScript() {
  const podcast = await getPodcast();
  console.log(podcast);
}

myScript();
```

Run with:
```bash
node scripts/my-script.js
```

## Platform-Specific Configuration

### Cloudflare Pages

Create `_redirects` in `public/`:

```
/api/* /api/:splat 200
/old-page /new-page 301
```

### Netlify

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/old-page"
  to = "/new-page"
  status = 301
```

### Vercel

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

## Performance Configuration

### Optimize Images

```javascript
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
```

### Prefetch Links

```javascript
// astro.config.mjs
export default defineConfig({
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: true,
  },
});
```

### Build Optimization

```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  },
});
```

## Configuration Best Practices

### 1. Never Commit Secrets

Add to `.gitignore`:
```
.env
.env.local
.env.production
```

Commit template:
```
.env.template  # ✅ Safe to commit
```

### 2. Use Environment Variables

Don't hardcode:
```javascript
// ❌ Bad
const API_KEY = 'sk_live_abc123';

// ✅ Good
import { getEnv } from '@rejected-media/podcast-framework-core';
const API_KEY = getEnv('API_KEY');
```

### 3. Document Requirements

Update `.env.template` with all variables:
```bash
# Required for CMS
PUBLIC_SANITY_PROJECT_ID=

# Optional - Newsletter
CONVERTKIT_API_KEY=
CONVERTKIT_FORM_ID=
```

### 4. Validate Configuration

Check variables at build time:

```typescript
// src/lib/config.ts
import { getRequiredEnv } from '@rejected-media/podcast-framework-core';

export const config = {
  sanity: {
    projectId: getRequiredEnv('PUBLIC_SANITY_PROJECT_ID'),
    dataset: getRequiredEnv('PUBLIC_SANITY_DATASET'),
  },
};
```

`getRequiredEnv()` throws if variable is missing.

## Troubleshooting

### "Environment variable not found"

Check `.env` file exists and contains the variable:
```bash
cat .env | grep VARIABLE_NAME
```

### "Sanity client error"

Verify `PUBLIC_SANITY_PROJECT_ID` matches your Sanity project:
```bash
npx sanity projects list
```

### Tailwind styles not working

Ensure `tailwind.config.mjs` includes framework paths:
```javascript
content: [
  './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  './node_modules/@rejected-media/podcast-framework-core/**/*.astro', // ✅ Required
]
```

### Build fails with type errors

Check TypeScript version:
```bash
npm list typescript
```

Update if needed:
```bash
npm install typescript@latest
```

## Next Steps

- **[Components](/components/overview/)** - Learn about framework components
- **[Sanity CMS](/sanity/setup/)** - Set up content management
- **[Deployment](/deployment/cloudflare-pages/)** - Deploy to production
- **[Customization](/customization/theming/)** - Customize your site
