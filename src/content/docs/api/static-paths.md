---
title: Static Paths
description: Generate static paths for dynamic routes
---

# Static Paths

Static Paths helpers eliminate getStaticPaths() boilerplate for common patterns like episodes and guests pages. These functions fetch data from Sanity and generate Astro static paths automatically.

## Import

```typescript
import {
  getStaticPathsForEpisodes,
  getStaticPathsForGuests
} from '@rejected-media/podcast-framework-core';
```

## Why Use Static Paths Helpers?

### Without Helpers (Boilerplate)

```astro
---
// src/pages/episodes/[slug].astro
import { getEpisodes } from '@rejected-media/podcast-framework-core';

export async function getStaticPaths() {
  const episodes = await getEpisodes();

  return episodes.map((episode) => ({
    params: { slug: episode.slug.current },
    props: { episode },
  }));
}

const { episode } = Astro.props;
---
```

### With Helpers (One Line)

```astro
---
// src/pages/episodes/[slug].astro
import { getStaticPathsForEpisodes } from '@rejected-media/podcast-framework-core';

export const getStaticPaths = getStaticPathsForEpisodes;

const { episode } = Astro.props;
---
```

**Result:** Same functionality, 90% less code!

## Functions

### `getStaticPathsForEpisodes()`

Generate static paths for all episodes.

**Signature:**
```typescript
function getStaticPathsForEpisodes(): Promise<Array<{
  params: { slug: string };
  props: { episode: Episode };
}>>
```

**Returns:** Array of path objects for Astro

**Complete Example:**
```astro
---
// src/pages/episodes/[slug].astro
import { getStaticPathsForEpisodes, formatDate } from '@rejected-media/podcast-framework-core';
import BaseLayout from '@rejected-media/podcast-framework-core/layouts/BaseLayout.astro';

export const getStaticPaths = getStaticPathsForEpisodes;

const { episode } = Astro.props;
---

<BaseLayout title={episode.title}>
  <article>
    <h1>Episode {episode.episodeNumber}: {episode.title}</h1>
    <p>Published: {formatDate(episode.publishDate)}</p>
    <p>{episode.description}</p>
  </article>
</BaseLayout>
```

**What It Generates:**

For episodes with slugs: `"ep-1"`, `"ep-2"`, `"ep-3"`, generates:

```typescript
[
  {
    params: { slug: 'ep-1' },
    props: { episode: { title: '...', episodeNumber: 1, ... } }
  },
  {
    params: { slug: 'ep-2' },
    props: { episode: { title: '...', episodeNumber: 2, ... } }
  },
  {
    params: { slug: 'ep-3' },
    props: { episode: { title: '...', episodeNumber: 3, ... } }
  }
]
```

**Generated Routes:**
```
/episodes/ep-1  → Episode 1 page
/episodes/ep-2  → Episode 2 page
/episodes/ep-3  → Episode 3 page
```

### `getStaticPathsForGuests()`

Generate static paths for all guests.

**Signature:**
```typescript
function getStaticPathsForGuests(): Promise<Array<{
  params: { slug: string };
  props: { guest: Guest };
}>>
```

**Returns:** Array of path objects for Astro

**Complete Example:**
```astro
---
// src/pages/guest/[slug].astro
import { getStaticPathsForGuests } from '@rejected-media/podcast-framework-core';
import BaseLayout from '@rejected-media/podcast-framework-core/layouts/BaseLayout.astro';

export const getStaticPaths = getStaticPathsForGuests;

const { guest } = Astro.props;
---

<BaseLayout title={guest.name}>
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
</BaseLayout>
```

**Generated Routes:**
```
/guest/vitalik-buterin     → Guest profile page
/guest/danny-ryan          → Guest profile page
/guest/patrick-mccorry     → Guest profile page
```

## How It Works

### 1. Fetch Data

```typescript
// getStaticPathsForEpisodes
const episodes = await getEpisodes();
```

### 2. Map to Path Objects

```typescript
return episodes.map((episode) => ({
  params: { slug: episode.slug.current },
  props: { episode },
}));
```

### 3. Astro Generates Pages

Astro uses params to generate routes and passes props to the page component.

## TypeScript Support

Full type safety for props:

```astro
---
import type { Episode } from '@rejected-media/podcast-framework-core';
import { getStaticPathsForEpisodes } from '@rejected-media/podcast-framework-core';

export const getStaticPaths = getStaticPathsForEpisodes;

// TypeScript knows episode type
const { episode }: { episode: Episode } = Astro.props;

// Autocomplete and type checking work
const title = episode.title;  // ✅ TypeScript knows this exists
const invalid = episode.xyz;  // ❌ TypeScript error
---
```

## Custom Static Paths

### Example 1: Filtered Episodes

```astro
---
// src/pages/featured/[slug].astro
import { getEpisodes } from '@rejected-media/podcast-framework-core';
import type { Episode } from '@rejected-media/podcast-framework-core';

export async function getStaticPaths() {
  const episodes = await getEpisodes();

  // Only featured episodes
  const featured = episodes.filter(ep => ep.featured);

  return featured.map((episode) => ({
    params: { slug: episode.slug.current },
    props: { episode },
  }));
}

const { episode }: { episode: Episode } = Astro.props;
---

<h1>Featured: {episode.title}</h1>
```

### Example 2: Paginated Episodes

```astro
---
// src/pages/episodes/page/[page].astro
import { getEpisodes } from '@rejected-media/podcast-framework-core';

export async function getStaticPaths() {
  const episodes = await getEpisodes();
  const pageSize = 10;
  const pageCount = Math.ceil(episodes.length / pageSize);

  return Array.from({ length: pageCount }, (_, i) => {
    const page = i + 1;
    const start = i * pageSize;
    const end = start + pageSize;

    return {
      params: { page: page.toString() },
      props: {
        episodes: episodes.slice(start, end),
        currentPage: page,
        totalPages: pageCount
      }
    };
  });
}

const { episodes, currentPage, totalPages } = Astro.props;
---

<h1>Episodes - Page {currentPage} of {totalPages}</h1>
{episodes.map(ep => <EpisodeCard episode={ep} />)}
```

### Example 3: Episodes by Year

```astro
---
// src/pages/archive/[year].astro
import { getEpisodes } from '@rejected-media/podcast-framework-core';

export async function getStaticPaths() {
  const episodes = await getEpisodes();

  // Group by year
  const byYear = episodes.reduce((acc, ep) => {
    const year = new Date(ep.publishDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(ep);
    return acc;
  }, {} as Record<number, Episode[]>);

  return Object.entries(byYear).map(([year, eps]) => ({
    params: { year },
    props: { episodes: eps, year: parseInt(year) }
  }));
}

const { episodes, year } = Astro.props;
---

<h1>{year} Episodes ({episodes.length})</h1>
```

## Performance

Static paths are generated at **build time only**:

```
Build Process:
1. Run getStaticPaths() → Fetch from Sanity
2. Generate HTML pages → Create /episodes/ep-1.html, etc.
3. Deploy static files → Instant load, no runtime queries

Runtime (Production):
- No database queries
- No API calls
- Instant page load (static HTML)
```

**Build Performance:**
```
69 episodes:
- getStaticPathsForEpisodes: ~200ms (1 API call, cached)
- Page generation: ~1.5s (69 HTML files)
- Total build: ~20s (full site)
```

## Troubleshooting

### "No routes generated"

Check that Sanity has content:

```bash
# List episodes in Sanity
npx sanity documents list episode
```

If empty, add episodes in Sanity Studio.

### "Slug is undefined"

Ensure episodes have valid slugs:

```typescript
// In Sanity
{
  _type: 'episode',
  slug: {
    _type: 'slug',
    current: 'episode-1'  // ← Must be defined
  }
}
```

### Build hangs during static path generation

Check for infinite loops or very slow queries:

```bash
# Add timeout
ASTRO_TELEMETRY_DISABLED=1 timeout 60 npm run build
```

Debug:
```typescript
export async function getStaticPaths() {
  console.log('Starting getStaticPaths...');
  const episodes = await getEpisodes();
  console.log(`Got ${episodes.length} episodes`);
  // ... rest of function
}
```

### Duplicate slugs error

Sanity allows duplicate slugs - add validation:

```typescript
export async function getStaticPaths() {
  const episodes = await getEpisodes();

  // Check for duplicates
  const slugs = episodes.map(ep => ep.slug.current);
  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);

  if (duplicates.length > 0) {
    console.error('Duplicate slugs found:', duplicates);
    throw new Error('Fix duplicate slugs in Sanity before building');
  }

  return episodes.map((episode) => ({
    params: { slug: episode.slug.current },
    props: { episode },
  }));
}
```

## Related

- **[Sanity Helpers](/api/sanity-helpers/)** - Fetch data for static paths
- **[Project Structure](/getting-started/project-structure/)** - File-based routing
- **[Dynamic Routes](/advanced/dynamic-routes/)** - Advanced routing patterns

## Next Steps

- **[Hosting Adapter](/api/hosting-adapter/)** - Platform abstraction
- **[Server Services](/api/server-services/)** - Backend services
- **[Deployment](/deployment/cloudflare-pages/)** - Deploy static site
