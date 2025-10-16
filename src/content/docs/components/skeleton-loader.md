---
title: Skeleton Loader Component
description: Loading placeholders for better perceived performance
---

# Skeleton Loader Component

The SkeletonLoader component provides loading placeholder UI while content is being fetched. Useful for improving perceived performance and reducing layout shift.

## Features

- ✅ 4 pre-built variants (episode-card, carousel, episode-list, guest-card)
- ✅ Configurable count (show multiple skeletons)
- ✅ Smooth pulse animation
- ✅ Matches actual content dimensions
- ✅ Fully responsive
- ✅ Zero JavaScript (pure CSS)
- ✅ Lightweight (~300 bytes)

## Basic Usage

```astro
---
import SkeletonLoader from '@rejected-media/podcast-framework-core/components/SkeletonLoader.astro';
---

<SkeletonLoader variant="episode-card" count={3} />
```

## Props

### Optional Props

#### `variant`

**Type:** `'episode-card' | 'carousel' | 'episode-list' | 'guest-card'`
**Default:** `'episode-card'`

Visual variant matching your content layout.

```astro
<SkeletonLoader variant="episode-card" />
<SkeletonLoader variant="carousel" />
<SkeletonLoader variant="episode-list" />
<SkeletonLoader variant="guest-card" />
```

#### `count`

**Type:** `number`
**Default:** `1`

Number of skeleton items to display.

```astro
<SkeletonLoader variant="episode-card" count={3} />
```

## Variants

### Episode Card

Matches standard episode card layout:

```
┌──────────────────┐
│ ████████████████ │  (Image)
│ ████████████████ │
│                  │
│ ████             │  (Episode number)
│ ████████████     │  (Title)
│ ████████         │  (Date)
│ ████████████████ │  (Description)
│ ████████████     │
└──────────────────┘
```

**Usage:**
```astro
<SkeletonLoader variant="episode-card" count={6} />
```

### Carousel

Matches carousel episode layout:

```
┌─────────────────────────────────────┐
│ ████████  ████                      │
│ ████████  ████████████              │
│ ████████  ████████                  │
│ ████████  ████████████████          │
│ ████████  ████████████████          │
│           ████████████              │
└─────────────────────────────────────┘
```

**Usage:**
```astro
<SkeletonLoader variant="carousel" />
```

### Episode List

Compact list item layout:

```
┌─────────────────────────────┐
│ ████  ████████████          │
│ ████  ████████              │
│       ████████████████      │
└─────────────────────────────┘
```

**Usage:**
```astro
<SkeletonLoader variant="episode-list" count={10} />
```

### Guest Card

Guest profile card with photo:

```
    ┌──────┐
    │ ████ │  (Photo circle)
    └──────┘
     ████      (Name)
```

**Usage:**
```astro
<SkeletonLoader variant="guest-card" count={4} />
```

## Complete Examples

### Example 1: Episodes Page with Skeleton

```astro
---
import { getEpisodes } from '@rejected-media/podcast-framework-core';
import SkeletonLoader from '@rejected-media/podcast-framework-core/components/SkeletonLoader.astro';

const episodes = Astro.url.searchParams.has('preview')
  ? null
  : await getEpisodes();
---

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {!episodes ? (
    <!-- Loading state -->
    <SkeletonLoader variant="episode-card" count={6} />
  ) : (
    <!-- Actual episodes -->
    episodes.map(episode => (
      <article class="bg-white rounded-lg shadow-md">
        <!-- Episode content -->
      </article>
    ))
  )}
</div>
```

### Example 2: Featured Carousel with Skeleton

```astro
---
import { getFeatured } from '@rejected-media/podcast-framework-core';
import FeaturedEpisodesCarousel from '@rejected-media/podcast-framework-core/components/FeaturedEpisodesCarousel.astro';
import SkeletonLoader from '@rejected-media/podcast-framework-core/components/SkeletonLoader.astro';

const featured = await getFeatured();
---

{!featured || featured.length === 0 ? (
  <SkeletonLoader variant="carousel" />
) : (
  <FeaturedEpisodesCarousel episodes={featured} />
)}
```

### Example 3: Guests Page with Skeleton

```astro
---
import { getGuests } from '@rejected-media/podcast-framework-core';
import SkeletonLoader from '@rejected-media/podcast-framework-core/components/SkeletonLoader.astro';

const guests = await getGuests();
---

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
  {!guests ? (
    <SkeletonLoader variant="guest-card" count={8} />
  ) : (
    guests.map(guest => (
      <a href={`/guest/${guest.slug.current}`} class="text-center">
        <img
          src={guest.photo?.url}
          alt={guest.name}
          class="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h3 class="font-semibold">{guest.name}</h3>
      </a>
    ))
  )}
</div>
```

### Example 4: Client-side Loading

```astro
---
import SkeletonLoader from '@rejected-media/podcast-framework-core/components/SkeletonLoader.astro';
---

<div id="episodes-container">
  <!-- Initial skeleton -->
  <SkeletonLoader variant="episode-card" count={6} />
</div>

<script>
  async function loadEpisodes() {
    const container = document.getElementById('episodes-container');

    try {
      const response = await fetch('/api/episodes');
      const episodes = await response.json();

      // Replace skeleton with actual content
      container.innerHTML = episodes.map(ep => `
        <article class="bg-white rounded-lg shadow-md p-6">
          <h2>${ep.title}</h2>
          <p>${ep.description}</p>
        </article>
      `).join('');
    } catch (error) {
      container.innerHTML = '<p>Failed to load episodes</p>';
    }
  }

  loadEpisodes();
</script>
```

## Animation

The skeleton uses a smooth pulse animation:

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Timing:**
- **Duration:** 2 seconds
- **Loop:** Infinite
- **Easing:** Cubic bezier (smooth)

## Styling

### Default Colors

```css
.bg-gray-200  /* Skeleton bar color (light gray) */
.bg-white     /* Card background (white) */
```

### Custom Colors

```astro
<SkeletonLoader variant="episode-card" count={3} />

<style is:global>
  .animate-pulse .bg-gray-200 {
    background-color: #e0e7ff;  /* Light blue */
  }

  .animate-pulse {
    background-color: #f8fafc;  /* Light gray background */
  }
</style>
```

### Dark Mode

```astro
<SkeletonLoader variant="episode-card" count={3} />

<style is:global>
  @media (prefers-color-scheme: dark) {
    .animate-pulse {
      background-color: #1e293b;  /* Dark background */
    }

    .animate-pulse .bg-gray-200 {
      background-color: #334155;  /* Dark gray bars */
    }
  }
</style>
```

## Performance

- **Bundle Size:** ~300 bytes (CSS only)
- **JavaScript:** None required
- **Render:** Static HTML at build time
- **Animation:** GPU-accelerated CSS

## Best Practices

### 1. Match Content Dimensions

Skeleton should match actual content size:

```astro
<!-- ✅ Skeleton matches card -->
<SkeletonLoader variant="episode-card" count={3} />

<!-- Cards have same dimensions -->
<article class="bg-white rounded-lg shadow-md p-6">
  <img class="w-full h-48" />
  <h2 class="text-xl">Title</h2>
</article>
```

### 2. Show Appropriate Count

Match the number of items you'll display:

```astro
---
const episodes = await getEpisodes({ limit: 6 });
---

<!-- Show 6 skeletons if loading 6 episodes -->
{!episodes ? (
  <SkeletonLoader variant="episode-card" count={6} />
) : (
  episodes.map(ep => <EpisodeCard episode={ep} />)
)}
```

### 3. Use for Slow Operations

Show skeletons for operations >200ms:

```astro
<!-- Fast query: No skeleton needed -->
const cached = getCachedEpisodes();  // <100ms

<!-- Slow query: Use skeleton -->
const fresh = await getEpisodesFromAPI();  // >500ms
```

### 4. Prevent Layout Shift

Skeleton should prevent Cumulative Layout Shift (CLS):

```
Before: [ Skeleton ] → After: [ Episode Card ]
            ↕                      ↕
     (Same height)          (No shift)
```

## Accessibility

### Screen Readers

Skeletons are decorative, no ARIA needed:

```html
<div class="animate-pulse" role="presentation">
  <!-- Skeleton content -->
</div>
```

### Reduced Motion

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
```

## Customization Examples

### Example 1: Custom Skeleton

Create a custom skeleton for your unique layout:

```astro
<div class="animate-pulse bg-white rounded-lg shadow-md p-6">
  <!-- Custom layout -->
  <div class="flex gap-4">
    <div class="w-20 h-20 bg-gray-200 rounded-full"></div>
    <div class="flex-grow space-y-2">
      <div class="h-6 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
</div>

<style>
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>
```

### Example 2: Shimmer Effect

Add a shimmer animation:

```astro
<SkeletonLoader variant="episode-card" count={3} />

<style is:global>
  .animate-pulse {
    position: relative;
    overflow: hidden;
  }

  .animate-pulse::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
</style>
```

### Example 3: Progressive Loading

Show skeletons, then load content progressively:

```astro
<div id="content-container" class="grid grid-cols-3 gap-6">
  <SkeletonLoader variant="episode-card" count={6} />
</div>

<script>
  async function loadContent() {
    const container = document.getElementById('content-container');
    const episodes = await fetchEpisodes();

    // Load one by one
    episodes.forEach((episode, index) => {
      setTimeout(() => {
        const skeletons = container.querySelectorAll('.animate-pulse');
        if (skeletons[0]) {
          skeletons[0].replaceWith(createEpisodeCard(episode));
        }
      }, index * 100); // 100ms delay between each
    });
  }
</script>
```

## Troubleshooting

### Skeleton doesn't match content

Check dimensions match your actual cards:

```astro
<!-- Skeleton -->
<div class="w-full h-48 bg-gray-200"></div>

<!-- Actual image -->
<img class="w-full h-48" />  <!-- Same height! -->
```

### Animation not working

Ensure CSS classes are present:

```html
<div class="animate-pulse">  <!-- Required class -->
  <div class="bg-gray-200"></div>
</div>
```

### Layout shift on load

Skeleton and content must have same dimensions:

```css
/* Both should have same height */
.skeleton-card { height: 400px; }
.episode-card { height: 400px; }
```

## Related Components

- **[Episode Card](/examples/episode-card/)** - Episode card to match skeleton
- **[Loading States](/examples/loading-states/)** - Complete loading patterns

## Next Steps

- **[Loading States](/examples/loading-states/)** - Implement loading patterns
- **[Performance](/advanced/performance/)** - Optimize perceived performance
- **[Customization](/customization/component-overrides/)** - Create custom skeletons
