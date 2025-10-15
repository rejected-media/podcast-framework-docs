---
title: Sanity Setup
description: Set up Sanity CMS for your podcast website
---

# Sanity Setup

This guide walks you through setting up Sanity CMS for your podcast website, from creating a Sanity account to deploying schemas.

## Prerequisites

- Sanity account ([sign up free](https://www.sanity.io/))
- Podcast Framework project created
- Node.js 18+ installed

## Step-by-Step Setup

### Step 1: Create Sanity Account

1. Go to [sanity.io](https://www.sanity.io/)
2. Click "Get started"
3. Sign up with GitHub, Google, or email
4. Verify your email

### Step 2: Initialize Sanity Project

From your podcast project directory:

```bash
npx sanity@latest init
```

**Answer the prompts:**

```
? Create new project? → Yes
? Project name → my-podcast (or your podcast name)
? Use default dataset configuration? → Yes
? Output path → ./sanity (press Enter)
? Select project template → Clean project with no predefined schemas
```

:::tip[Save Your Project ID]
The CLI outputs your Project ID:
```
Success! Created project my-podcast (abc123xyz)
```

**Save `abc123xyz`** - you'll need it next!
:::

### Step 3: Configure Environment Variables

Add Sanity credentials to `.env`:

```bash
PUBLIC_SANITY_PROJECT_ID="abc123xyz"        # From Step 2
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_API_VERSION="2024-01-01"
```

:::danger[Required]
Replace `abc123xyz` with your actual Project ID from Step 2!
:::

### Step 4: Install Sanity Schemas

The framework provides pre-built schemas via `@podcast-framework/sanity-schema`:

```bash
npm install @podcast-framework/sanity-schema
```

### Step 5: Configure Schemas

Edit `sanity/sanity.config.ts`:

```typescript
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

// Import framework schemas
import { schemas } from '@podcast-framework/sanity-schema';

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
    types: schemas  // Use framework schemas
  },
});
```

Or edit `sanity/schemas/index.ts`:

```typescript
// Import framework schemas
import {
  episodeSchema,
  guestSchema,
  hostSchema,
  podcastSchema,
  contributionSchema,
  themeSchema,
  homepageConfigSchema,
  aboutPageConfigSchema
} from '@podcast-framework/sanity-schema';

export const schemaTypes = [
  episodeSchema,
  guestSchema,
  hostSchema,
  podcastSchema,
  contributionSchema,
  themeSchema,
  homepageConfigSchema,
  aboutPageConfigSchema
];
```

### Step 6: Deploy Schemas

Deploy schemas to your Sanity project:

```bash
cd sanity
npx sanity schema deploy
cd ..
```

**Output:**
```
✔ Deployed schema
```

This uploads 8 schema types to Sanity:
- Episode
- Guest
- Host
- Podcast
- Contribution
- Theme
- Homepage Config
- About Page Config

### Step 7: Start Sanity Studio

```bash
npm run dev:sanity
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

### Step 8: Create Podcast Document

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

### Step 9: Create Your First Episode

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

### Step 10: Create a Guest

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

### Step 11: Link Guest to Episode

1. Go back to your episode
2. Scroll to **"Guests"** field
3. Click **"Add item"**
4. Select the guest you created
5. Click **"Publish"**

### Step 12: Verify Setup

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

## Sanity Studio

### Accessing Studio

**Local Development:**
```bash
npm run dev:sanity
# → http://localhost:3333
```

**Production:**
Deploy Studio to Sanity's hosting:

```bash
cd sanity
npx sanity deploy
```

Choose a studio hostname:
```
Studio hostname: my-podcast
✔ Deployed to https://my-podcast.sanity.studio
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

### `sanity.config.ts`

Main Sanity configuration:

```typescript
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'My Podcast',  // Studio title

  projectId: process.env.PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool(),  // Document management UI
    visionTool(),     // Query testing tool
  ],

  schema: {
    types: schemaTypes
  },
});
```

### `schemas/index.ts`

Schema registration:

```typescript
import {
  episodeSchema,
  guestSchema,
  hostSchema,
  podcastSchema,
  contributionSchema,
  themeSchema,
  homepageConfigSchema,
  aboutPageConfigSchema
} from '@podcast-framework/sanity-schema';

export const schemaTypes = [
  episodeSchema,
  guestSchema,
  hostSchema,
  podcastSchema,
  contributionSchema,
  themeSchema,
  homepageConfigSchema,
  aboutPageConfigSchema
];
```

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
