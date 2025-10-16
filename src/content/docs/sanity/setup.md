---
title: Sanity Setup
description: Set up Sanity CMS for your podcast website
---

# Sanity Setup

The Podcast Framework template comes with Sanity Studio **pre-configured**. You just need to create a Sanity project and add your credentials.

## Prerequisites

- Sanity account ([sign up free](https://www.sanity.io/))
- Podcast Framework template cloned
- Node.js 18+ installed

## Quick Setup (3 Steps)

### Step 1: Create Sanity Project

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Click **"Create project"**
3. **Project name:** my-podcast (or your podcast name)
4. **Dataset:** production (default)
5. Copy your **Project ID** (looks like `abc123xyz`)

:::tip[Save Your Project ID]
You'll see your Project ID on the project page:
```
Project ID: abc123xyz
```

**Save this!** You'll need it in the next step.
:::

### Step 2: Configure Environment Variables

Copy the template and add your credentials:

```bash
cp .env.template .env.local
```

Edit `.env.local` and add your Project ID:

```bash
# For website (public - exposed to client)
PUBLIC_SANITY_PROJECT_ID="abc123xyz"        # ← Your Project ID here!
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_API_VERSION="2024-01-01"

# For Sanity Studio (server-side only)
SANITY_PROJECT_ID="abc123xyz"               # ← Same Project ID
SANITY_DATASET="production"
```

:::danger[Required]
Replace `abc123xyz` with your actual Project ID from Step 1!
:::

### Step 3: Install Dependencies

```bash
npm install
```

That's it! Studio is ready to use.

## Running Sanity Studio

### Local Development

Start Studio locally:

```bash
npm run sanity:dev
```

Visit **http://localhost:3333** - you should see Sanity Studio!

**You should see:**
- Episode (sidebar)
- Guest (sidebar)
- Host (sidebar)
- Podcast (sidebar)
- Contribution (sidebar)
- Theme (sidebar)
- Homepage Config (sidebar)
- About Page Config (sidebar)

### Production Deployment

Deploy Studio to Sanity Cloud (free hosting):

```bash
npm run sanity:deploy
```

Choose a studio hostname:
```
Studio hostname: my-podcast
✔ Deployed to https://my-podcast.sanity.studio
```

Now you can access Studio from anywhere at your custom URL!

:::tip[Free Tier]
Sanity's free tier includes unlimited Studio hosting. You can deploy as many Studios as you want.
:::

## Creating Content

### Step 1: Create Podcast Document

1. Click **"Podcast"** in sidebar
2. Click **"Create new Podcast"**
3. Fill in required fields:
   - **Name:** Your podcast name
   - **Tagline:** Short tagline
   - **Description:** Full description
   - **Is Active:** Toggle ON if actively releasing episodes
4. Optional fields:
   - Upload logo
   - Add Spotify, Apple Podcasts, YouTube URLs
   - Add social links (Twitter, Discord)
5. Click **"Publish"**

:::tip[Only One Podcast Document]
Create only ONE podcast document. The framework queries for the first podcast document it finds.
:::

### Step 2: Create Your First Episode

1. Click **"Episode"** in sidebar
2. Click **"Create new Episode"**
3. Fill in fields:
   - **Title:** Episode title
   - **Slug:** Auto-generated (or customize)
   - **Episode Number:** 1, 2, 3, etc.
   - **Publish Date:** When published
   - **Duration:** MM:SS or HH:MM:SS format
   - **Description:** Episode description
4. Optional fields:
   - Upload cover image
   - Add Spotify/Apple/YouTube links
   - Add show notes (rich text)
   - Mark as featured
5. Click **"Publish"**

### Step 3: Create a Guest

1. Click **"Guest"** in sidebar
2. Click **"Create new Guest"**
3. Fill in fields:
   - **Name:** Guest name
   - **Slug:** Auto-generated
   - **Bio:** Guest biography
4. Optional fields:
   - Upload photo
   - Add Twitter handle
   - Add website URL
   - Add LinkedIn URL
5. Click **"Publish"**

### Step 4: Link Guest to Episode

1. Go back to your episode
2. Scroll to **"Guests"** field
3. Click **"Add item"**
4. Select the guest you created
5. Click **"Publish"**

## Verify Setup

Build your site to verify everything works:

```bash
npm run build
```

**Expected output:**
```
✓ Completed in 20s
  12 page(s) built
```

Start dev server:

```bash
npm run dev
```

Visit http://localhost:4321 - your podcast site should display!

## Sanity Studio Commands

The template includes npm scripts for working with Studio:

```bash
# Local development
npm run sanity:dev
# → http://localhost:3333

# Deploy to Sanity Cloud
npm run sanity:deploy
# → https://your-podcast.sanity.studio

# Build Studio for production
npm run sanity:build
```

### Studio Features

**Document Management:**
- Create, edit, delete documents
- Rich text editing
- Image uploads with hotspot
- Reference relationships
- Draft/publish workflow

**Collaboration:**
- Real-time collaboration
- Change history
- Comment threads
- Permissions management

**Vision Tool:**
- Test GROQ queries
- Explore your dataset
- Debug query issues

## Configuration Files

The template comes with Sanity pre-configured. Here's what's included:

### `sanity.config.ts`

Main Sanity configuration (at project root):

```typescript
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

// Import framework schemas
import {
  episode,
  guest,
  host,
  podcast,
  contribution
} from '@podcast-framework/sanity-schema';

export default defineConfig({
  name: 'default',
  title: 'My Podcast',

  // Uses environment variables from .env.local
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool(),
    visionTool()
  ],

  schema: {
    types: [
      podcast,
      episode,
      guest,
      host,
      contribution,
    ]
  }
});
```

### `sanity/sanity.cli.ts`

CLI configuration for deployment:

```typescript
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || 'production'
  }
});
```

:::tip[Pre-configured]
All configuration files are already set up in the template. You just need to add your Project ID to `.env.local`!
:::

## API Tokens

### Read Token (Public)

Used for fetching content (already configured):

```bash
# .env
PUBLIC_SANITY_PROJECT_ID="abc123"  # Public, safe for client
PUBLIC_SANITY_DATASET="production"
```

### Write Token (Private)

Required for contribution forms:

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Click **API** → **Tokens**
4. Click **"Add API token"**
5. Name: "Production Write Token"
6. Permissions: **Editor** (read + write)
7. Click **"Add token"**
8. Copy the token (shows once!)

Add to `.env`:
```bash
SANITY_API_TOKEN="sk_..."  # Keep secret!
```

:::danger[Security]
NEVER commit `SANITY_API_TOKEN` to git!
Write tokens allow modifying your content.
:::

## Datasets

### Production Dataset

Default dataset for production content:

```bash
PUBLIC_SANITY_DATASET="production"
```

### Development Dataset

Create a development dataset for testing:

```bash
cd sanity
npx sanity dataset create development
```

Use in development:

```bash
# .env.local
PUBLIC_SANITY_DATASET="development"
```

### Staging Dataset

Create a staging dataset:

```bash
npx sanity dataset create staging
```

**Workflow:**
```
development → staging → production
   (test)     (review)   (live)
```

## Importing Content

### Import Episodes from RSS

```bash
# Set RSS feed URL
echo 'RSS_FEED_URL="https://yourpodcast.com/feed.xml"' >> .env

# Import episodes
npm run import:episodes
```

This script:
- Fetches RSS feed
- Parses episodes
- Creates Sanity documents
- Uploads to production dataset

### Bulk Upload Guest Photos

```bash
# Place photos in public/guests/
# photos/vitalik-buterin.jpg
# photos/danny-ryan.jpg

npm run upload:photos
```

## Troubleshooting

### "Project not found"

Check Project ID matches:

```bash
# List your projects
npx sanity projects list

# Output:
# my-podcast (abc123xyz) - You
```

Copy the Project ID to `.env`:

```bash
PUBLIC_SANITY_PROJECT_ID="abc123xyz"
```

### "Dataset not found"

Create the production dataset:

```bash
cd sanity
npx sanity dataset create production
```

### "Schema deploy failed"

Check you're in the sanity directory:

```bash
cd sanity
npx sanity schema deploy
cd ..
```

### Studio shows "Invalid token"

Check your token is valid:

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. API → Tokens
4. Verify token exists and isn't expired
5. Regenerate if needed

### Build fails with Sanity error

Check connection to Sanity:

```bash
# Test Sanity connection
npx sanity check
```

## Next Steps

- **[Schemas](/sanity/schemas/)** - Understand schema structure
- **[Content Management](/sanity/content-management/)** - Add episodes and guests
- **[Theme Configuration](/sanity/theme-configuration/)** - Customize your theme
- **[Homepage Configuration](/sanity/homepage-configuration/)** - Configure homepage

## Related

- **[Sanity Helpers](/api/sanity-helpers/)** - Fetch content in your code
- **[Configuration](/getting-started/configuration/)** - Environment variables
- **[Deployment](/deployment/environment-variables/)** - Production setup
