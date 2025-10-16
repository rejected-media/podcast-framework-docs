---
title: Hosting Adapter
description: Platform-agnostic utilities for multi-cloud deployment
---

# Hosting Adapter

The hosting adapter provides platform-agnostic utilities for environment variables, platform detection, and error logging. Write once, deploy anywhere (Cloudflare, Netlify, Vercel).

## Import

```typescript
import {
  detectPlatform,
  getEnv,
  getRequiredEnv,
  getClientIP,
  getPlatformInfo,
  logError
} from '@rejected-media/podcast-framework-core';
```

## Why Use the Hosting Adapter?

### Problem: Platform-Specific Code

Different platforms expose environment variables differently:

```typescript
// ❌ Platform-specific (breaks on other platforms)
const apiKey = process.env.API_KEY;              // Netlify, Vercel
const apiKey = context.locals.runtime.env.API_KEY;  // Cloudflare
```

### Solution: Platform-Agnostic Code

```typescript
// ✅ Works everywhere
import { getEnv } from '@rejected-media/podcast-framework-core';

const apiKey = getEnv('API_KEY', context);
```

**Benefits:**
- ✅ Same code works on all platforms
- ✅ Easy migration between providers
- ✅ No vendor lock-in
- ✅ Testable code

## Functions

### `detectPlatform()`

Detect which hosting platform code is running on.

**Signature:**
```typescript
function detectPlatform(context?: APIContext): HostingPlatform

type HostingPlatform = 'cloudflare' | 'netlify' | 'vercel' | 'local' | 'unknown'
```

**Parameters:**
- `context` - Astro API context (optional)

**Returns:** Platform identifier

**Examples:**
```typescript
import { detectPlatform } from '@rejected-media/podcast-framework-core';

const platform = detectPlatform();
// → "cloudflare" | "netlify" | "vercel" | "local" | "unknown"

if (platform === 'cloudflare') {
  // Cloudflare-specific optimization
}
```

**Usage in API Routes:**
```typescript
// src/pages/api/example.ts
import type { APIRoute } from 'astro';
import { detectPlatform } from '@rejected-media/podcast-framework-core';

export const GET: APIRoute = async (context) => {
  const platform = detectPlatform(context);

  return new Response(JSON.stringify({
    platform,
    message: `Running on ${platform}`
  }));
};
```

### `getEnv()`

Get environment variable with optional fallback.

**Signature:**
```typescript
function getEnv(
  key: string,
  context?: APIContext,
  fallback?: string
): string
```

**Parameters:**
- `key` - Environment variable name
- `context` - Astro API context (required for Cloudflare)
- `fallback` - Default value if not found

**Returns:** Environment variable value or fallback

**Examples:**
```typescript
import { getEnv } from '@rejected-media/podcast-framework-core';

// With fallback
const apiKey = getEnv('API_KEY', context, 'default-key');

// Without fallback (returns empty string if not found)
const optional = getEnv('OPTIONAL_VAR', context);

// Required variable (will be empty if missing)
const required = getEnv('REQUIRED_VAR', context);
```

**Usage in API Routes:**
```typescript
// src/pages/api/newsletter-subscribe.ts
import type { APIRoute } from 'astro';
import { getEnv } from '@rejected-media/podcast-framework-core';

export const POST: APIRoute = async (context) => {
  const apiKey = getEnv('CONVERTKIT_API_KEY', context);
  const formId = getEnv('CONVERTKIT_FORM_ID', context);

  if (!apiKey || !formId) {
    return new Response('Newsletter not configured', { status: 500 });
  }

  // Use apiKey and formId...
};
```

### `getRequiredEnv()`

Get multiple required environment variables with validation.

**Signature:**
```typescript
function getRequiredEnv(
  keys: string[],
  context?: APIContext
): Record<string, string>
```

**Parameters:**
- `keys` - Array of required variable names
- `context` - Astro API context (required for Cloudflare)

**Returns:** Object with all variables

**Throws:** Error if any variables are missing

**Examples:**
```typescript
import { getRequiredEnv } from '@rejected-media/podcast-framework-core';

// Get multiple variables (throws if missing)
const { API_KEY, API_SECRET, PROJECT_ID } = getRequiredEnv(
  ['API_KEY', 'API_SECRET', 'PROJECT_ID'],
  context
);

// Use variables
const config = {
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  projectId: PROJECT_ID
};
```

**Error Handling:**
```typescript
try {
  const env = getRequiredEnv(['API_KEY', 'API_SECRET'], context);
} catch (error) {
  console.error(error.message);
  // → "Missing required environment variables: API_KEY, API_SECRET"
}
```

**Usage in Services:**
```typescript
// src/pages/api/contribute.ts
import type { APIRoute } from 'astro';
import { getRequiredEnv, ContributionService } from '@rejected-media/podcast-framework-core';

export const POST: APIRoute = async (context) => {
  try {
    const env = getRequiredEnv([
      'PUBLIC_SANITY_PROJECT_ID',
      'PUBLIC_SANITY_DATASET',
      'SANITY_API_TOKEN',
      'RESEND_API_KEY',
      'NOTIFICATION_EMAIL'
    ], context);

    const service = new ContributionService({
      sanityProjectId: env.PUBLIC_SANITY_PROJECT_ID,
      sanityDataset: env.PUBLIC_SANITY_DATASET,
      sanityApiToken: env.SANITY_API_TOKEN,
      resendApiKey: env.RESEND_API_KEY,
      notificationEmail: env.NOTIFICATION_EMAIL,
      resendFromEmail: 'noreply@yourpodcast.com'
    });

    // ... handle contribution
  } catch (error) {
    return new Response('Configuration error', { status: 500 });
  }
};
```

### `getClientIP()`

Get client IP address in a platform-agnostic way.

**Signature:**
```typescript
function getClientIP(context: APIContext): string
```

**Parameters:**
- `context` - Astro API context (required)

**Returns:** Client IP address

**Examples:**
```typescript
import { getClientIP } from '@rejected-media/podcast-framework-core';

export const POST: APIRoute = async (context) => {
  const clientIP = getClientIP(context);
  // → "192.168.1.1" or "2001:0db8:..."

  console.log(`Request from ${clientIP}`);
};
```

**Platform Detection:**
```typescript
// Tries in order:
// 1. cf-connecting-ip header (Cloudflare)
// 2. x-forwarded-for header (Netlify, Vercel, proxies)
// 3. clientAddress property (Astro built-in)
// 4. 'unknown' fallback
```

**Usage - Rate Limiting:**
```typescript
import { getClientIP } from '@rejected-media/podcast-framework-core';

const rateLimits = new Map<string, number>();

export const POST: APIRoute = async (context) => {
  const ip = getClientIP(context);
  const requests = rateLimits.get(ip) || 0;

  if (requests > 10) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  rateLimits.set(ip, requests + 1);
  // ... handle request
};
```

### `getPlatformInfo()`

Get comprehensive platform context information.

**Signature:**
```typescript
function getPlatformInfo(context?: APIContext): {
  platform: HostingPlatform;
  isDevelopment: boolean;
  isProduction: boolean;
  region: string;
  deploymentId: string;
}
```

**Parameters:**
- `context` - Astro API context (optional)

**Returns:** Platform metadata object

**Examples:**
```typescript
import { getPlatformInfo } from '@rejected-media/podcast-framework-core';

const info = getPlatformInfo(context);

console.log(info);
// {
//   platform: 'cloudflare',
//   isDevelopment: false,
//   isProduction: true,
//   region: 'us-east-1',
//   deploymentId: 'abc123def456'
// }
```

**Usage - Conditional Features:**
```typescript
export const POST: APIRoute = async (context) => {
  const { platform, isDevelopment } = getPlatformInfo(context);

  if (isDevelopment) {
    // Skip email in development
    console.log('Email would be sent:', emailData);
    return new Response('OK (dev mode)');
  }

  if (platform === 'cloudflare') {
    // Use Cloudflare-specific features
  }

  // ... normal processing
};
```

### `logError()`

Platform-agnostic error logging with optional Sentry integration.

**Signature:**
```typescript
function logError(
  error: unknown,
  context?: Record<string, any>,
  apiContext?: APIContext
): void
```

**Parameters:**
- `error` - Error to log
- `context` - Additional context (tags, extra data)
- `apiContext` - Astro API context (optional)

**Returns:** void (logs to console and Sentry if configured)

**Examples:**
```typescript
import { logError } from '@rejected-media/podcast-framework-core';

try {
  await riskyOperation();
} catch (error) {
  logError(error, {
    tags: { function: 'newsletter-subscribe', operation: 'submit' },
    extra: { email: userEmail }
  }, context);

  return new Response('Internal error', { status: 500 });
}
```

**Logging Behavior:**

**Console (Always):**
```javascript
// Cloudflare/Netlify: JSON structured logging
console.error('[Error]', {
  platform: 'cloudflare',
  error: 'API call failed',
  stack: '...',
  tags: { function: 'newsletter-subscribe' },
  extra: { email: 'user@example.com' }
});

// Local/Other: Object logging
console.error('[Error]', { ... });
```

**Sentry (If Configured):**
```typescript
// Automatically sends to Sentry if initialized
captureException(error, {
  tags: context?.tags,
  extra: context?.extra,
  level: 'error'
});
```

## Platform Detection Details

### Detection Logic

```typescript
// 1. Check for Cloudflare Cache API
if (typeof globalThis.caches !== 'undefined') {
  return 'cloudflare';
}

// 2. Check environment variables
if (env.CF_PAGES === '1' || env.CF_PAGES_BRANCH) {
  return 'cloudflare';
}

if (env.NETLIFY === 'true' || env.NETLIFY_DEV === 'true') {
  return 'netlify';
}

if (env.VERCEL === '1' || env.VERCEL_ENV) {
  return 'vercel';
}

if (env.NODE_ENV === 'development') {
  return 'local';
}

return 'unknown';
```

### Platform-Specific Variables

Each platform exposes unique env vars:

**Cloudflare:**
- `CF_PAGES` = "1"
- `CF_PAGES_BRANCH` = "main" | "preview-branch"
- `CF_PAGES_COMMIT_SHA` = "abc123..."

**Netlify:**
- `NETLIFY` = "true"
- `NETLIFY_DEV` = "true" (local dev)
- `COMMIT_REF` = "abc123..."

**Vercel:**
- `VERCEL` = "1"
- `VERCEL_ENV` = "production" | "preview" | "development"
- `VERCEL_GIT_COMMIT_SHA` = "abc123..."

## Complete Example

```typescript
// src/pages/api/submit.ts
import type { APIRoute } from 'astro';
import {
  getRequiredEnv,
  getClientIP,
  getPlatformInfo,
  logError
} from '@rejected-media/podcast-framework-core';

export const POST: APIRoute = async (context) => {
  try {
    // 1. Get platform info
    const { platform, isDevelopment } = getPlatformInfo(context);
    console.log(`Processing request on ${platform}`);

    // 2. Get required env vars
    const env = getRequiredEnv([
      'API_KEY',
      'API_SECRET'
    ], context);

    // 3. Get client IP for rate limiting
    const clientIP = getClientIP(context);

    // 4. Process request
    const result = await processRequest(env.API_KEY, env.API_SECRET);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // 5. Log error with context
    logError(error, {
      tags: { endpoint: 'submit', platform: 'api' },
      extra: { timestamp: new Date().toISOString() }
    }, context);

    return new Response('Internal server error', {
      status: 500
    });
  }
};
```

## Migration Benefits

The hosting adapter drastically reduces migration effort:

**Without Adapter:**
```
Migrate from Netlify → Cloudflare:
- Rewrite all env var access (50+ files)
- Update API route patterns
- Change logging calls
- Test everything
Estimated: 30+ hours
```

**With Adapter:**
```
Migrate from Netlify → Cloudflare:
- Update deployment config only
- No code changes needed
Estimated: 2-4 hours
```

**Actual Case Study (Strange Water):**
- **Old approach:** 31 hours estimated
- **With adapter:** 4 hours actual
- **Savings:** 93% reduction

## Platform-Specific Optimizations

### Conditional Code

```typescript
import { detectPlatform } from '@rejected-media/podcast-framework-core';

export const POST: APIRoute = async (context) => {
  const platform = detectPlatform(context);

  if (platform === 'cloudflare') {
    // Use Cloudflare Workers KV
    const cache = context.locals.runtime.env.KV;
    const cached = await cache.get('key');
  } else if (platform === 'vercel') {
    // Use Vercel Edge Config
  } else {
    // Default implementation
  }
};
```

### Environment-Specific Behavior

```typescript
import { getPlatformInfo } from '@rejected-media/podcast-framework-core';

export const POST: APIRoute = async (context) => {
  const { isDevelopment, isProduction } = getPlatformInfo(context);

  if (isDevelopment) {
    // Skip email sending in dev
    console.log('Would send email:', emailData);
    return new Response('OK (dev)');
  }

  if (isProduction) {
    // Send actual email
    await sendEmail(emailData);
  }
};
```

## Error Logging

### Basic Logging

```typescript
import { logError } from '@rejected-media/podcast-framework-core';

try {
  await riskyOperation();
} catch (error) {
  logError(error);
  // Logs to console
}
```

### With Context

```typescript
logError(error, {
  tags: {
    function: 'newsletter-subscribe',
    operation: 'convertkit-api'
  },
  extra: {
    email: userEmail,
    timestamp: Date.now()
  }
}, context);
```

**Logged Output (Cloudflare):**
```json
{
  "platform": "cloudflare",
  "error": "API call failed",
  "stack": "Error: API call failed\n  at ...",
  "tags": {
    "function": "newsletter-subscribe",
    "operation": "convertkit-api"
  },
  "extra": {
    "email": "user@example.com",
    "timestamp": 1234567890
  }
}
```

### Sentry Integration

If Sentry is initialized, errors automatically go to Sentry:

```typescript
import { initSentry, logError } from '@rejected-media/podcast-framework-core';

// Initialize Sentry once
initSentry({
  dsn: import.meta.env.SENTRY_DSN,
  environment: import.meta.env.SENTRY_ENVIRONMENT || 'production'
});

// Log errors (goes to console + Sentry)
try {
  await operation();
} catch (error) {
  logError(error, {
    tags: { feature: 'newsletter' },
    level: 'warning'  // 'error' | 'warning' | 'info'
  }, context);
}
```

## Best Practices

### 1. Always Use Adapter in API Routes

```typescript
// ❌ Platform-specific
export const POST: APIRoute = async ({ request }) => {
  const apiKey = process.env.API_KEY;  // Breaks on Cloudflare
};

// ✅ Platform-agnostic
export const POST: APIRoute = async (context) => {
  const apiKey = getEnv('API_KEY', context);  // Works everywhere
};
```

### 2. Pass Context to Functions

```typescript
// ❌ Missing context
const apiKey = getEnv('API_KEY');  // Won't work on Cloudflare

// ✅ With context
const apiKey = getEnv('API_KEY', context);  // Works everywhere
```

### 3. Use getRequiredEnv for Validation

```typescript
// ❌ Manual validation
const apiKey = getEnv('API_KEY', context);
if (!apiKey) {
  throw new Error('Missing API_KEY');
}

// ✅ Automatic validation
const { API_KEY } = getRequiredEnv(['API_KEY'], context);
// Throws automatically if missing
```

### 4. Log All Errors

```typescript
try {
  await operation();
} catch (error) {
  logError(error, { tags: { feature: 'x' } }, context);  // Always log
  return new Response('Error', { status: 500 });
}
```

## Security

### Environment Variable Access

**Secure:**
- Only server-side access (API routes)
- No exposure to client
- Validates required variables

**Usage:**
```typescript
// ✅ Safe (server-side only)
export const POST: APIRoute = async (context) => {
  const apiKey = getEnv('API_KEY', context);  // Server-only
};

// ❌ Don't use in client-side code
<script>
  import { getEnv } from '@rejected-media/podcast-framework-core';
  const apiKey = getEnv('API_KEY');  // Won't work, no context
</script>
```

## Troubleshooting

### "Missing required environment variables"

Add variables to `.env`:

```bash
API_KEY="your-key-here"
API_SECRET="your-secret-here"
```

For Cloudflare Pages, add in dashboard:
Settings → Environment variables

### `getEnv()` returns empty string

Check variable name matches `.env`:

```bash
# .env
PUBLIC_SANITY_PROJECT_ID="abc123"

# Code (must match exactly)
const id = getEnv('PUBLIC_SANITY_PROJECT_ID', context);
```

### Client IP shows "unknown"

Ensure you're calling from API route with valid context:

```typescript
// ✅ In API route
export const POST: APIRoute = async (context) => {
  const ip = getClientIP(context);  // Works
};

// ❌ In page component
const ip = getClientIP();  // Won't work, no context
```

## Related

- **[Server Services](/api/server-services/)** - Use adapter in services
- **[Deployment](/deployment/environment-variables/)** - Configure env vars
- **[Configuration](/getting-started/configuration/)** - Environment setup

## Next Steps

- **[Server Services](/api/server-services/)** - Build backend services
- **[Deployment](/deployment/cloudflare-pages/)** - Deploy to production
- **[Environment Variables](/deployment/environment-variables/)** - Production configuration
