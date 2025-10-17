---
title: Content Management
description: Managing episodes, guests, and content in Sanity Studio
---

# Content Management

This guide covers day-to-day content management in Sanity Studio, including creating episodes, managing guests, and organizing content.

## Accessing Sanity Studio

### Local Development

```bash
npm run dev:sanity
```

Visit **http://localhost:3333**

### Production

Deploy Studio for team access:

```bash
cd sanity
npx sanity deploy
```

Visit **https://your-podcast.sanity.studio**

## Managing Episodes

### Creating an Episode

1. Open Sanity Studio
2. Click **"Episode"** in sidebar
3. Click **"Create new Episode"** (+ button)
4. Fill in required fields:

**Required Fields:**
- **Title:** Episode title (e.g., "The Future of Ethereum")
- **Slug:** Auto-generates from title (or customize)
- **Episode Number:** Sequential number (1, 2, 3, ...)
- **Publish Date:** When episode was/will be published
- **Description:** Episode description (used in SEO, episode lists)

**Optional but Recommended:**
- **Duration:** Episode length (e.g., "1:23:45" or "45:30")
- **Cover Image:** Upload episode cover art
- **Hosts:** Select host(s) from list
- **Guests:** Select guest(s) from list
- **Spotify Link:** Full Spotify episode URL
- **Apple Podcast Link:** Apple Podcasts episode URL
- **YouTube Link:** YouTube video URL

**Advanced:**
- **Show Notes:** Rich text content (formatted notes, links, timestamps)
- **Transcript:** Full episode transcript
- **Featured:** Toggle ON to feature in carousel
- **Audio URL:** Direct MP3 URL (for transcription services)

5. Click **"Publish"**

:::tip[Slug Best Practices]
Use descriptive slugs:
- ✅ "the-future-of-ethereum"
- ✅ "vitalik-buterin-interview"
- ❌ "episode-1" (not descriptive)
- ❌ "ep42" (too short)
:::

### Editing an Episode

1. Click **"Episode"** in sidebar
2. Find episode in list
3. Click to open
4. Make changes
5. Click **"Publish"** to save

**Draft vs Published:**
- **Draft:** Changes not visible on website
- **Published:** Live on website after next build

### Deleting an Episode

1. Open episode
2. Click **"..."** menu (top right)
3. Click **"Delete"**
4. Confirm deletion

:::caution[Permanent]
Deletion is permanent. Episode will be removed from website on next build.
:::

### Featuring Episodes

Mark important episodes to appear in homepage carousel:

1. Open episode
2. Scroll to **"Featured Episode"** toggle
3. Toggle **ON**
4. Click **"Publish"**

Featured episodes appear in `FeaturedEpisodesCarousel` component.

### Episode Ordering

Episodes are ordered by:
- **Episode Number** (descending by default)
- Newest episodes appear first
- Archive page respects this order

**Custom sorting** in Sanity Studio:
- Click sort dropdown
- Choose "Episode Number, Old" for ascending order

## Managing Guests

### Creating a Guest

1. Click **"Guest"** in sidebar
2. Click **"Create new Guest"**
3. Fill in fields:

**Required:**
- **Name:** Guest full name
- **Slug:** Auto-generated from name

**Recommended:**
- **Bio:** Guest biography (2-3 sentences)
- **Photo:** Guest photo (square recommended, 400x400px+)

**Optional:**
- **Twitter:** Twitter/X handle (without @ symbol)
- **Website:** Personal or company website
- **LinkedIn:** LinkedIn profile URL

4. Click **"Publish"**

### Linking Guests to Episodes

**Method 1: From Episode**
1. Open episode
2. Scroll to **"Guests"** field
3. Click **"Add item"**
4. Select guest from list
5. Click **"Publish"**

**Method 2: Bulk Linking**
1. Create all guests first
2. Create episode
3. Add multiple guests at once

### Guest Photo Best Practices

**Recommended dimensions:**
- **Minimum:** 400x400px
- **Recommended:** 800x800px
- **Format:** JPG or PNG
- **Aspect ratio:** Square (1:1)

**Upload process:**
1. Click **"Photo"** field
2. Drag and drop image or click to upload
3. Adjust hotspot (focal point)
4. Click **"Upload"**

### Guest Profiles

Each guest automatically gets a profile page at `/guest/[slug]` showing:
- Guest photo and bio
- Social links
- All episodes featuring the guest

## Managing Hosts

Same process as guests, but for regular hosts:

1. Create **Host** document
2. Add host to episodes via **"Hosts"** field
3. Hosts typically appear on all episodes

**Typical setup:**
```
Host: Rex Kirshner
↓
Added to all 69 episodes
```

## Managing Podcast Metadata

The Podcast document contains show-level information.

### Initial Setup

1. Click **"Podcast"** in sidebar
2. Click **"Create new Podcast"** (if not exists)
3. Fill in fields:

**Required:**
- **Name:** Podcast name
- **Is Active:** ON if releasing episodes, OFF if concluded

**Recommended:**
- **Tagline:** Short tagline (shown in header, meta tags)
- **Description:** Full podcast description
- **Logo:** Podcast logo (square, 1400x1400px recommended)

**Platform Links:**
- **Spotify Show ID:** From Spotify URL
- **Spotify URL:** Show page URL
- **Apple Podcasts URL:** Show page URL
- **YouTube URL:** Channel URL
- **RSS URL:** Podcast RSS feed URL

**Social:**
- **Twitter URL:** Podcast Twitter profile
- **Discord URL:** Community Discord server

**Newsletter:**
- **Enable Newsletter Signup:** Toggle ON to show newsletter forms
- **ConvertKit API Key:** API secret from ConvertKit
- **ConvertKit Form ID:** Form ID from ConvertKit

4. Click **"Publish"**

:::tip[Only One Podcast Document]
Create only one Podcast document. The framework queries for `*[_type == "podcast"][0]`.
:::

### Updating Podcast Info

Edit the Podcast document anytime:

1. Click **"Podcast"** in sidebar
2. Click existing document
3. Make changes
4. Click **"Publish"**

Changes appear after next build/refresh.

## Content Workflow

### Recommended Workflow

**For Active Podcasts:**

1. **Record episode** → Get audio file
2. **Upload to Spotify/Apple** → Get platform links
3. **Create Guest in Sanity** (if new guest)
4. **Create Episode in Sanity:**
   - Add title, number, date
   - Add description
   - Upload cover image
   - Add platform links
   - Link host and guests
5. **Write Show Notes** → Add to Episode
6. **Mark as Featured** (optional)
7. **Publish Episode**
8. **Build & Deploy Website** → Episode appears

**For Concluded Podcasts:**

Same workflow, but set `isActive: false` in Podcast document.

## Bulk Operations

### Import from RSS Feed

Import existing episodes from your podcast host:

```bash
# Set RSS feed URL in .env
echo 'RSS_FEED_URL="https://feeds.transistor.fm/your-show"' >> .env

# Import all episodes (first time)
npm run import:episodes

# Or use the command directly with options
podcast-framework import-rss --feed https://feeds.transistor.fm/your-show --verbose

# Preview import without making changes
podcast-framework import-rss --dry-run

# Update existing episodes
podcast-framework import-rss --update

# Skip image downloads
podcast-framework import-rss --skip-images
```

**What it does:**
- ✅ Fetches RSS feed from your podcast host
- ✅ Parses episode metadata (title, number, date, duration, description)
- ✅ Downloads and uploads cover images to Sanity
- ✅ Creates Episode documents with audio URLs
- ✅ Detects and skips existing episodes (using RSS GUID)
- ✅ Works with incremental imports (safe to run multiple times)

**Supported Podcast Hosts:**
- **Transistor** - Full support for https://feeds.transistor.fm/ feeds
- More hosts coming soon (easily extensible)

**After Import:**
- Episodes are created with basic metadata
- Manually add guests and hosts in Sanity Studio
- Manually add platform links (Spotify, Apple Podcasts, YouTube)
- Review and update descriptions as needed

### Upload Guest Photos

Batch upload photos:

```bash
# 1. Add photos to public/guests/
# public/guests/vitalik-buterin.jpg
# public/guests/danny-ryan.jpg

# 2. Run upload script
npm run upload:photos
```

**What it does:**
- Finds all guests in Sanity
- Matches photos by slug
- Uploads and links photos
- Updates guest documents

### Export Data

Export all content for backup:

```bash
cd sanity
npx sanity dataset export production backup.tar.gz
```

### Import Data

Restore from backup:

```bash
cd sanity
npx sanity dataset import backup.tar.gz production
```

:::caution[Destructive]
Import replaces existing data. Use with caution!
:::

## Content Best Practices

### 1. Consistent Episode Numbering

```
Episode 1, 2, 3, ... (sequential)
✅ Makes chronology clear
✅ Easy to reference
❌ Don't skip numbers
```

### 2. SEO-Friendly Descriptions

```
✅ "In this episode, we explore Ethereum scaling solutions with Vitalik Buterin..."
❌ "Great episode! Listen now!"
```

- Be specific and descriptive
- Include guest names
- Include key topics
- 150-300 characters ideal

### 3. High-Quality Images

**Cover Images:**
- 3000x3000px recommended
- Square aspect ratio
- JPG or PNG format
- Under 2MB file size

**Guest Photos:**
- 800x800px minimum
- Square aspect ratio
- Professional headshots
- Consistent style across guests

### 4. Complete Platform Links

Add all platform links:
```
✅ Spotify URL
✅ Apple Podcasts URL
✅ YouTube URL (if video)
✅ RSS Feed URL
```

More links = better distribution!

### 5. Rich Show Notes

Use block content for formatted show notes:

```
✅ Use headings for structure
✅ Add timestamps (00:15:30 - Topic discussion)
✅ Include links to resources
✅ Format with bold/italic for emphasis
❌ Don't paste plain text
```

## Content Organization

### Filtering

Filter episodes in Studio:

1. Click **"Episode"** in sidebar
2. Use search bar to find episodes
3. Use filter dropdown to filter by:
   - Featured
   - Has transcript
   - Date range

### Sorting

Sort by:
- **Episode Number** (default)
- **Publish Date**
- **Last Modified**

### Searching

Global search:

1. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux)
2. Type search query
3. Results show across all document types

## Document Status

### Draft

Changes not yet published:

```
📝 Draft badge visible
↓
Make changes, click "Publish" when ready
```

### Published

Live content:

```
✅ Published badge
↓
Changes require new "Publish" click
```

### Changed

Published document with unpublished changes:

```
⚠️ Changes badge
↓
Click "Publish" to make changes live
```

## Keyboard Shortcuts

### Global

- **Cmd/Ctrl + K** - Global search
- **Cmd/Ctrl + S** - Save changes
- **Cmd/Ctrl + Shift + P** - Publish
- **Esc** - Close dialog/panel

### In Editor

- **Cmd/Ctrl + B** - Bold text
- **Cmd/Ctrl + I** - Italic text
- **Cmd/Ctrl + K** - Add link

## Troubleshooting

### Can't find "Publish" button

Check top-right corner:
```
[Cancel] [Publish]  ← Top right of editor
```

### Changes not appearing on website

1. Check document is **Published** (not just saved)
2. Rebuild website:
   ```bash
   npm run build
   ```
3. Clear browser cache
4. Check build logs for errors

### Image not uploading

Check file size:
- **Maximum:** ~50MB per file
- **Recommended:** Under 5MB

Compress large images before upload.

### Reference not showing

Check referenced document exists and is published:

1. Click reference field
2. If empty list, create referenced document first
3. Example: Create Guest before adding to Episode

## Related

- **[Schemas](/sanity/schemas/)** - Understand schema structure
- **[Setup](/sanity/setup/)** - Initial configuration
- **[Sanity Helpers](/api/sanity-helpers/)** - Fetch content in code

## Next Steps

- **[Theme Configuration](/sanity/theme-configuration/)** - Customize visual theme
- **[Homepage Configuration](/sanity/homepage-configuration/)** - Configure homepage
- **[About Page Configuration](/sanity/about-page-configuration/)** - Configure about page
