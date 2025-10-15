---
title: Transcript Viewer Component
description: Collapsible transcript viewer with search and copy functionality
---

# Transcript Viewer Component

The TranscriptViewer component displays episode transcripts in a collapsible, searchable format with speaker formatting, search highlighting, and copy-to-clipboard functionality.

## Features

- ✅ Collapsible transcript section
- ✅ Client-side search within transcript
- ✅ Highlight search matches
- ✅ Speaker label formatting
- ✅ Copy to clipboard
- ✅ Scrollable content area
- ✅ Keyboard accessible (Escape to clear search)
- ✅ Mobile responsive

## Basic Usage

```astro
---
import TranscriptViewer from '@podcast-framework/core/components/TranscriptViewer.astro';

const episode = await getEpisode(Astro.params.slug);
---

<TranscriptViewer
  transcript={episode.transcript}
  episodeNumber={episode.episodeNumber}
/>
```

## Props

### Required Props

#### `episodeNumber`

**Type:** `number`
**Required:** Yes

Episode number for component IDs (allows multiple transcripts on one page).

```astro
<TranscriptViewer
  transcript={episode.transcript}
  episodeNumber={episode.episodeNumber}
/>
```

### Optional Props

#### `transcript`

**Type:** `string`
**Required:** No (component returns null if not provided)

The transcript text. Supports speaker formatting with `**Speaker A:**` pattern.

```astro
<TranscriptViewer
  transcript={episode.transcript}
  episodeNumber={1}
/>
```

#### `segments`

**Type:** `TranscriptSegment[]`
**Required:** No (not yet implemented)

Timestamped transcript segments for future enhancement.

```typescript
interface TranscriptSegment {
  start: number;  // Timestamp in seconds
  end: number;
  text: string;
}
```

## Complete Example

```astro
---
import { getEpisode } from '@podcast-framework/core';
import TranscriptViewer from '@podcast-framework/core/components/TranscriptViewer.astro';
import BaseLayout from '@podcast-framework/core/layouts/BaseLayout.astro';

const episode = await getEpisode(Astro.params.slug);
---

<BaseLayout title={episode.title}>
  <article class="max-w-4xl mx-auto px-4 py-12">
    <!-- Episode header -->
    <h1 class="text-4xl font-bold mb-4">{episode.title}</h1>
    <p class="text-lg text-gray-600 mb-8">{episode.description}</p>

    <!-- Spotify embed -->
    {episode.spotifyLink && (
      <iframe
        src={getSpotifyEmbedUrl(episode.spotifyLink)}
        width="100%"
        height="352"
        frameborder="0"
        allowfullscreen
        class="mb-12"
      ></iframe>
    )}

    <!-- Transcript -->
    {episode.transcript && (
      <TranscriptViewer
        transcript={episode.transcript}
        episodeNumber={episode.episodeNumber}
      />
    )}

    <!-- Show notes -->
    {episode.showNotes && (
      <div class="prose max-w-none">
        <h2>Show Notes</h2>
        <BlockContent blocks={episode.showNotes} />
      </div>
    )}
  </article>
</BaseLayout>
```

## Speaker Formatting

The component automatically formats speaker labels:

### Input Format

```
**Speaker A:** Hello, welcome to the show.
**Speaker B:** Thanks for having me!
**Speaker A:** Let's dive into the topic.
```

### Rendered Output

```
Speaker A:
Hello, welcome to the show.

Speaker B:
Thanks for having me!

Speaker A:
Let's dive into the topic.
```

Speakers are rendered with:
- **Bold, blue text** (`text-blue-600`)
- Block display with spacing
- Accessible semantic markup (`<strong>`)

## Search Functionality

### Search Features

1. **Real-time search** - Highlights as you type
2. **Match counting** - Shows number of matches
3. **Case-insensitive** - Matches "MEV", "mev", "Mev"
4. **XSS-safe** - Uses DOM manipulation (not `innerHTML`)

### Search UI

```
┌──────────────────────────────────────┐
│  [🔍 Search transcript...]           │
│  Found 3 matches                     │
└──────────────────────────────────────┘
```

### Highlighted Matches

```
The economics of MEV are complex.
                  ^^^
         (highlighted in yellow)
```

## Copy to Clipboard

Click "Copy" button to copy full transcript:

```
┌─────────────────────────────────┐
│  Transcript       [Copy] [Show] │
└─────────────────────────────────┘

Click "Copy"
↓
┌─────────────────────────────────┐
│  Transcript    [Copied!✓] [Show]│
└─────────────────────────────────┘
(Success message for 2 seconds)
```

## Component States

### Collapsed (Default)

```
┌─────────────────────────────────┐
│  Transcript  [Copy] [Show ▼]    │
└─────────────────────────────────┘
```

### Expanded

```
┌─────────────────────────────────┐
│  Transcript  [Copy] [Hide ▲]    │
├─────────────────────────────────┤
│  [🔍 Search transcript...]      │
│  Found 2 matches                │
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │
│  │ Speaker A:                │ │
│  │ This is the transcript... │ │
│  │                           │ │
│  │ Speaker B:                │ │
│  │ More transcript text...   │ │
│  └───────────────────────────┘ │
│  (Scrollable, max height 24rem) │
└─────────────────────────────────┘
```

## Styling

### CSS Custom Properties

```css
--color-primary    /* Button background, focus ring */
```

### Scrollbar Styling

Custom scrollbar for the transcript content:

```css
.max-h-96::-webkit-scrollbar {
  width: 8px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
```

### Custom Styles

```astro
<TranscriptViewer transcript={transcript} episodeNumber={1} />

<style is:global>
  #transcript-section {
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  #transcript-content mark {
    background: #fef08a;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }

  #transcript-content strong {
    color: #3b82f6;
    font-size: 1.125rem;
  }
</style>
```

## Accessibility

### ARIA Attributes

```html
<button
  id="toggle-transcript"
  aria-expanded="false"
  aria-controls="transcript-content"
>
  Show Transcript
</button>

<div
  id="transcript-content"
  class="hidden"
>
  <!-- Transcript -->
</div>

<input
  type="text"
  id="transcript-search"
  aria-label="Search transcript"
/>

<div
  id="search-results-info"
  role="status"
  aria-live="polite"
>
  Found 3 matches
</div>
```

### Keyboard Navigation

- **Tab** - Navigate buttons and inputs
- **Enter** - Toggle transcript
- **Escape** - Clear search (when focused in search input)
- **Arrow keys** - Scroll transcript content

### Screen Readers

- Button states announced (`aria-expanded`)
- Search results announced (`aria-live="polite"`)
- Collapsible section labeled (`aria-controls`)

## Performance

- **Bundle Size:** ~3 KB (including search logic)
- **JavaScript:** Required for interactivity
- **Search Speed:** <10ms for typical transcripts
- **Memory:** Transcript stored in data attribute

**Characteristics:**
```
Transcript length: 10,000 words
Search time: ~5ms
Highlighting: ~10ms
Total: <15ms (imperceptible)
```

## Customization Examples

### Example 1: Auto-expand on Load

```astro
<TranscriptViewer transcript={transcript} episodeNumber={1} />

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-transcript');
    toggleButton?.click(); // Auto-expand
  });
</script>
```

### Example 2: Jump to Transcript from URL

```astro
<TranscriptViewer transcript={transcript} episodeNumber={1} />

<script>
  // URL: /episode/1#transcript
  if (window.location.hash === '#transcript') {
    const toggleButton = document.getElementById('toggle-transcript');
    toggleButton?.click();

    setTimeout(() => {
      document.getElementById('transcript-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }
</script>
```

### Example 3: Download Transcript

```astro
<TranscriptViewer transcript={transcript} episodeNumber={1} />

<!-- Add download button -->
<button id="download-transcript">Download Transcript</button>

<script>
  const downloadBtn = document.getElementById('download-transcript');
  const transcriptContent = document.getElementById('transcript-content');

  downloadBtn?.addEventListener('click', () => {
    const transcript = transcriptContent?.getAttribute('data-transcript');
    if (!transcript) return;

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `episode-${episodeNumber}-transcript.txt`;
    a.click();

    URL.revokeObjectURL(url);
  });
</script>
```

### Example 4: Print-friendly Transcript

```astro
<TranscriptViewer transcript={transcript} episodeNumber={1} />

<style is:global>
  @media print {
    #toggle-transcript,
    #copy-transcript,
    #transcript-search-container {
      display: none !important;
    }

    #transcript-content {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
    }
  }
</style>
```

## Advanced Usage

### Timestamped Transcript

While `segments` prop is not yet fully implemented, you can add timestamp links:

```astro
---
const transcriptWithTimestamps = formatTranscriptWithTimestamps(episode.transcript);
---

<TranscriptViewer
  transcript={transcriptWithTimestamps}
  episodeNumber={episode.episodeNumber}
/>

<script>
  // Add timestamp click handlers
  document.querySelectorAll('[data-timestamp]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const timestamp = parseInt(link.getAttribute('data-timestamp'));
      seekToTimestamp(timestamp); // Implement for your player
    });
  });
</script>
```

### Multi-language Support

Add language toggle for translated transcripts:

```astro
---
const transcripts = {
  en: episode.transcript,
  es: episode.transcriptEs,
  fr: episode.transcriptFr
};

const currentLang = 'en';
---

<div class="flex gap-2 mb-4">
  <button data-lang="en">English</button>
  <button data-lang="es">Español</button>
  <button data-lang="fr">Français</button>
</div>

<TranscriptViewer
  transcript={transcripts[currentLang]}
  episodeNumber={episode.episodeNumber}
/>
```

## Troubleshooting

### Transcript not showing

Check that `transcript` prop has content:

```astro
{episode.transcript ? (
  <TranscriptViewer
    transcript={episode.transcript}
    episodeNumber={episode.episodeNumber}
  />
) : (
  <p>Transcript not available for this episode.</p>
)}
```

### Speaker formatting not working

Ensure speaker labels follow the exact format:

```
✅ **Speaker A:** Text here
✅ **Speaker B:** More text

❌ Speaker A: Text here (no asterisks)
❌ **Speaker A** Text here (no colon)
❌ ** Speaker A:** Text here (space after asterisks)
```

### Copy button not working

Check browser support for Clipboard API:

```javascript
if (!navigator.clipboard) {
  console.error('Clipboard API not supported');
  // Fallback to textarea method
}
```

### Search highlighting breaking layout

Ensure marks don't break word boundaries:

```css
#transcript-content mark {
  display: inline;      /* Not block */
  white-space: normal;  /* Allow wrapping */
}
```

## Related Components

- **[Episode Page Template](/examples/episode-page/)** - Complete episode layout
- **[BlockContent](/components/block-content/)** - For show notes rendering

## Next Steps

- **[Episode Pages](/getting-started/project-structure/)** - Create episode templates
- **[Sanity CMS](/sanity/schemas/)** - Store transcripts in CMS
- **[Customization](/customization/component-overrides/)** - Override component
