---
title: Environment Variables
description: Complete guide to environment variables for production deployment
---

# Environment Variables

Complete guide to configuring environment variables for production deployment of your podcast website.

## Required Variables

These variables are **required** for the site to work:

```bash
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID="abc123xyz"
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_API_VERSION="2024-01-01"

# Site Configuration
PUBLIC_SITE_URL="https://yourpodcast.com"
```

## Optional Variables

Add these for additional features:

### Newsletter (ConvertKit)

```bash
CONVERTKIT_API_KEY="your-convertkit-api-secret"
CONVERTKIT_FORM_ID="your-form-id"
```

**Where to get:**
1. [ConvertKit account](https://convertkit.com/) → Settings → Advanced → API Secret
2. Forms → Select form → Form ID in URL

**Enables:**
- Newsletter signup forms
- Email subscription collection
- ConvertKit integration

### Contribution Emails (Resend)

```bash
RESEND_API_KEY="re_..."
NOTIFICATION_EMAIL="contributions@yourpodcast.com"
```

**Where to get:**
1. [Resend account](https://resend.com/) → API Keys → Create
2. Verify domain for `NOTIFICATION_EMAIL`

**Enables:**
- Contribution form submissions
- Email notifications
- Community engagement

### Analytics (Google Analytics 4)

```bash
PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Where to get:**
1. [Google Analytics](https://analytics.google.com/)
2. Create GA4 property
3. Data Streams → Web → Measurement ID

**Enables:**
- Visitor tracking
- Page view analytics
- User behavior insights

### Error Tracking (Sentry)

```bash
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_ENVIRONMENT="production"
SENTRY_RELEASE="1.0.0"
```

**Where to get:**
1. [Sentry account](https://sentry.io/)
2. Create project
3. Settings → Client Keys (DSN)

**Enables:**
- Error tracking
- Performance monitoring
- Issue alerting

### RSS Import

```bash
RSS_FEED_URL="https://yourpodcast.com/feed.xml"
```

**Used by:**
- `npm run import:episodes` script
- Importing existing episodes from RSS feed

## Variable Types

### Public Variables

Accessible in browser code (client and server):

```bash
PUBLIC_*  # All variables starting with PUBLIC_
```

**Example:**
```typescript
// ✅ Works in browser
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;

// ✅ Also available on server
import { getEnv } from '@podcast-framework/core';
const projectId = getEnv('PUBLIC_SANITY_PROJECT_ID', context);
```

### Private Variables

Only accessible on server (API routes, server functions):

```bash
# No PUBLIC_ prefix
RESEND_API_KEY="..."
CONVERTKIT_API_KEY="..."
SENTRY_DSN="..."
```

**Example:**
```typescript
// ✅ Works in API routes
import { getEnv } from '@podcast-framework/core';
const apiKey = getEnv('RESEND_API_KEY', context);

// ❌ NOT accessible in browser
// import.meta.env.RESEND_API_KEY → undefined
```

:::danger[Security]
Never expose API keys, tokens, or secrets in client code!
Always use private variables (without PUBLIC_ prefix).
:::

## Platform-Specific Setup

### Cloudflare Pages

1. Dashboard → Workers & Pages → Your project
2. Settings → **Environment variables**
3. Click **"Add variable"**
4. Enter name and value
5. Select environment (Production, Preview, or both)
6. Click **"Save"**

**Access in code:**
```typescript
import { getEnv } from '@podcast-framework/core';

export const POST: APIRoute = async (context) => {
  const apiKey = getEnv('API_KEY', context);  // ✅ Works
};
```

### Netlify

1. Site settings → **Environment variables**
2. Click **"Add a variable"**
3. Enter key and value
4. Select scopes (Production, Deploy previews, Branch deploys)
5. Click **"Create variable"**

**Access in code:**
```typescript
import { getEnv } from '@podcast-framework/core';

export const handler = async (event, context) => {
  const apiKey = getEnv('API_KEY');  // ✅ Works
};
```

### Vercel

1. Project → **Settings** → **Environment Variables**
2. Enter name and value
3. Select environments (Production, Preview, Development)
4. Click **"Save"**

**Access in code:**
```typescript
import { getEnv } from '@podcast-framework/core';

export default async function handler(req, res) {
  const apiKey = getEnv('API_KEY');  // ✅ Works
}
```

## Variable Management

### Development vs Production

Use different values for different environments:

**.env (local development):**
```bash
PUBLIC_SANITY_DATASET="development"
PUBLIC_SITE_URL="http://localhost:4321"
NOTIFICATION_EMAIL="dev@localhost"
```

**Production (Cloudflare dashboard):**
```bash
PUBLIC_SANITY_DATASET="production"
PUBLIC_SITE_URL="https://yourpodcast.com"
NOTIFICATION_EMAIL="you@yourpodcast.com"
```

### Staging Environment

Create staging dataset and deploy:

```bash
# Staging branch
git checkout -b staging

# Staging variables
PUBLIC_SANITY_DATASET="staging"
PUBLIC_SITE_URL="https://staging.yourpodcast.com"
```

### Environment Variable Template

Keep `.env.template` updated:

```bash
# .env.template (commit to git)

# Sanity CMS (Required)
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=
PUBLIC_SANITY_API_VERSION=

# Site Configuration (Required)
PUBLIC_SITE_URL=

# Newsletter (Optional)
CONVERTKIT_API_KEY=
CONVERTKIT_FORM_ID=

# Contributions (Optional)
RESEND_API_KEY=
NOTIFICATION_EMAIL=
SANITY_API_TOKEN=

# Analytics (Optional)
PUBLIC_GA_MEASUREMENT_ID=

# Error Tracking (Optional)
SENTRY_DSN=
SENTRY_ENVIRONMENT=
```

Team members copy to `.env` and fill in values.

## Security Best Practices

### 1. Never Commit Secrets

Add to `.gitignore`:

```
.env
.env.local
.env.production
```

✅ Commit `.env.template` (no values)

### 2. Rotate Credentials

Rotate API keys periodically:

```
Every 90 days:
- Regenerate Sanity token
- Regenerate Resend API key
- Regenerate ConvertKit API key
- Update in Cloudflare dashboard
```

### 3. Use Least Privilege

Sanity token permissions:

```
✅ Editor (read + write contributions)
❌ Admin (unnecessary)
```

### 4. Separate Dev and Production

```
Development dataset: "development"
Production dataset: "production"

Development API keys: Test keys
Production API keys: Live keys
```

### 5. Monitor Access

Check Sanity audit logs:
- Dashboard → Project → Activity
- Review API token usage
- Revoke compromised tokens

## Validation

### Check Required Variables

```typescript
// In API route
import { getRequiredEnv } from '@podcast-framework/core';

export const POST: APIRoute = async (context) => {
  try {
    const env = getRequiredEnv([
      'PUBLIC_SANITY_PROJECT_ID',
      'RESEND_API_KEY'
    ], context);

    // All variables guaranteed to exist
    const { PUBLIC_SANITY_PROJECT_ID, RESEND_API_KEY } = env;

  } catch (error) {
    // Missing variables - returns error
    return new Response('Configuration error', { status: 500 });
  }
};
```

### Runtime Checks

```typescript
// Check if feature is configured
const hasNewsletter = !!getEnv('CONVERTKIT_API_KEY', context);
const hasContributions = !!getEnv('RESEND_API_KEY', context);
const hasAnalytics = !!import.meta.env.PUBLIC_GA_MEASUREMENT_ID;

// Conditionally enable features
{hasNewsletter && <NewsletterSignup />}
{hasContributions && <ContributeLink />}
```

## Troubleshooting

### "Missing required environment variables"

**Check 1:** Variables are set in platform dashboard

**Check 2:** Variable names match exactly (case-sensitive)

**Check 3:** Rebuild after adding variables
- Cloudflare: Deployments → Retry deployment

### Variables not accessible in API routes

**Check using hosting adapter:**
```typescript
// ✅ Platform-agnostic (works everywhere)
import { getEnv } from '@podcast-framework/core';
const apiKey = getEnv('API_KEY', context);

// ❌ Platform-specific (breaks on Cloudflare)
const apiKey = process.env.API_KEY;
```

### Different values in preview vs production

**Check environment selection:**
- Variables can be different for Production vs Preview
- Verify correct environment is selected when adding

### Variable updates not reflecting

**Trigger new build:**
```bash
# Push empty commit to trigger rebuild
git commit --allow-empty -m "Trigger rebuild"
git push
```

## Related

- **[Cloudflare Pages](/deployment/cloudflare-pages/)** - Cloudflare deployment
- **[Netlify](/deployment/netlify/)** - Netlify deployment
- **[Configuration](/getting-started/configuration/)** - Local configuration

## Next Steps

- **[Custom Domains](/deployment/custom-domains/)** - Set up custom domain
- **[Cloudflare Pages](/deployment/cloudflare-pages/)** - Deploy to Cloudflare
- **[Hosting Adapter](/api/hosting-adapter/)** - Platform abstraction
