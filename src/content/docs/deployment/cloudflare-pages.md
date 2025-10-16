---
title: Deploy to Cloudflare Pages
description: Deploy your podcast website to Cloudflare Pages
---

# Deploy to Cloudflare Pages

Deploy your podcast website to Cloudflare Pages for fast, global edge hosting with automatic deployments, unlimited bandwidth, and generous free tier.

## Why Cloudflare Pages?

- ✅ **Free tier:** Unlimited bandwidth, 500 builds/month
- ✅ **Global CDN:** 275+ cities worldwide
- ✅ **Fast builds:** Typically 1-2 minutes
- ✅ **Automatic deployments:** Push to git → auto-deploy
- ✅ **Preview deployments:** Every PR gets a preview URL
- ✅ **Zero config:** Works out of the box with Astro
- ✅ **API routes:** Full serverless function support

## Prerequisites

- Cloudflare account ([sign up free](https://cloudflare.com/))
- Podcast website in GitHub repository
- Environment variables documented in `.env.template`

## Deployment Methods

### Method 1: Cloudflare Dashboard (Recommended)

**Step 1: Push to GitHub**

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo
gh repo create my-podcast --public

# Push code
git remote add origin https://github.com/username/my-podcast.git
git push -u origin main
```

**Step 2: Connect to Cloudflare**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **"Workers & Pages"**
3. Click **"Create application"**
4. Click **"Pages"** tab
5. Click **"Connect to Git"**
6. Select **GitHub** (authorize if first time)
7. Select your repository
8. Click **"Begin setup"**

**Step 3: Configure Build**

```
Project name: my-podcast
Production branch: main
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
```

**Step 4: Environment Variables**

Click **"Add environment variables"** and add:

```
PUBLIC_SANITY_PROJECT_ID = abc123xyz
PUBLIC_SANITY_DATASET = production
PUBLIC_SANITY_API_VERSION = 2024-01-01
PUBLIC_SITE_URL = https://my-podcast.pages.dev

# Optional (if using features)
SANITY_API_TOKEN = sk_...
RESEND_API_KEY = re_...
NOTIFICATION_EMAIL = you@example.com
CONVERTKIT_API_KEY = ...
CONVERTKIT_FORM_ID = ...
PUBLIC_GA_MEASUREMENT_ID = G-...
SENTRY_DSN = https://...
```

:::tip[Production vs Preview]
Add environment variables for:
- **Production** - Live site variables
- **Preview** - Test/staging variables (optional)
:::

**Step 5: Deploy**

Click **"Save and Deploy"**

Watch the build:
```
Initializing build environment
Cloning repository
Installing dependencies
Running build command
Deploying to Cloudflare network
✅ Success! Deployed to https://my-podcast.pages.dev
```

**Step 6: Visit Site**

Your site is live at: `https://my-podcast.pages.dev`

### Method 2: Wrangler CLI

Deploy directly from command line:

**Step 1: Install Wrangler**

```bash
npm install -g wrangler
```

**Step 2: Login**

```bash
wrangler login
```

**Step 3: Build**

```bash
npm run build
```

**Step 4: Deploy**

```bash
wrangler pages deploy dist --project-name=my-podcast
```

**Output:**
```
✨ Success! Deployed to https://my-podcast.pages.dev
```

### Method 3: GitHub Actions (Automated)

Already configured in the template:

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: my-podcast
          directory: dist
```

**Setup:**

1. Get Cloudflare API Token:
   - Dashboard → My Profile → API Tokens
   - Create token with "Cloudflare Pages" template

2. Get Account ID:
   - Dashboard → Workers & Pages → Account ID

3. Add GitHub Secrets:
   - Repository → Settings → Secrets and variables → Actions
   - Add: `CLOUDFLARE_API_TOKEN`
   - Add: `CLOUDFLARE_ACCOUNT_ID`

4. Push to main:
```bash
git push
```

GitHub Actions automatically deploys!

## Custom Domains

### Step 1: Add Custom Domain

1. In Cloudflare Pages project
2. Click **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Enter domain: `yourpodcast.com`
5. Click **"Continue"**

### Step 2: Configure DNS

**If domain is on Cloudflare:**
- DNS configured automatically ✅

**If domain is elsewhere:**
- Add CNAME record:
  ```
  Type: CNAME
  Name: @ (or subdomain)
  Value: my-podcast.pages.dev
  TTL: Auto
  ```

### Step 3: Wait for SSL

SSL certificate provisions automatically (5-10 minutes).

**Check status:**
```
✅ Active - Certificate provisioned
⏳ Pending - Certificate provisioning
❌ Failed - Check DNS configuration
```

### Step 4: Update Environment Variables

Update `PUBLIC_SITE_URL`:

```
Before: https://my-podcast.pages.dev
After:  https://yourpodcast.com
```

### Step 5: Rebuild

Trigger rebuild to use new URL:

```bash
git commit --allow-empty -m "Update site URL"
git push
```

## Build Configuration

### Build Settings

Default Cloudflare Pages settings for Astro:

```
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Node version: 18 (or higher)
Root directory: /
```

### Custom Build Command

Modify if needed:

```bash
# Type check before build
Build command: npm run build

# Skip type checking (faster builds)
Build command: astro build

# Custom environment
Build command: NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Build Caching

Cloudflare caches:
- ✅ `node_modules/` (dependencies)
- ✅ `.astro/` (Astro cache)
- ✅ Build assets

**Benefits:**
```
First build: 2-3 minutes
Subsequent builds: 30-60 seconds (80% faster)
```

## Environment Variables

### Adding Variables

1. Pages project → **Settings** → **Environment variables**
2. Click **"Add variable"**
3. Enter name and value
4. Select environment: Production, Preview, or both
5. Click **"Save"**

### Variable Types

**Public Variables (accessible in browser):**
```
PUBLIC_SANITY_PROJECT_ID
PUBLIC_SANITY_DATASET
PUBLIC_SITE_URL
PUBLIC_GA_MEASUREMENT_ID
```

**Private Variables (server-only):**
```
SANITY_API_TOKEN
RESEND_API_KEY
CONVERTKIT_API_KEY
SENTRY_DSN
```

:::danger[Security]
Never expose private variables in client code!
Only use in API routes and server-side code.
:::

### Required Variables

Minimum variables for basic site:

```
PUBLIC_SANITY_PROJECT_ID = abc123xyz
PUBLIC_SANITY_DATASET = production
PUBLIC_SITE_URL = https://yourpodcast.com
```

**See:** [Environment Variables](/deployment/environment-variables/) for complete list.

## Automatic Deployments

### On Push to Main

```bash
git add .
git commit -m "Add new episode"
git push

# Triggers automatic deployment
# ↓
# Build runs on Cloudflare
# ↓
# Site updates in ~1-2 minutes
```

### Preview Deployments

Every pull request gets a preview URL:

```bash
git checkout -b new-feature
git push -u origin new-feature

# Create PR on GitHub
# ↓
# Preview deployment created
# ↓
# https://abc123.my-podcast.pages.dev
```

**Benefits:**
- Test changes before merging
- Share with team for review
- No impact on production

## Monitoring

### Build Logs

View build logs in Cloudflare Dashboard:

1. Pages project → **Deployments**
2. Click deployment
3. View logs:
   ```
   Installing dependencies...
   Running build command...
   ✅ Build succeeded in 45s
   ```

### Analytics

Built-in analytics:

1. Pages project → **Analytics**
2. View:
   - Page views
   - Unique visitors
   - Top pages
   - Geographic distribution

### Function Logs

View serverless function logs:

1. Pages project → **Functions**
2. Click **"Real-time logs"**
3. See API route execution

## Performance

### Edge Network

Cloudflare serves from 275+ locations:

```
User in Tokyo → Served from Tokyo edge
User in London → Served from London edge
User in NYC → Served from NYC edge
```

**Result:** Sub-100ms load times globally.

### Caching

Cloudflare caches static assets:

```
First visit: 200ms (origin fetch)
Repeat visits: 20ms (edge cache)
```

**Cache invalidation:**
- Automatic on new deployment
- Manual: Settings → Caching → Purge Cache

### Optimization

Cloudflare automatically:
- ✅ Minifies HTML, CSS, JS
- ✅ Compresses with Brotli
- ✅ Optimizes images
- ✅ HTTP/3 support

## Troubleshooting

### Build failed

**Check build logs:**
1. Deployments → Failed deployment → View logs
2. Look for errors:
   ```
   Error: Missing environment variable PUBLIC_SANITY_PROJECT_ID
   Error: Command failed with exit code 1
   ```

**Common fixes:**
- Add missing environment variables
- Check `package.json` scripts
- Verify Node version compatibility

### Site shows 404

**Check output directory:**
- Must be `dist` (not `build` or `public`)

**Check build command:**
- Must be `npm run build` (or `astro build`)

### API routes not working

**Check 1:** API routes in correct location
```
src/pages/api/contribute.ts ✅
src/api/contribute.ts ❌
```

**Check 2:** Export format
```typescript
// ✅ Correct
export const POST: APIRoute = async (context) => { ... };

// ❌ Wrong
export default function handler(req, res) { ... }
```

### Environment variables not accessible

**Check 1:** Variables are added in Cloudflare dashboard

**Check 2:** Variable names match code
```typescript
// Code expects:
getEnv('PUBLIC_SANITY_PROJECT_ID', context)

// Dashboard must have:
PUBLIC_SANITY_PROJECT_ID = abc123
```

**Check 3:** Using hosting adapter
```typescript
// ✅ Cloudflare-compatible
import { getEnv } from '@rejected-media/podcast-framework-core';
const id = getEnv('PUBLIC_SANITY_PROJECT_ID', context);

// ❌ Won't work on Cloudflare
const id = process.env.PUBLIC_SANITY_PROJECT_ID;
```

## Related

- **[Environment Variables](/deployment/environment-variables/)** - Complete variable list
- **[Custom Domains](/deployment/custom-domains/)** - Set up custom domain
- **[Netlify](/deployment/netlify/)** - Alternative platform

## Next Steps

- **[Environment Variables](/deployment/environment-variables/)** - Configure production variables
- **[Custom Domains](/deployment/custom-domains/)** - Add custom domain
- **[Monitoring](/advanced/monitoring/)** - Monitor your site (coming soon)
