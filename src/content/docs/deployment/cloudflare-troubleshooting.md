---
title: Cloudflare Troubleshooting
description: Complete troubleshooting guide for Cloudflare Pages deployments and common issues
---

# Cloudflare Pages Deployment Troubleshooting Guide

This document captures all issues encountered during the Netlify → Cloudflare migration and their solutions. Use this as a reference for future migrations or when debugging Cloudflare-specific issues.

---

## Issue 1: Environment Variables Not Accessible

### Problem
Environment variables accessed via `import.meta.env` return `undefined` in Cloudflare Workers, causing services to fail with configuration errors.

**Error Message:**
```
Error: Configuration must contain `projectId`
```

### Root Cause
Cloudflare Pages Functions (Workers) don't expose environment variables through `import.meta.env`. They're available through `locals.runtime.env` instead.

### Solution
Access environment variables through the Astro context object:

```typescript
// ❌ WRONG - Doesn't work in Cloudflare Workers
export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.API_KEY; // undefined!
}

// ✅ CORRECT - Works in Cloudflare Workers
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env || import.meta.env;
  const apiKey = env.API_KEY; // Works!
}
```

### Files Affected
- `src/pages/api/contribute.ts`
- `src/pages/api/test.ts`
- Any future API routes

### Prevention
Use the hosting abstraction helper (see Hosting Adapter section below).

---

## Issue 2: Sentry Error Monitoring Incompatibility

### Problem
Sentry's `@sentry/node` package uses Node.js-specific modules (`util`, `async_hooks`, `worker_threads`) that don't exist in Cloudflare's V8 isolates runtime.

**Error Message:**
```
[ERROR] Could not resolve "util"
[ERROR] Could not resolve "async_hooks"
[ERROR] Could not resolve "worker_threads"
```

### Root Cause
Cloudflare Workers run in V8 isolates, not Node.js. Many Node.js APIs are unavailable.

### Solution
Disable Sentry in Cloudflare Workers and use console logging instead:

```typescript
// ❌ WRONG - Fails in Cloudflare Workers
import { initSentry, captureException } from '../../lib/sentry';
initSentry();

// ✅ CORRECT - Conditional error logging
function captureException(error: unknown, context?: any) {
  console.error('[API Error]', error, context);
}
```

### Files Affected
- `src/pages/api/contribute.ts`

### Future Solution
Consider using Cloudflare-compatible error monitoring:
- [Sentry Browser SDK](https://docs.sentry.io/platforms/javascript/) (works in Workers)
- [Cloudflare Workers Analytics](https://developers.cloudflare.com/analytics/workers-analytics/)
- [Axiom](https://axiom.co/) (Cloudflare-native logging)

---

## Issue 3: Module-Level Service Initialization Fails

### Problem
Services initialized at module level (outside request handlers) fail in Cloudflare Workers during cold starts.

**Error Message:**
```
Error: Configuration must contain `projectId`
```

### Root Cause
Environment variables aren't available at module initialization time in Cloudflare Workers. They're only accessible within the request context.

### Solution
Use lazy initialization - create services inside request handlers:

```typescript
// ❌ WRONG - Fails in Cloudflare Workers
const contributionService = new ContributionService({
  apiKey: import.meta.env.API_KEY // undefined at module load time
});

export const POST: APIRoute = async ({ request }) => {
  await contributionService.submit(...);
}

// ✅ CORRECT - Lazy initialization
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env || import.meta.env;

  const contributionService = new ContributionService({
    apiKey: env.API_KEY // Available at request time
  });

  await contributionService.submit(...);
}
```

### Files Affected
- `src/pages/api/contribute.ts`

### Performance Consideration
Lazy initialization means services are created on every request. For high-traffic endpoints, consider:
- Implementing service caching (with cache invalidation)
- Using Cloudflare Durable Objects for stateful services

---

## Issue 4: DOMPurify Window Undefined During Build

### Problem
`isomorphic-dompurify` package tries to access `window` object during SSR/build, causing build failures.

**Error Message:**
```
window is not defined
```

### Root Cause
DOMPurify is designed for browser environments. Even the "isomorphic" version can fail during SSR if not properly handled.

### Solution
Conditional loading with fallback sanitization:

```typescript
// ❌ WRONG - Fails during SSR
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html);
}

// ✅ CORRECT - Conditional with fallback
let DOMPurify: any = null;
if (typeof window !== 'undefined') {
  import('isomorphic-dompurify').then(module => {
    DOMPurify = module.default;
  });
}

export function sanitizeHTML(html: string): string {
  // Server-side: use regex-based sanitization
  if (typeof window === 'undefined' || !DOMPurify) {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');
  }

  // Client-side: use DOMPurify
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  });
}
```

### Files Affected
- `src/lib/utils.ts`

---

## Issue 5: Functions Directory Auto-Detection

### Problem
Cloudflare Pages auto-detects `/functions` directory and attempts to build files as Cloudflare Workers, causing build failures when the code uses Node.js APIs.

**Error Message:**
```
✘ [ERROR] Could not resolve "util"
✘ [ERROR] Could not resolve "async_hooks"
```

### Root Cause
Cloudflare Pages has special handling for `/functions` directory - it automatically builds them as Workers using esbuild, which fails for Node.js-specific code.

### Solution
Rename platform-specific function directories:

```bash
# Netlify-specific functions
/functions-netlify/
  contribute.ts
  newsletter-subscribe.ts

# Cloudflare-specific functions (if needed)
/functions-cloudflare/
  contribute.ts

# Platform-agnostic API routes (recommended)
/src/pages/api/
  contribute.ts  # Works on both Netlify and Cloudflare
```

### Files Affected
- `/functions` → `/functions-netlify`

### Recommendation
Use Astro API routes (`/src/pages/api`) instead of platform-specific functions. They work on both Netlify and Cloudflare.

---

## Issue 6: Build Output Mode Configuration

### Problem
Pure SSG mode (`output: 'static'`) doesn't support API routes, causing 404 errors for serverless endpoints.

### Root Cause
API routes require server-side rendering capabilities. Pure static mode pre-renders everything at build time.

### Solution
Switch to `server` mode with prerendering:

```typescript
// astro.config.mjs
export default defineConfig({
  output: 'server', // Enable server mode
  adapter: cloudflare({ imageService: 'compile' }),
  // ... other config
});
```

Then add `export const prerender = true` to all static pages:

```typescript
// src/pages/index.astro
---
export const prerender = true; // Pre-render this page at build time

import BaseLayout from "../layouts/BaseLayout.astro";
// ... rest of page
---
```

### Files Affected
- `astro.config.mjs`
- All `.astro` pages in `src/pages/`

### Build Artifacts
Cloudflare generates `_routes.json` to route requests:
```json
{
  "version": 1,
  "include": ["/api/*"],  // Serverless routes
  "exclude": ["/", "/episodes/*", "/about"]  // Static routes
}
```

---

## Issue 7: Email Configuration - FROM vs TO Address

### Problem
Email notifications were being sent to the FROM address instead of the recipient, because `NOTIFICATION_EMAIL` was incorrectly set to the same value as `RESEND_FROM_EMAIL`.

**Symptom:**
Resend shows email as "Sent" but it never arrives in inbox.

### Root Cause
Poor naming and documentation led to confusion about which email goes where:
- `RESEND_FROM_EMAIL`: The sender address (must be verified domain)
- `NOTIFICATION_EMAIL`: The recipient address (where notifications should go)

### Solution
Clear documentation and examples:

```bash
# ✅ CORRECT Configuration
RESEND_FROM_EMAIL=contribution@noreply.strangewater.xyz  # FROM address (no-reply)
NOTIFICATION_EMAIL=swrequests@rexkirshner.com            # TO address (your inbox)

# ❌ WRONG - Emails sent to themselves
RESEND_FROM_EMAIL=contribution@noreply.strangewater.xyz
NOTIFICATION_EMAIL=contribution@noreply.strangewater.xyz
```

### Files Affected
- `.env.example`
- `CLOUDFLARE_DEPLOYMENT.md`
- API route default values

### Prevention
- Use descriptive variable names
- Add clear comments in `.env.example`
- Include examples in deployment docs

---

## Issue 8: Sanity Studio Cloud Deployment Issues

### Problem 1: Missing React Dependencies

**Error Message:**
```
Error: Cannot find module 'react/jsx-runtime'
Module not found: Can't resolve 'react-dom'
```

#### Root Cause
Sanity Studio v3+ requires `react` and `react-dom` as peer dependencies, but these aren't always included in project dependencies by default.

#### Solution
Add React dependencies to `package.json`:

```bash
npm install react react-dom
```

Or in package.json:
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "sanity": "^3.0.0"
  }
}
```

#### Files Affected
- `package.json`

#### Prevention
- CLI v0.1.1+ automatically includes React dependencies
- Template repository includes React dependencies by default

---

### Problem 2: Environment Variables Not Available in Cloud Studio

**Error Message:**
```json
{
  "error": {
    "message": "Configuration must contain `projectId`"
  }
}
```

When visiting your deployed Studio at `https://your-podcast.sanity.studio`

#### Root Cause
Cloud-deployed Sanity Studios don't have access to environment variables (`process.env`). The configuration is bundled at build time, so references to `process.env.SANITY_PROJECT_ID` resolve to empty strings.

#### Solution
Replace environment variables with hardcoded values in `sanity.config.ts`:

```typescript
// ❌ WRONG - Doesn't work in cloud deployment
export default defineConfig({
  projectId: process.env.SANITY_PROJECT_ID || '',  // Empty string in cloud!
  dataset: process.env.SANITY_DATASET || 'production',
  // ...
});

// ✅ CORRECT - Hardcoded for cloud deployment
export default defineConfig({
  projectId: 'abc123xyz',  // Your actual project ID
  dataset: 'production',
  // ...
});
```

**For local development with environment variables:**

Keep the template version with env vars and add a warning comment:

```typescript
export default defineConfig({
  name: 'default',
  title: 'My Podcast',

  // IMPORTANT: For cloud deployment to sanity.studio, replace
  // process.env variables with actual hardcoded values
  // Example: projectId: 'abc123xyz',
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',

  // ...
});
```

#### Files Affected
- `sanity.config.ts` (at project root)

#### Prevention
- Document cloud deployment requirements clearly
- Consider maintaining separate configs for local vs cloud deployment
- Add validation to check for empty project IDs

---

### Problem 3: Deployment Warnings - Missing App ID

**Warning Message:**
```
✗ Failed to load configuration file "/path/to/sanity.config.ts"
⚠ Configuration file not found
```

During `npm run sanity:deploy` even though deployment succeeds.

#### Root Cause
Missing `deployment.appId` in `sanity.cli.ts`. The CLI generates an app ID on first deployment but shows warnings if not configured.

#### Solution
Add deployment app ID to `sanity.cli.ts`:

```typescript
// Basic configuration (shows warnings)
export default defineCliConfig({
  api: {
    projectId: "abc123xyz",
    dataset: "production",
  },
});

// ✅ CORRECT - With deployment app ID (no warnings)
export default defineCliConfig({
  api: {
    projectId: "abc123xyz",
    dataset: "production",
  },
  deployment: {
    appId: "mec0q2oma8400ku8",  // Get this from first deployment output
  },
});
```

**How to get your app ID:**
1. Run `npm run sanity:deploy` the first time
2. Look for the app ID in the output:
   ```
   deployment: {
     appId: "mec0q2oma8400ku8"
   }
   ```
3. Add it to your `sanity.cli.ts`

#### Files Affected
- `sanity.cli.ts` (at project root)

#### Prevention
- CLI v0.1.1+ generates `sanity.cli.ts` with placeholder comments
- Run initial deployment and capture the app ID immediately

---

### Complete Sanity Setup Checklist

For successful Sanity Studio cloud deployment:

- [ ] Install React dependencies (`react`, `react-dom`)
- [ ] Replace `process.env` variables with hardcoded values in `sanity.config.ts`
- [ ] Create `sanity.cli.ts` with project ID and dataset
- [ ] Run `npm run sanity:deploy` to get deployment app ID
- [ ] Add deployment app ID to `sanity.cli.ts`
- [ ] Verify Studio accessible at `https://your-podcast.sanity.studio`
- [ ] Test creating and editing content in cloud Studio

---

## Platform Differences Summary

| Feature | Netlify | Cloudflare Pages |
|---------|---------|------------------|
| **Environment Variables** | `process.env.*` | `locals.runtime.env.*` |
| **Serverless Functions** | `/functions/*.ts` | `/src/pages/api/*.ts` (Astro) |
| **Runtime** | Node.js | V8 Isolates (limited Node.js) |
| **Error Monitoring** | Sentry (full support) | Console logs / Browser SDK |
| **Build Mode** | `output: 'static'` | `output: 'server'` + prerender |
| **Cold Start** | ~200ms | ~5ms |
| **Function Timeout** | 10s (free) / 26s (pro) | 30s (free) |
| **Available Node APIs** | All | Limited subset |

---

## Debugging Tips

### 1. Check Cloudflare Function Logs
1. Go to Cloudflare Dashboard
2. Click your Pages project
3. Go to Functions tab
4. Click "Real-time Logs" or view logs from recent deployments

### 2. Test API Endpoints Locally
```bash
# Build for Cloudflare
npm run build

# The build output shows which routes are static vs serverless
# Check dist/_routes.json for routing configuration
```

### 3. Use Test Endpoints
Create simple test endpoints to verify environment variables:

```typescript
// src/pages/api/test.ts
export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env || import.meta.env;

  return new Response(JSON.stringify({
    hasApiKey: !!env.API_KEY,
    platform: env.CF_PAGES ? 'cloudflare' : 'other'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### 4. Check Build Output
Look for warnings during build:
```bash
npm run build 2>&1 | grep -E "(WARN|ERROR)"
```

---

## Migration Checklist

When migrating to a new hosting platform, verify:

- [ ] Environment variables are accessible in the new runtime
- [ ] All Node.js dependencies are compatible with the platform
- [ ] Service initialization happens at the right time (module vs request)
- [ ] Error monitoring is configured for the platform
- [ ] Email configuration uses correct FROM/TO addresses
- [ ] API routes are accessible and routed correctly
- [ ] Build mode supports both static pages and serverless functions
- [ ] Test all forms and interactive features
- [ ] Check logs for any runtime errors

---

**Last Updated:** 2025-10-16
**Migration:** Netlify → Cloudflare Pages + Sanity Studio Cloud Deployment
**Status:** ✅ Resolved
