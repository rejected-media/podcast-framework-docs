---
title: Sanity Helpers
description: Auto-configured helpers for fetching content from Sanity CMS
---

# Sanity Helpers

Sanity Helpers are convenience functions that automatically create a Sanity client from environment variables. They eliminate boilerplate code and make data fetching simple.

## Import

```typescript
import {
  getEpisodes,
  getEpisode,
  getGuests,
  getGuest,
  getPodcast,
  getFeatured
} from '@podcast-framework/core';
```

## Why Use Helpers?

### Without Helpers (Verbose)

```astro
---
import { createSanityClient, getAllEpisodes } from '@podcast-framework/core';

const sanityClient = createSanityClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true
});

const episodes = await getAllEpisodes(sanityClient);
---
```

### With Helpers (Simple)

```astro
---
import { getEpisodes } from '@podcast-framework/core';

const episodes = await getEpisodes();
---
```

**Result:** Same data, 80% less code!

## Functions

### `getEpisodes()`

Fetch all episodes with auto-configuration.

**Signature:**
```typescript
function getEpisodes(options?: {
  orderBy?: 'desc' | 'asc'
}): Promise<Episode[]>
```

**Parameters:**
- `options.orderBy` - Sort order by episode number (default: `'desc'`)

**Returns:** Array of episodes

**Examples:**
```astro
---
import { getEpisodes } from '@podcast-framework/core';

// Get all episodes (newest first)
const episodes = await getEpisodes();

// Get episodes oldest first
const episodesOldest = await getEpisodes({ orderBy: 'asc' });
---

<h1>All Episodes ({episodes.length})</h1>
{episodes.map(episode => (
  <article>
    <h2>Episode {episode.episodeNumber}: {episode.title}</h2>
  </article>
))}
```

**Episode Object:**
```typescript
interface Episode {
  _id: string;
  title: string;
  slug: { current: string };
  episodeNumber: number;
  publishDate: string;
  duration: string;
  description?: string;
  showNotes?: any[];
  spotifyLink?: string;
  applePodcastLink?: string;
  youtubeLink?: string;
  audioUrl?: string;
  coverImage?: { url: string };
  featured?: boolean;
  transcript?: string;
  transcriptSegments?: TranscriptSegment[];
  hosts?: Host[];
  guests?: Guest[];
}
```

### `getEpisode()`

Fetch single episode by slug.

**Signature:**
```typescript
function getEpisode(slug: string): Promise<Episode | null>
```

**Parameters:**
- `slug` - Episode slug

**Returns:** Episode object or `null` if not found

**Examples:**
```astro
---
import { getEpisode } from '@podcast-framework/core';

const episode = await getEpisode('the-future-of-ethereum');

if (!episode) {
  return Astro.redirect('/404');
}
---

<h1>{episode.title}</h1>
<p>{episode.description}</p>
```

**Error Handling:**
```astro
---
const episode = await getEpisode(Astro.params.slug);

if (!episode) {
  return new Response('Episode not found', { status: 404 });
}
---
```

### `getGuests()`

Fetch all guests alphabetically.

**Signature:**
```typescript
function getGuests(): Promise<Guest[]>
```

**Returns:** Array of guests (sorted by name)

**Examples:**
```astro
---
import { getGuests } from '@podcast-framework/core';

const guests = await getGuests();
---

<div class="grid grid-cols-4 gap-8">
  {guests.map(guest => (
    <a href={`/guest/${guest.slug.current}`}>
      <img src={guest.photo?.url} alt={guest.name} />
      <h3>{guest.name}</h3>
    </a>
  ))}
</div>
```

**Guest Object:**
```typescript
interface Guest {
  _id: string;
  name: string;
  slug: { current: string };
  bio?: string;
  photo?: { url: string };
  twitter?: string;
  website?: string;
  linkedin?: string;
}
```

### `getGuest()`

Fetch single guest by slug with their episodes.

**Signature:**
```typescript
function getGuest(slug: string): Promise<Guest | null>
```

**Parameters:**
- `slug` - Guest slug

**Returns:** Guest object with episodes array, or `null` if not found

**Examples:**
```astro
---
import { getGuest } from '@podcast-framework/core';

const guest = await getGuest('vitalik-buterin');

if (!guest) {
  return Astro.redirect('/404');
}
---

<article>
  <img src={guest.photo?.url} alt={guest.name} />
  <h1>{guest.name}</h1>
  <p>{guest.bio}</p>

  <!-- Guest's episodes -->
  <h2>Episodes featuring {guest.name}</h2>
  {guest.episodes?.map(episode => (
    <a href={`/episodes/${episode.slug.current}`}>
      Episode {episode.episodeNumber}: {episode.title}
    </a>
  ))}
</article>
```

**Guest with Episodes:**
```typescript
interface Guest {
  // ... standard fields
  episodes?: Episode[];  // All episodes featuring this guest
}
```

### `getPodcast()`

Fetch podcast metadata.

**Signature:**
```typescript
function getPodcast(): Promise<PodcastInfo | undefined>
```

**Returns:** Podcast info or `undefined` if not found

**Examples:**
```astro
---
import { getPodcast } from '@podcast-framework/core';

const podcast = await getPodcast();
const siteName = podcast?.name || 'Podcast';
---

<title>{siteName}</title>
<meta name="description" content={podcast?.description} />
```

**PodcastInfo Object:**
```typescript
interface PodcastInfo {
  _id: string;
  name: string;
  tagline?: string;
  description?: string;
  isActive: boolean;
  logo?: { url: string };
  spotifyShowId?: string;
  applePodcastsUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  rssUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
  theme?: Theme;
}
```

### `getFeatured()`

Fetch featured episodes.

**Signature:**
```typescript
function getFeatured(limit?: number): Promise<Episode[]>
```

**Parameters:**
- `limit` - Maximum number of episodes to return (optional)

**Returns:** Array of featured episodes (sorted by publish date, newest first)

**Examples:**
```astro
---
import { getFeatured } from '@podcast-framework/core';

// Get all featured episodes
const featured = await getFeatured();

// Get top 3 featured episodes
const top3 = await getFeatured(3);
---

<FeaturedEpisodesCarousel episodes={featured} />
```

**Marking Episodes as Featured:**
```typescript
// In Sanity Studio
{
  _type: 'episode',
  title: 'The Future of Ethereum',
  featured: true  // ← Mark as featured
}
```

## Auto-Configuration

Helpers automatically read from environment variables:

```bash
# .env
PUBLIC_SANITY_PROJECT_ID="abc123"
PUBLIC_SANITY_DATASET="production"
```

**Configuration:**
```typescript
// Reads automatically from import.meta.env
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

// Creates client once (cached globally)
const client = createSanityClient({ projectId, dataset });
```

**Benefits:**
- ✅ No manual client creation
- ✅ Single client instance (performance)
- ✅ Automatic env validation
- ✅ Consistent configuration

## Build-Time Caching

All helpers use build-time caching to prevent redundant API calls:

```typescript
// First call: Fetches from Sanity
const episodes1 = await getEpisodes();  // API call

// Second call: Returns cached data
const episodes2 = await getEpisodes();  // Cache hit (same build)
```

**Cache Behavior:**
- **During build:** Cached for 1 minute
- **During dev:** No caching (fresh data)
- **Between builds:** Cache cleared

**Performance Impact:**
```
Without caching:
- 100 pages × 3 queries = 300 API calls
- Build time: ~2 minutes

With caching:
- Unique queries cached = 5-10 API calls
- Build time: ~20 seconds
```

## Complete Example

```astro
---
// src/pages/index.astro
import {
  getPodcast,
  getEpisodes,
  getFeatured
} from '@podcast-framework/core';

import BaseLayout from '@podcast-framework/core/layouts/BaseLayout.astro';
import FeaturedEpisodesCarousel from '@podcast-framework/core/components/FeaturedEpisodesCarousel.astro';

// Fetch all data (cached automatically)
const podcast = await getPodcast();
const recentEpisodes = await getEpisodes({ orderBy: 'desc' });
const featured = await getFeatured(3);

// Take first 6 episodes
const episodes = recentEpisodes.slice(0, 6);
---

<BaseLayout
  title={podcast?.name}
  description={podcast?.description}
>
  <!-- Hero -->
  <section class="hero">
    <h1>{podcast?.name}</h1>
    <p>{podcast?.tagline}</p>
  </section>

  <!-- Featured Episodes -->
  {featured && featured.length > 0 && (
    <FeaturedEpisodesCarousel episodes={featured} />
  )}

  <!-- Recent Episodes -->
  <section>
    <h2>Recent Episodes</h2>
    <div class="grid grid-cols-3 gap-6">
      {episodes.map(episode => (
        <article>
          <a href={`/episodes/${episode.slug.current}`}>
            <img src={episode.coverImage?.url} alt={episode.title} />
            <h3>Episode {episode.episodeNumber}: {episode.title}</h3>
          </a>
        </article>
      ))}
    </div>
  </section>

  <!-- Active podcast CTA -->
  {podcast?.isActive && (
    <section>
      <h2>Subscribe to {podcast.name}</h2>
      <NewsletterSignup />
    </section>
  )}
</BaseLayout>
```

## Error Handling

### Missing Project ID

```typescript
// Throws helpful error
await getEpisodes();
// → Error: Missing Sanity project ID. Add PUBLIC_SANITY_PROJECT_ID to your .env file
```

### Network Errors

```typescript
try {
  const episodes = await getEpisodes();
} catch (error) {
  console.error('Failed to fetch episodes:', error);
  // Return empty array or show error message
}
```

Helpers handle errors gracefully:
```typescript
// Returns empty array on error (doesn't throw)
const episodes = await getEpisodes();
// → [] (if API fails)

// Returns null on error (doesn't throw)
const episode = await getEpisode('slug');
// → null (if not found or API fails)
```

## Advanced Usage

### Custom Sorting

```typescript
// Get episodes, then sort by title
const episodes = await getEpisodes();
const sortedByTitle = [...episodes].sort((a, b) =>
  a.title.localeCompare(b.title)
);
```

### Filtering

```typescript
// Get episodes, then filter
const episodes = await getEpisodes();

const longEpisodes = episodes.filter(ep => {
  const seconds = parseDuration(ep.duration);
  return seconds > 3600; // Over 1 hour
});

const recentEpisodes = episodes.filter(ep => {
  const date = new Date(ep.publishDate);
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  return date > monthAgo;
});
```

### Pagination

```typescript
const episodes = await getEpisodes();
const pageSize = 10;
const page = 1;

const paginated = episodes.slice(
  (page - 1) * pageSize,
  page * pageSize
);
```

### Grouping

```typescript
const episodes = await getEpisodes();

// Group by year
const byYear = episodes.reduce((acc, episode) => {
  const year = new Date(episode.publishDate).getFullYear();
  if (!acc[year]) acc[year] = [];
  acc[year].push(episode);
  return acc;
}, {} as Record<number, Episode[]>);

// Result:
// {
//   2024: [episode1, episode2, ...],
//   2023: [episode3, episode4, ...],
// }
```

## Performance Tips

### 1. Fetch Once, Use Everywhere

```astro
---
// ✅ Good - Fetch once
const episodes = await getEpisodes();
const featured = episodes.filter(ep => ep.featured);
const recent = episodes.slice(0, 6);

// ❌ Bad - Multiple fetches
const featured = await getEpisodes(); // Fetch 1
const recent = await getEpisodes();    // Fetch 2 (redundant)
---
```

### 2. Use Limit for Featured

```astro
---
// ✅ Good - Limit at query level
const featured = await getFeatured(3);

// ❌ Less efficient - Fetch all, then slice
const allFeatured = await getFeatured();
const top3 = allFeatured.slice(0, 3);
---
```

### 3. Build-Time Caching is Automatic

```astro
---
// First component: API call
const episodes1 = await getEpisodes();

// Second component: Cached (same build)
const episodes2 = await getEpisodes();
// → No API call, returns cached data
---
```

## Troubleshooting

### "Missing Sanity project ID"

Add to `.env`:

```bash
PUBLIC_SANITY_PROJECT_ID="your-project-id"
PUBLIC_SANITY_DATASET="production"
```

Get project ID:
```bash
npx sanity projects list
```

### Returns empty array

Check Sanity Studio has content:

1. Open http://localhost:3333
2. Create an episode
3. Click "Publish"
4. Rebuild site: `npm run build`

### Returns `undefined` or `null`

Check that document exists in Sanity:

```typescript
const podcast = await getPodcast();

if (!podcast) {
  console.log('No podcast document found in Sanity');
}
```

Create podcast document in Sanity Studio.

### Stale data in dev mode

Restart dev server to clear cache:

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Direct Sanity Client Access

For advanced queries, use low-level functions:

```typescript
import {
  createSanityClient,
  getAllEpisodes
} from '@podcast-framework/core';

const client = createSanityClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true
});

// Custom query
const customEpisodes = await client.fetch(`
  *[_type == "episode" && _id in $ids] {
    title,
    slug,
    customField
  }
`, { ids: ['id1', 'id2'] });
```

## Related

- **[Sanity Setup](/sanity/setup/)** - Configure Sanity CMS
- **[Content Management](/sanity/content-management/)** - Add content
- **[Static Paths](/api/static-paths/)** - Generate pages from content

## Next Steps

- **[Static Paths](/api/static-paths/)** - Generate dynamic pages
- **[Sanity CMS](/sanity/setup/)** - Set up your CMS
- **[Components](/components/overview/)** - Use data in components
