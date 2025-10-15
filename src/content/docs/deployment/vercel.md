---
title: Deploy to Vercel
description: Deploy your podcast website to Vercel
---

# Deploy to Vercel

Deploy your podcast website to Vercel for fast edge hosting with zero configuration, automatic deployments, and excellent developer experience.

## Quick Deploy

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

Your site will be live at `your-project.vercel.app`

## Step-by-Step Guide

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/my-podcast.git
git push -u origin main
```

### Step 2: Import Project

1. Go to [vercel.com](https://vercel.com/)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to your repository
4. If not listed, click **"Import a Third-Party Git Repository"**

### Step 3: Configure Project

```
Project Name: my-podcast
Framework Preset: Astro
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Vercel auto-detects Astro - these are pre-filled!

### Step 4: Environment Variables

Click **"Environment Variables"** and add:

**Required:**
```
PUBLIC_SANITY_PROJECT_ID = abc123xyz
PUBLIC_SANITY_DATASET = production
PUBLIC_SANITY_API_VERSION = 2024-01-01
PUBLIC_SITE_URL = https://my-podcast.vercel.app
```

**Optional:**
```
SANITY_API_TOKEN = sk_...
RESEND_API_KEY = re_...
NOTIFICATION_EMAIL = you@example.com
CONVERTKIT_API_KEY = ...
CONVERTKIT_FORM_ID = ...
PUBLIC_GA_MEASUREMENT_ID = G-...
```

For each variable, select environments:
- ✅ Production
- ✅ Preview
- ✅ Development (optional)

### Step 5: Deploy

Click **"Deploy"**

Watch the build:
```
Installing dependencies
Building your project
Uploading build output
Deploying to Vercel Edge Network
✅ Deployment completed!
```

Visit: `https://my-podcast.vercel.app`

## Configuration File

Create `vercel.json` for advanced configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "astro",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

## Vercel Serverless Functions

API routes automatically become Vercel Serverless Functions.

**Framework pattern:**
```typescript
// src/pages/api/example.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
  // Works automatically on Vercel
  return new Response('OK');
};
```

**Deployed as:** Vercel Serverless Function at `/api/example`

## Automatic Deployments

### Production Deployments

Every push to `main` deploys to production:

```bash
git push origin main
# Vercel builds and deploys automatically
```

### Preview Deployments

Every branch and PR gets a preview URL:

```bash
git checkout -b new-feature
git push -u origin new-feature

# Creates preview deployment
# → https://my-podcast-git-new-feature.vercel.app
```

## Custom Domain

### Add Domain

1. Project → **Settings** → **Domains**
2. Enter domain: `yourpodcast.com`
3. Click **"Add"**

### Configure DNS

At your DNS provider, add:

```
# Root domain
Type: A
Name: @
Value: 76.76.21.21

# www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Verification

1. Vercel verifies DNS records
2. SSL provisions automatically
3. Status changes to **"Valid"** (5-10 minutes)

### Update Site URL

```bash
# In Vercel dashboard
PUBLIC_SITE_URL = https://yourpodcast.com
```

Redeploy to apply changes.

## Performance

### Edge Network

Vercel serves from global edge:
- Americas, Europe, Asia-Pacific
- Sub-100ms TTFB globally

### Caching

Vercel automatically caches:
- Static assets (HTML, CSS, JS)
- Images (optimized automatically)
- Build output

## Monitoring

### Analytics

Built-in Vercel Analytics:

1. Project → **Analytics**
2. View:
   - Page views
   - Top pages
   - Geographic distribution
   - Real User Monitoring (RUM)

**Enable:**
```bash
npm install @vercel/analytics

# Add to layout
import { Analytics } from '@vercel/analytics/astro';

<Analytics />
```

### Function Logs

View serverless function logs:

1. Project → **Logs**
2. Filter by:
   - Function
   - Status code
   - Time range

## Troubleshooting

### Build failed

Check build logs:
1. Deployment → Click failed deployment
2. View logs for errors

**Common issues:**
- Missing environment variables
- Type errors
- Build timeout (10 minute limit)

### API routes return 404

**Check 1:** Routes in correct location
```
src/pages/api/example.ts ✅
src/api/example.ts ❌
```

**Check 2:** Export format
```typescript
export const POST: APIRoute = async (context) => { ... };
```

### Function timeout

Vercel has 10-second timeout for serverless functions.

**Optimize:**
- Cache Sanity queries
- Use faster APIs
- Move heavy processing to background

## Related

- **[Cloudflare Pages](/deployment/cloudflare-pages/)** - Alternative platform
- **[Environment Variables](/deployment/environment-variables/)** - Configure variables
- **[Custom Domains](/deployment/custom-domains/)** - Domain setup

## Next Steps

- **[Environment Variables](/deployment/environment-variables/)** - Configure production
- **[Custom Domains](/deployment/custom-domains/)** - Add custom domain
- **[Netlify](/deployment/netlify/)** - Alternative platform
