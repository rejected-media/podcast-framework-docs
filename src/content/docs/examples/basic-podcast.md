---
title: Basic Podcast Example
description: Complete example of a basic podcast website
---

# Basic Podcast Example

This example shows a complete, minimal podcast website using Podcast Framework. Perfect for getting started quickly.

## Overview

**What you'll build:**
- Homepage with recent episodes
- Episode archive with search
- Individual episode pages
- Guest directory
- About page

**Time to build:** 15-20 minutes

**Difficulty:** Beginner

## Step 1: Create Project

```bash
npm create podcast-framework basic-podcast
cd basic-podcast
npm install
```

## Step 2: Set Up Sanity

```bash
# Initialize Sanity
npx sanity@latest init

# Answers:
# Create new project? Yes
# Project name: basic-podcast
# Use default dataset? Yes
# Output path: ./sanity

# Deploy schemas
cd sanity
npx sanity schema deploy
cd ..
```

## Step 3: Configure Environment

Create `.env`:

```bash
cp .env.template .env
```

Edit `.env`:

```bash
PUBLIC_SANITY_PROJECT_ID="your-project-id"
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_API_VERSION="2024-01-01"
PUBLIC_SITE_URL="http://localhost:4321"
```

## Step 4: Add Content

Start Sanity Studio:

```bash
npm run dev:sanity
```

**Create Podcast:**
1. Click "Podcast" → Create new
2. Fill in:
   - Name: "Tech Talk"
   - Tagline: "Weekly tech conversations"
   - Is Active: ON
3. Publish

**Create Host:**
1. Click "Host" → Create new
2. Fill in:
   - Name: "Your Name"
3. Publish

**Create Guest:**
1. Click "Guest" → Create new
2. Fill in:
   - Name: "First Guest"
   - Bio: "Expert in..."
3. Publish

**Create Episode:**
1. Click "Episode" → Create new
2. Fill in:
   - Title: "Welcome to the Show"
   - Episode Number: 1
   - Publish Date: Today
   - Duration: "45:00"
   - Description: "Our first episode..."
   - Hosts: Select your host
   - Guests: Select your guest
3. Publish

## Step 5: Start Dev Server

```bash
npm run dev
```

Visit http://localhost:4321 - your podcast site is running!

## File Structure

```
basic-podcast/
├── src/
│   ├── pages/
│   │   ├── index.astro                    # Homepage
│   │   ├── about.astro                    # About page
│   │   ├── episodes/
│   │   │   ├── index.astro                # Episode archive
│   │   │   └── [slug].astro               # Episode pages
│   │   ├── guests/
│   │   │   └── index.astro                # Guest directory
│   │   └── guest/
│   │       └── [slug].astro               # Guest profiles
│   └── env.d.ts
├── sanity/
│   ├── schemas/                           # Sanity schemas
│   └── sanity.config.ts
├── .env                                   # Environment variables
└── package.json
```

## Page Examples

### Homepage

```astro
---
// src/pages/index.astro
import { getPodcast, getEpisodes, getFeatured } from '@podcast-framework/core';
import BaseLayout from '@podcast-framework/core/layouts/BaseLayout.astro';
import FeaturedEpisodesCarousel from '@podcast-framework/core/components/FeaturedEpisodesCarousel.astro';

const podcast = await getPodcast();
const featured = await getFeatured(3);
const recent = (await getEpisodes()).slice(0, 6);
---

<BaseLayout title={podcast?.name}>
  <!-- Hero -->
  <section class="bg-blue-600 text-white py-20">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h1 class="text-5xl font-bold mb-4">{podcast?.name}</h1>
      <p class="text-xl">{podcast?.tagline}</p>
    </div>
  </section>

  <!-- Featured Episodes -->
  {featured && featured.length > 0 && (
    <FeaturedEpisodesCarousel episodes={featured} />
  )}

  <!-- Recent Episodes -->
  <section class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-3xl font-bold mb-8">Recent Episodes</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recent.map(episode => (
        <a href={`/episodes/${episode.slug.current}`}>
          <article class="bg-white rounded-lg shadow-md hover:shadow-lg transition">
            {episode.coverImage?.url && (
              <img
                src={episode.coverImage.url}
                alt={episode.title}
                class="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div class="p-6">
              <p class="text-sm text-blue-600 font-semibold mb-2">
                Episode {episode.episodeNumber}
              </p>
              <h3 class="text-xl font-bold mb-2">{episode.title}</h3>
              <p class="text-gray-600">{episode.description?.substring(0, 100)}...</p>
            </div>
          </article>
        </a>
      ))}
    </div>
  </section>
</BaseLayout>
```

### Episode Archive

```astro
---
// src/pages/episodes/index.astro
import { getEpisodes, getPodcast, formatDate } from '@podcast-framework/core';
import BaseLayout from '@podcast-framework/core/layouts/BaseLayout.astro';
import EpisodeSearch from '@podcast-framework/core/components/EpisodeSearch.astro';

const episodes = await getEpisodes();
const podcast = await getPodcast();
---

<BaseLayout title={`Episodes - ${podcast?.name}`}>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8">All Episodes</h1>

    <EpisodeSearch />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {episodes.map(episode => (
        <article
          data-episode-card
          data-episode-title={episode.title}
          data-episode-description={episode.description}
          data-episode-guests={episode.guests?.map(g => g.name).join(', ')}
        >
          <a href={`/episodes/${episode.slug.current}`}>
            <!-- Episode content -->
          </a>
        </article>
      ))}
    </div>
  </div>
</BaseLayout>
```

## Customization

### Add Theme

1. In Sanity Studio, click "Theme"
2. Create new theme
3. Set your brand colors
4. Publish
5. Refresh website

### Add Newsletter

1. Get ConvertKit account
2. Add API key to Podcast document in Sanity
3. Newsletter forms automatically work!

### Add Custom Page

```astro
// src/pages/sponsors.astro
import BaseLayout from '@podcast-framework/core/layouts/BaseLayout.astro';

<BaseLayout title="Sponsors">
  <h1>Our Sponsors</h1>
  <!-- Your content -->
</BaseLayout>
```

## Deployment

Deploy to Cloudflare Pages:

```bash
# Build
npm run build

# Deploy
npx wrangler pages deploy dist --project-name=basic-podcast
```

Or use GitHub integration for automatic deployments.

## What's Included

**Pages:**
- ✅ Homepage with hero and recent episodes
- ✅ Episode archive with search
- ✅ Individual episode pages
- ✅ Guest directory
- ✅ Guest profile pages
- ✅ About page
- ✅ 404 error page

**Components:**
- ✅ Header with navigation
- ✅ Footer with social links
- ✅ Episode search
- ✅ Featured episodes carousel (if you mark episodes as featured)

**Features:**
- ✅ CMS-driven content
- ✅ SEO optimized
- ✅ Mobile responsive
- ✅ Fast page loads

## Next Steps

1. Add more episodes
2. Customize theme
3. Add custom domain
4. Set up analytics

## Related

- **[Quick Start](/getting-started/quick-start/)** - Getting started guide
- **[Customization](/customization/component-overrides/)** - Customize further
- **[Deployment](/deployment/cloudflare-pages/)** - Deploy to production
