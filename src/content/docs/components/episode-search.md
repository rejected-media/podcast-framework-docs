---
title: Episode Search Component
description: Client-side episode search with fuzzy matching
---

# Episode Search Component

The EpisodeSearch component provides real-time, client-side search for filtering episodes by title, description, and guest names. Uses vanilla JavaScript for minimal bundle size.

## Features

- ✅ Real-time search as user types
- ✅ Fuzzy matching (case-insensitive, partial matches)
- ✅ Searches across multiple fields (title, description, guests)
- ✅ Preserves original order when no search query
- ✅ Shows result count
- ✅ Keyboard accessible (Escape to clear)
- ✅ Zero dependencies
- ✅ Mobile responsive

## Basic Usage

```astro
---
import EpisodeSearch from '@rejected-media/podcast-framework-core/components/EpisodeSearch.astro';
---

<EpisodeSearch />

<!-- Episode cards MUST have data attributes -->
<div>
  {episodes.map((episode) => (
    <article
      data-episode-card
      data-episode-title={episode.title}
      data-episode-description={episode.description}
      data-episode-guests={episode.guests?.map(g => g.name).join(', ')}
    >
      <!-- Episode content -->
    </article>
  ))}
</div>
```

:::danger[Required Data Attributes]
Episode cards **MUST** have data attributes for the search to work:
- `data-episode-card` - Identifies the card as searchable
- `data-episode-title` - Episode title
- `data-episode-description` - Episode description
- `data-episode-guests` - Guest names (comma-separated)
:::

## Props

### Optional Props

#### `placeholder`

**Type:** `string`
**Default:** `"Search episodes by title, guest, or topic..."`

Search input placeholder text.

```astro
<EpisodeSearch placeholder="Find an episode..." />
```

## Complete Example

```astro
---
import { getEpisodes } from '@rejected-media/podcast-framework-core';
import EpisodeSearch from '@rejected-media/podcast-framework-core/components/EpisodeSearch.astro';
import { formatDate, stripHTML } from '@rejected-media/podcast-framework-core';

const episodes = await getEpisodes();
---

<div class="max-w-6xl mx-auto px-4 py-12">
  <h1 class="text-4xl font-bold mb-8">All Episodes</h1>

  <!-- Search Component -->
  <EpisodeSearch placeholder="Search by title, guest, or topic..." />

  <!-- Episode Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {episodes.map((episode) => (
      <article
        data-episode-card
        data-episode-title={episode.title}
        data-episode-description={stripHTML(episode.description || '')}
        data-episode-guests={episode.guests?.map(g => g.name).join(', ') || ''}
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition"
      >
        <a href={`/episodes/${episode.slug.current}`}>
          <!-- Episode image -->
          {episode.coverImage?.url && (
            <img
              src={episode.coverImage.url}
              alt={episode.title}
              class="w-full h-48 object-cover rounded-t-lg"
            />
          )}

          <div class="p-6">
            <!-- Episode number -->
            <p class="text-sm text-blue-600 font-semibold mb-2">
              Episode {episode.episodeNumber}
            </p>

            <!-- Title -->
            <h2 class="text-xl font-bold text-gray-900 mb-2">
              {episode.title}
            </h2>

            <!-- Date -->
            <p class="text-sm text-gray-500 mb-3">
              {formatDate(episode.publishDate)}
            </p>

            <!-- Guests -->
            {episode.guests && episode.guests.length > 0 && (
              <p class="text-sm text-gray-600 mb-3">
                with {episode.guests.map(g => g.name).join(', ')}
              </p>
            )}

            <!-- Description -->
            <p class="text-gray-700 line-clamp-3">
              {stripHTML(episode.description || '')}
            </p>
          </div>
        </a>
      </article>
    ))}
  </div>
</div>
```

## How It Works

### 1. Text Normalization

The search normalizes text for matching:

```javascript
function normalizeText(text) {
  return text
    .toLowerCase()                    // Case-insensitive
    .replace(/[^a-z0-9\s]/g, ' ')    // Remove special chars
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .trim();
}

// Example:
// "The Economics of MEV!" → "the economics of mev"
```

### 2. Field Aggregation

Combines all searchable fields:

```javascript
const title = episode.getAttribute('data-episode-title') || '';
const description = episode.getAttribute('data-episode-description') || '';
const guests = episode.getAttribute('data-episode-guests') || '';

const searchableText = normalizeText(`${title} ${description} ${guests}`);
```

### 3. Matching

Simple substring matching:

```javascript
return searchableText.includes(normalizedQuery);
```

**Match Examples:**
- Query: "vitalik" → Matches "with Vitalik Buterin"
- Query: "eth" → Matches "Ethereum Foundation" or "Vitalik"
- Query: "scaling" → Matches "Scaling Solutions" or "MEV and scaling"

## Search Behavior

### Real-time Filtering

Episodes are filtered as you type:

```
Initial view: 69 episodes visible

Type "vitalik"
↓
Found 3 of 69 episodes
(Only 3 visible)

Clear search
↓
69 episodes visible (original order restored)
```

### Result Count

Shows match count when searching:

```
┌────────────────────────────────┐
│ [Search episodes...]           │
└────────────────────────────────┘
  Found 5 of 69 episodes
```

Hidden when search is empty.

### Keyboard Shortcuts

- **Type** - Start searching
- **Escape** - Clear search and blur input
- **Tab** - Navigate to/from search input

## Styling

### CSS Custom Properties

```css
--color-primary    /* Focus ring color */
```

### Custom Styles

```astro
<EpisodeSearch />

<style is:global>
  #episode-search {
    border-radius: 0.5rem;
    border: 2px solid #e5e7eb;
    font-size: 1.125rem;
    padding: 1rem 1rem 1rem 3rem;
  }

  #episode-search:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
</style>
```

## Accessibility

### ARIA Labels

```html
<input
  type="text"
  id="episode-search"
  aria-label="Search episodes"
/>

<div
  id="search-results-count"
  role="status"
  aria-live="polite"
>
  Found 5 of 69 episodes
</div>
```

### Screen Readers

- Search input has descriptive `aria-label`
- Result count updates announced via `aria-live="polite"`
- Episodes maintain semantic structure when hidden

## Performance

- **Bundle Size:** ~1 KB (vanilla JavaScript)
- **Search Speed:** Instant (client-side)
- **Memory:** Minimal (no data duplication)
- **Dependencies:** Zero

**Performance Characteristics:**
```
Episodes: 69
Search time: <5ms
DOM updates: ~60-70 style changes
Frame rate: 60fps (smooth)
```

## Customization Examples

### Example 1: Custom Placeholder

```astro
<EpisodeSearch placeholder="Find your favorite episode..." />
```

### Example 2: With Analytics

```astro
<EpisodeSearch />

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('episode-search');

    let searchTimeout;
    searchInput?.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = e.target.value;

        if (query && window.gtag) {
          gtag('event', 'search', {
            search_term: query,
            event_category: 'engagement'
          });
        }
      }, 1000); // Track after 1 second of no typing
    });
  });
</script>
```

### Example 3: Search with Filters

```astro
---
import EpisodeSearch from '@rejected-media/podcast-framework-core/components/EpisodeSearch.astro';
---

<div class="flex flex-col md:flex-row gap-4 mb-8">
  <!-- Search -->
  <div class="flex-grow">
    <EpisodeSearch />
  </div>

  <!-- Sort Filter -->
  <select
    id="sort-episodes"
    class="px-4 py-3 border border-gray-300 rounded-lg"
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="title">Title A-Z</option>
  </select>
</div>

<script>
  const sortSelect = document.getElementById('sort-episodes');
  const episodeCards = Array.from(document.querySelectorAll('[data-episode-card]'));

  sortSelect?.addEventListener('change', (e) => {
    const sortBy = e.target.value;
    const container = episodeCards[0]?.parentElement;

    if (!container) return;

    // Sort logic
    const sorted = [...episodeCards].sort((a, b) => {
      if (sortBy === 'title') {
        const titleA = a.getAttribute('data-episode-title') || '';
        const titleB = b.getAttribute('data-episode-title') || '';
        return titleA.localeCompare(titleB);
      }
      // Add more sort options...
      return 0;
    });

    // Re-append in sorted order
    sorted.forEach(card => container.appendChild(card));
  });
</script>
```

## Advanced Usage

### Searching Custom Fields

Add custom data attributes for additional search fields:

```astro
<article
  data-episode-card
  data-episode-title={episode.title}
  data-episode-description={episode.description}
  data-episode-guests={episode.guests?.map(g => g.name).join(', ')}
  data-episode-tags={episode.tags?.join(', ')}           <!-- Custom field -->
  data-episode-topics={episode.topics?.join(', ')}       <!-- Custom field -->
>
  <!-- Content -->
</article>
```

Then extend the search logic:

```javascript
// Get searchable text including custom fields
const title = episode.getAttribute('data-episode-title') || '';
const description = episode.getAttribute('data-episode-description') || '';
const guests = episode.getAttribute('data-episode-guests') || '';
const tags = episode.getAttribute('data-episode-tags') || '';
const topics = episode.getAttribute('data-episode-topics') || '';

const searchableText = normalizeText(`${title} ${description} ${guests} ${tags} ${topics}`);
```

### Search Highlighting

Highlight matching text in results:

```astro
<script>
  function highlightMatches(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1">$1</mark>');
  }

  // Apply after filtering
  const searchInput = document.getElementById('episode-search');
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value;

    document.querySelectorAll('[data-episode-card]').forEach(card => {
      const title = card.querySelector('h2');
      const originalTitle = card.getAttribute('data-episode-title');

      if (title && originalTitle) {
        title.innerHTML = highlightMatches(originalTitle, query);
      }
    });
  });
</script>
```

## Troubleshooting

### Search not working

Check that episode cards have required data attributes:

```html
<!-- ❌ Missing attributes -->
<article>
  <h2>Episode Title</h2>
</article>

<!-- ✅ With attributes -->
<article
  data-episode-card
  data-episode-title="Episode Title"
  data-episode-description="Description here"
  data-episode-guests="Guest Name"
>
  <h2>Episode Title</h2>
</article>
```

### Episodes not reappearing after clearing search

Ensure you're not removing episodes from DOM:

```javascript
// ❌ Don't remove from DOM
episode.remove();

// ✅ Hide with CSS
episode.style.display = 'none';  // Hidden
episode.style.display = '';       // Visible
```

### Search too slow with many episodes

The component is optimized for up to ~200 episodes. For more:

```javascript
// Debounce search input
let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filterEpisodes();
  }, 150); // Wait 150ms after typing stops
});
```

## Related Components

- **[Episode Card](/examples/episode-card/)** - Example episode card layout
- **[Episode Archive](/examples/episode-archive/)** - Complete episodes page

## Next Steps

- **[Episodes Page Template](/getting-started/project-structure/)** - Set up episodes archive
- **[Utilities](/api/utilities/)** - Use `stripHTML()` for descriptions
- **[Customization](/customization/component-overrides/)** - Override search component
