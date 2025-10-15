---
title: Deploy to Netlify
description: Deploy your podcast website to Netlify
---

# Deploy to Netlify

Deploy your podcast website to Netlify for reliable hosting with continuous deployment, serverless functions, and a generous free tier.

## Quick Deploy

1. Push code to GitHub
2. Connect Netlify to GitHub
3. Configure build settings
4. Deploy

Your site will be live at `your-site.netlify.app`

## Step-by-Step Guide

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/my-podcast.git
git push -u origin main
```

### Step 2: Create Netlify Site

1. Go to [app.netlify.com](https://app.netlify.com/)
2. Click **"Add new site"**
3. Click **"Import an existing project"**
4. Click **"Deploy with GitHub"**
5. Authorize Netlify (if first time)
6. Select your repository
7. Click **"Deploy site"**

### Step 3: Configure Build

```
Site name: my-podcast (or custom)
Branch: main
Build command: npm run build
Publish directory: dist
```

### Step 4: Environment Variables

1. Site settings → **Environment variables**
2. Add variables:

```
PUBLIC_SANITY_PROJECT_ID = abc123xyz
PUBLIC_SANITY_DATASET = production
PUBLIC_SANITY_API_VERSION = 2024-01-01
PUBLIC_SITE_URL = https://my-podcast.netlify.app
```

**Optional variables:**
```
SANITY_API_TOKEN = sk_...
RESEND_API_KEY = re_...
NOTIFICATION_EMAIL = you@example.com
CONVERTKIT_API_KEY = ...
CONVERTKIT_FORM_ID = ...
PUBLIC_GA_MEASUREMENT_ID = G-...
```

### Step 5: Deploy

Click **"Deploy site"**

Watch deployment:
```
Build started
Installing dependencies
Running build command
Build succeeded
Deploying to Netlify Edge
✅ Published!
```

Visit: `https://your-site.netlify.app`

## Configuration File

Create `netlify.toml` for advanced configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/old-page"
  to = "/new-page"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

## Netlify Functions

API routes automatically become Netlify Functions.

**Framework pattern:**
```typescript
// src/pages/api/example.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
  // Works automatically on Netlify
  return new Response('OK');
};
```

**Becomes:** `.netlify/functions/example`

## Automatic Deployments

Every push to main triggers deployment:

```bash
git add .
git commit -m "Add new episode"
git push

# Netlify builds and deploys automatically
```

## Custom Domain

### Add Domain

1. Site settings → **Domain management**
2. Click **"Add custom domain"**
3. Enter: `yourpodcast.com`
4. Follow DNS instructions

### DNS Setup

Add records at your DNS provider:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

### SSL

Netlify provisions SSL automatically via Let's Encrypt.

**Enable HTTPS:**
1. Domain settings → HTTPS
2. Toggle **"Force HTTPS"** → ON

## Related

- **[Cloudflare Pages](/deployment/cloudflare-pages/)** - Alternative platform
- **[Environment Variables](/deployment/environment-variables/)** - Configure variables
- **[Custom Domains](/deployment/custom-domains/)** - Domain setup

## Next Steps

- **[Environment Variables](/deployment/environment-variables/)** - Add all variables
- **[Custom Domains](/deployment/custom-domains/)** - Set up domain
- **[Vercel](/deployment/vercel/)** - Alternative platform
