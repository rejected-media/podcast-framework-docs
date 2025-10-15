---
title: Featured Episodes Carousel Component
description: Auto-progressing carousel for featured episodes
---

# Featured Episodes Carousel Component

The FeaturedEpisodesCarousel component displays featured episodes in a horizontal carousel with auto-progression, navigation controls, and dot indicators.

## Features

- ✅ Auto-progression (configurable interval)
- ✅ Previous/Next navigation buttons
- ✅ Dot indicators with click navigation
- ✅ Loops from last to first episode
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Hover pause (auto-progression resets on interaction)
- ✅ Window resize handling

## Basic Usage

```astro
---
import { getFeatured } from '@podcast-framework/core';
import FeaturedEpisodesCarousel from '@podcast-framework/core/components/FeaturedEpisodesCarousel.astro';

const featuredEpisodes = await getFeatured();
---

<FeaturedEpisodesCarousel episodes={featuredEpisodes} />
```

## Props

### Required Props

#### `episodes`

**Type:** `Episode[]`
**Required:** Yes

Array of episodes to display in the carousel.

```astro
<FeaturedEpisodesCarousel episodes={featuredEpisodes} />
```

### Optional Props

#### `title`

**Type:** `string`
**Default:** `"Featured Episodes"`

Carousel section title.

```astro
<FeaturedEpisodesCarousel
  episodes={featuredEpisodes}
  title="Top Episodes"
/>
```

#### `fallbackImage`

**Type:** `string`
**Default:** `undefined`

Fallback image URL when episode has no cover image.

```astro
<FeaturedEpisodesCarousel
  episodes={featuredEpisodes}
  fallbackImage="/default-cover.jpg"
/>
```

#### `theme`

**Type:** `Theme`
**Default:** `defaultTheme`

Theme configuration for colors and styling.

```astro
---
import { getPodcast } from '@podcast-framework/core';

const podcast = await getPodcast();
---

<FeaturedEpisodesCarousel
  episodes={featuredEpisodes}
  theme={podcast?.theme}
/>
```

#### `autoProgressInterval`

**Type:** `number` (milliseconds)
**Default:** `6000` (6 seconds)

Auto-progression interval in milliseconds.

```astro
<FeaturedEpisodesCarousel
  episodes={featuredEpisodes}
  autoProgressInterval={8000}  // 8 seconds
/>
```

## Complete Example

```astro
---
import { getFeatured, getPodcast } from '@podcast-framework/core';
import FeaturedEpisodesCarousel from '@podcast-framework/core/components/FeaturedEpisodesCarousel.astro';
import BaseLayout from '@podcast-framework/core/layouts/BaseLayout.astro';

const featuredEpisodes = await getFeatured();
const podcast = await getPodcast();
---

<BaseLayout title="Home">
  <!-- Hero Section -->
  <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h1 class="text-5xl font-bold mb-4">{podcast?.name}</h1>
      <p class="text-xl">{podcast?.tagline}</p>
    </div>
  </section>

  <!-- Featured Episodes Carousel -->
  {featuredEpisodes && featuredEpisodes.length > 0 && (
    <FeaturedEpisodesCarousel
      episodes={featuredEpisodes}
      title="Featured Episodes"
      fallbackImage={podcast?.logo?.url}
      theme={podcast?.theme}
      autoProgressInterval={7000}
    />
  )}

  <!-- More content... -->
</BaseLayout>
```

## Carousel Behavior

### Auto-progression

The carousel automatically advances every 6 seconds (or your configured interval):

```
Episode 1 → (6 seconds) → Episode 2 → (6 seconds) → Episode 3 → (loop) → Episode 1
```

### User Interaction Resets Timer

Any user interaction resets the auto-progression timer:

```
Episode 1 → (3 seconds) → User clicks Next → Episode 2 → (6 seconds) → Episode 3
                                                         ^
                                                    Timer reset
```

### Looping

Carousel loops from last to first:

```
← [Episode 1] [Episode 2] [Episode 3] →
      ↑                         |
      └─────── Loops back ──────┘
```

## Navigation Controls

### Previous/Next Buttons

```
┌─────────────────────────────────────┐
│  Featured Episodes         [<] [>]  │
├─────────────────────────────────────┤
│  [    Episode Card Content    ]     │
└─────────────────────────────────────┘
```

- **Previous (`<`)** - Disabled on first episode
- **Next (`>`)** - Advances to next (loops on last)

### Dot Indicators

```
               ● ○ ○
            (Episode 1 active)
```

- Click any dot to jump to that episode
- Active dot is larger and fully opaque
- Inactive dots are smaller and semi-transparent

## Episode Card Layout

### Desktop Layout

```
┌───────────────────────────────────────────────┐
│                                               │
│  ┌────────┐  Episode 42                      │
│  │        │  The Future of Ethereum          │
│  │ Image  │                                   │
│  │        │  Guests: Vitalik Buterin          │
│  └────────┘                                   │
│             This episode explores...          │
│                                               │
└───────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────┐
│                  │
│  ┌────────────┐  │
│  │   Image    │  │
│  └────────────┘  │
│                  │
│  Episode 42      │
│  The Future...   │
│                  │
│  Guests: V...    │
│  Description...  │
│                  │
└──────────────────┘
```

## Styling

### CSS Custom Properties

```css
--color-surface       /* Carousel background */
--color-text          /* Text color */
--color-text-muted    /* Description color */
--color-primary       /* Accent color (borders, episode number) */
--color-background    /* Button background */
```

### Theme Variables

Uses Tailwind classes with theme-aware styles:

```astro
<FeaturedEpisodesCarousel episodes={episodes} />

<style>
  /* Custom carousel styling */
  [role="region"][aria-label="Featured Episodes Carousel"] {
    border-radius: 1rem;
  }

  .carousel-dot {
    transition: all 0.3s ease;
  }

  .carousel-dot:hover {
    opacity: 1;
    transform: scale(1.2);
  }
</style>
```

## Accessibility

### ARIA Labels

```html
<section
  role="region"
  aria-label="Featured Episodes Carousel"
>
  <div role="list" aria-live="polite">
    <a
      role="listitem"
      aria-posinset="1"
      aria-setsize="3"
      aria-label="Episode 42: The Future of Ethereum"
    >
      <!-- Episode content -->
    </a>
  </div>
</section>

<button
  aria-label="Previous episode"
  disabled={currentIndex === 0}
>
  ←
</button>

<button
  aria-label="Next episode"
>
  →
</button>

<button
  aria-label="Go to episode 2"
  class="carousel-dot"
>
  •
</button>
```

### Keyboard Navigation

- **Tab** - Navigate through buttons and episode links
- **Enter/Space** - Activate focused button or link
- **Arrow keys** - Navigate through dots when focused

### Screen Readers

- Carousel identified as region
- Episodes announced as list items
- Navigation buttons have descriptive labels
- Current slide position announced

## Performance

- **Bundle Size:** ~2 KB (including carousel logic)
- **JavaScript:** Vanilla JS, zero dependencies
- **Auto-progression:** Uses `setInterval` (cleanup on unload)
- **Resize handling:** Debounced with `updateCarousel()`

## Customization Examples

### Example 1: Faster Auto-progression

```astro
<FeaturedEpisodesCarousel
  episodes={featuredEpisodes}
  autoProgressInterval={4000}  // 4 seconds
/>
```

### Example 2: Custom Styling

```astro
<FeaturedEpisodesCarousel episodes={featuredEpisodes} />

<style is:global>
  /* Custom card hover effect */
  [role="listitem"] {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  [role="listitem"]:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  /* Custom dot indicators */
  .carousel-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
  }
</style>
```

### Example 3: With Analytics

```astro
<FeaturedEpisodesCarousel episodes={featuredEpisodes} />

<script>
  // Track carousel interactions
  document.querySelectorAll('[role="listitem"]').forEach((card, index) => {
    card.addEventListener('click', () => {
      if (window.gtag) {
        gtag('event', 'featured_episode_click', {
          event_category: 'engagement',
          event_label: `position_${index + 1}`,
          value: index + 1
        });
      }
    });
  });

  // Track navigation button clicks
  document.getElementById('carousel-prev')?.addEventListener('click', () => {
    if (window.gtag) {
      gtag('event', 'carousel_prev', { event_category: 'interaction' });
    }
  });

  document.getElementById('carousel-next')?.addEventListener('click', () => {
    if (window.gtag) {
      gtag('event', 'carousel_next', { event_category: 'interaction' });
    }
  });
</script>
```

### Example 4: Pause on Hover

```astro
<FeaturedEpisodesCarousel episodes={featuredEpisodes} />

<script>
  let autoProgressTimer = null;

  const carousel = document.querySelector('[role="region"][aria-label*="Carousel"]');

  carousel?.addEventListener('mouseenter', () => {
    // Clear auto-progression on hover
    if (autoProgressTimer) {
      clearInterval(autoProgressTimer);
    }
  });

  carousel?.addEventListener('mouseleave', () => {
    // Resume auto-progression
    // (component already handles this via resetAutoProgress)
  });
</script>
```

## Advanced Usage

### Multiple Carousels on One Page

```astro
---
const featured = await getFeatured();
const recent = await getEpisodes({ limit: 5 });
---

<!-- Featured Episodes -->
<FeaturedEpisodesCarousel
  episodes={featured}
  title="Featured"
  autoProgressInterval={6000}
/>

<!-- Recent Episodes -->
<FeaturedEpisodesCarousel
  episodes={recent}
  title="Latest Episodes"
  autoProgressInterval={8000}
/>
```

Each carousel operates independently.

### Custom Episode Card

Override the episode card layout by creating your own carousel:

```astro
---
// Copy FeaturedEpisodesCarousel.astro to src/components/
// Modify the episode card section as needed
---
```

### Vertical Carousel

Modify the carousel for vertical scrolling:

```astro
<style>
  #carousel-container {
    flex-direction: column;
    transform: translateY(0);  /* Instead of translateX */
  }

  [role="listitem"] {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>
```

## Troubleshooting

### Carousel not auto-progressing

Check that JavaScript is enabled and the component has multiple episodes:

```astro
{featuredEpisodes && featuredEpisodes.length > 1 ? (
  <FeaturedEpisodesCarousel episodes={featuredEpisodes} />
) : (
  <p>Not enough episodes for carousel (need 2+)</p>
)}
```

### Images not showing

Verify episode has `coverImage.url`:

```typescript
// In Sanity query
"coverImage": coverImage.asset->{url}
```

Use `fallbackImage` prop for episodes without covers:

```astro
<FeaturedEpisodesCarousel
  episodes={featuredEpisodes}
  fallbackImage="/logo.png"
/>
```

### Navigation buttons not working

Ensure button IDs are unique (only one carousel per page, or modify IDs):

```javascript
// Component uses:
document.getElementById('carousel-prev')
document.getElementById('carousel-next')

// For multiple carousels, modify to use classes:
document.querySelectorAll('.carousel-prev')
```

### Carousel jumping on resize

The component handles resize with `updateCarousel()`. If issues persist, debounce:

```javascript
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateCarousel, 100);
});
```

## Related Components

- **[SkeletonLoader](/components/skeleton-loader/)** - Loading state for carousel
- **[Featured Episodes](/api/sanity-helpers/)** - Fetching featured episodes

## Next Steps

- **[Sanity Helpers](/api/sanity-helpers/)** - Use `getFeatured()` to fetch episodes
- **[Homepage Template](/examples/homepage/)** - Complete homepage with carousel
- **[Customization](/customization/component-overrides/)** - Override carousel component
