---
title: Utilities
description: Helper functions for common tasks
---

# Utilities

Podcast Framework provides a comprehensive set of utility functions for common tasks like date formatting, text manipulation, and duration handling.

## Import

```typescript
import {
  formatDate,
  stripHTML,
  escapeHTML,
  decodeHTMLEntities,
  truncate,
  slugify,
  parseDuration,
  formatDuration
} from '@rejected-media/podcast-framework-core';
```

## Date & Time Functions

### `formatDate()`

Format ISO date strings to human-readable format.

**Signature:**
```typescript
function formatDate(
  dateString: string,
  locale?: string
): string
```

**Parameters:**
- `dateString` - ISO date string or any valid date format
- `locale` - Locale for formatting (default: `'en-US'`)

**Returns:** Formatted date string

**Examples:**
```typescript
formatDate('2024-01-15')
// → "January 15, 2024"

formatDate('2024-01-15', 'es-ES')
// → "15 de enero de 2024"

formatDate('2024-12-25', 'fr-FR')
// → "25 décembre 2024"
```

**Usage in Templates:**
```astro
---
import { getEpisodes, formatDate } from '@rejected-media/podcast-framework-core';

const episodes = await getEpisodes();
---

{episodes.map(episode => (
  <article>
    <h2>{episode.title}</h2>
    <p>Published: {formatDate(episode.publishDate)}</p>
  </article>
))}
```

**Error Handling:**
```typescript
try {
  formatDate('invalid-date');
} catch (error) {
  // Error: Invalid date format: "invalid-date"
}
```

### `parseDuration()`

Parse duration string to seconds.

**Signature:**
```typescript
function parseDuration(duration: string): number
```

**Parameters:**
- `duration` - Duration string in HH:MM:SS, MM:SS, or SS format

**Returns:** Duration in seconds

**Examples:**
```typescript
parseDuration('1:23:45')  // → 5025 (1 hour, 23 minutes, 45 seconds)
parseDuration('23:45')    // → 1425 (23 minutes, 45 seconds)
parseDuration('45')       // → 45 (45 seconds)
```

**Usage:**
```typescript
const durationInSeconds = parseDuration(episode.duration);

if (durationInSeconds > 3600) {
  console.log('Long episode (over 1 hour)');
}
```

**Error Handling:**
```typescript
try {
  parseDuration('invalid');
} catch (error) {
  // Error: Invalid duration format: "invalid"
}

try {
  parseDuration('1:2:3:4');
} catch (error) {
  // Error: Invalid duration format: "1:2:3:4". Too many colons.
}
```

### `formatDuration()`

Format seconds to readable duration string.

**Signature:**
```typescript
function formatDuration(seconds: number): string
```

**Parameters:**
- `seconds` - Duration in seconds

**Returns:** Formatted duration string

**Examples:**
```typescript
formatDuration(5025)  // → "1:23:45"
formatDuration(1425)  // → "23:45"
formatDuration(45)    // → "0:45"
formatDuration(3661)  // → "1:01:01"
```

**Usage:**
```astro
---
const durationSeconds = parseDuration(episode.duration);
const formatted = formatDuration(durationSeconds);
---

<p>Duration: {formatted}</p>
```

## Text Manipulation Functions

### `stripHTML()`

Remove HTML tags and decode HTML entities.

**Signature:**
```typescript
function stripHTML(html: string): string
```

**Parameters:**
- `html` - HTML string to strip

**Returns:** Plain text without HTML tags

**Examples:**
```typescript
stripHTML('<p>Hello &amp; welcome</p>')
// → "Hello & welcome"

stripHTML('<strong>Bold text</strong> and <em>italic</em>')
// → "Bold text and italic"

stripHTML('<script>alert("xss")</script>')
// → 'alert("xss")' (tags removed, safe)
```

**Usage:**
```astro
---
import { stripHTML } from '@rejected-media/podcast-framework-core';
---

<meta
  name="description"
  content={stripHTML(episode.description)}
/>

<p class="line-clamp-3">
  {stripHTML(episode.description)}
</p>
```

### `escapeHTML()`

Escape HTML to prevent XSS attacks.

**Signature:**
```typescript
function escapeHTML(text: string): string
```

**Parameters:**
- `text` - Text to escape

**Returns:** HTML-safe text

**Examples:**
```typescript
escapeHTML('<script>alert("xss")</script>')
// → "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"

escapeHTML("It's a test & demo")
// → "It&#39;s a test &amp; demo"

escapeHTML('Path: /home/user')
// → "Path: &#x2F;home&#x2F;user"
```

**Usage:**
```typescript
// In email templates
const html = `
  <p>Name: ${escapeHTML(userInput.name)}</p>
  <p>Comment: ${escapeHTML(userInput.comment)}</p>
`;
```

**Security:**
```typescript
// ❌ Vulnerable to XSS
const userInput = '<script>alert("xss")</script>';
const html = `<p>${userInput}</p>`;  // XSS!

// ✅ Safe from XSS
const html = `<p>${escapeHTML(userInput)}</p>`;  // Safe
```

### `decodeHTMLEntities()`

Decode HTML entities to their corresponding characters.

**Signature:**
```typescript
function decodeHTMLEntities(text: string): string
```

**Parameters:**
- `text` - Text with HTML entities

**Returns:** Text with decoded entities

**Examples:**
```typescript
decodeHTMLEntities('&amp;')      // → "&"
decodeHTMLEntities('&lt;')       // → "<"
decodeHTMLEntities('&gt;')       // → ">"
decodeHTMLEntities('&quot;')     // → '"'
decodeHTMLEntities('&#39;')      // → "'"
decodeHTMLEntities('&#x27;')     // → "'"
decodeHTMLEntities('&copy;')     // → "©"
decodeHTMLEntities('&nbsp;')     // → " "
```

**Usage:**
```typescript
// Decode RSS feed content
const rssDescription = '&lt;p&gt;Episode about AI &amp; ML&lt;/p&gt;';
const decoded = decodeHTMLEntities(rssDescription);
// → "<p>Episode about AI & ML</p>"
```

### `truncate()`

Truncate text to maximum length with ellipsis.

**Signature:**
```typescript
function truncate(
  text: string,
  maxLength: number,
  suffix?: string
): string
```

**Parameters:**
- `text` - Text to truncate
- `maxLength` - Maximum length before truncation
- `suffix` - Suffix to add when truncated (default: `'...'`)

**Returns:** Truncated text

**Examples:**
```typescript
truncate('This is a long text', 10)
// → "This is..."

truncate('Short', 10)
// → "Short" (unchanged)

truncate('Custom suffix example', 10, '→')
// → "Custom su→"

truncate('Exact length', 12)
// → "Exact length" (no truncation at exact length)
```

**Usage:**
```astro
---
import { truncate } from '@rejected-media/podcast-framework-core';
---

<div class="episode-card">
  <h3>{episode.title}</h3>
  <p>{truncate(episode.description, 150)}</p>
</div>
```

**SEO:**
```astro
---
const metaDescription = truncate(
  stripHTML(episode.description),
  160  // Google's meta description limit
);
---

<meta name="description" content={metaDescription} />
```

### `slugify()`

Convert text to URL-safe slug format.

**Signature:**
```typescript
function slugify(text: string): string
```

**Parameters:**
- `text` - Text to slugify

**Returns:** URL-safe slug

**Examples:**
```typescript
slugify('Hello World!')
// → "hello-world"

slugify('Episode #42: AI & ML')
// → "episode-42-ai-ml"

slugify('  Spaces   and   Special!@#$%   ')
// → "spaces-and-special"

slugify('François René de Château')
// → "francois-rene-de-chateau"
```

**Usage:**
```typescript
// Generate slug from title
const episodeTitle = 'The Future of Ethereum';
const slug = slugify(episodeTitle);
// → "the-future-of-ethereum"

// Use in URL
const url = `/episodes/${slug}`;
```

**Auto-generate slugs:**
```typescript
function createEpisode(title: string) {
  return {
    title,
    slug: slugify(title),
    // ... other fields
  };
}
```

## Function Reference

### Summary Table

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `formatDate()` | Format dates | `'2024-01-15'` | `"January 15, 2024"` |
| `stripHTML()` | Remove HTML | `'<p>Text</p>'` | `"Text"` |
| `escapeHTML()` | Prevent XSS | `'<script>'` | `"&lt;script&gt;"` |
| `decodeHTMLEntities()` | Decode entities | `'&amp;'` | `"&"` |
| `truncate()` | Limit length | `'Long text', 10` | `"Long te..."` |
| `slugify()` | URL-safe slugs | `'Hello World'` | `"hello-world"` |
| `parseDuration()` | Parse time | `'1:23:45'` | `5025` |
| `formatDuration()` | Format time | `5025` | `"1:23:45"` |

## Best Practices

### 1. Always Escape User Input

```typescript
// ❌ Vulnerable
const html = `<p>${userInput}</p>`;

// ✅ Safe
const html = `<p>${escapeHTML(userInput)}</p>`;
```

### 2. Strip HTML for Meta Tags

```astro
---
const description = stripHTML(episode.description);
---

<meta name="description" content={description} />
<meta property="og:description" content={description} />
```

### 3. Validate Before Parsing

```typescript
// ❌ May throw error
const seconds = parseDuration(userInput);

// ✅ Validate first
try {
  const seconds = parseDuration(userInput);
} catch (error) {
  console.error('Invalid duration:', userInput);
  // Handle error
}
```

### 4. Use Consistent Slugs

```typescript
// Generate slug once, use everywhere
const slug = slugify(title);

// URL
const url = `/episodes/${slug}`;

// Sanity document
const doc = {
  slug: { current: slug, _type: 'slug' }
};
```

## Common Patterns

### Pattern 1: Episode Card

```astro
---
import { formatDate, truncate, stripHTML } from '@rejected-media/podcast-framework-core';
---

<article>
  <h2>{episode.title}</h2>
  <p class="date">{formatDate(episode.publishDate)}</p>
  <p class="description">
    {truncate(stripHTML(episode.description), 150)}
  </p>
  <a href={`/episodes/${episode.slug.current}`}>
    Read more →
  </a>
</article>
```

### Pattern 2: SEO Meta Tags

```astro
---
import { formatDate, stripHTML, truncate } from '@rejected-media/podcast-framework-core';

const title = episode.title;
const description = truncate(stripHTML(episode.description), 160);
const publishDate = formatDate(episode.publishDate, 'en-US');
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="article:published_time" content={episode.publishDate} />
</head>
```

### Pattern 3: Duration Display

```astro
---
import { parseDuration, formatDuration } from '@rejected-media/podcast-framework-core';

const seconds = parseDuration(episode.duration);
const formatted = formatDuration(seconds);
const hours = Math.floor(seconds / 3600);
---

<div class="duration">
  <span>{formatted}</span>
  {hours > 0 && <span class="badge">Long episode</span>}
</div>
```

### Pattern 4: Safe User Content

```typescript
// In API route
import { escapeHTML } from '@rejected-media/podcast-framework-core';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  // Escape all user input
  const contribution = {
    topic: escapeHTML(data.topic),
    description: escapeHTML(data.description),
    submitterName: escapeHTML(data.name)
  };

  // Safe to use in email/HTML
  const emailHTML = `
    <h3>${contribution.topic}</h3>
    <p>${contribution.description}</p>
    <p>From: ${contribution.submitterName}</p>
  `;
};
```

## TypeScript Types

All utilities are fully typed:

```typescript
import type { Episode } from '@rejected-media/podcast-framework-core';

function processEpisode(episode: Episode): string {
  // TypeScript knows the shape of episode
  const date = formatDate(episode.publishDate);  // ✅ Type-safe
  const slug = slugify(episode.title);           // ✅ Type-safe
  const seconds = parseDuration(episode.duration); // ✅ Type-safe

  return `${date} - ${slug} - ${seconds}s`;
}
```

## Error Handling

### Date Functions

```typescript
// formatDate() throws on invalid input
try {
  formatDate('not-a-date');
} catch (error) {
  console.error(error.message);
  // → "Invalid date format: \"not-a-date\""
}
```

### Duration Functions

```typescript
// parseDuration() throws on invalid input
try {
  parseDuration('1:2:3:4');  // Too many colons
} catch (error) {
  console.error(error.message);
  // → "Invalid duration format: \"1:2:3:4\". Too many colons."
}

try {
  parseDuration('abc:def');  // Not numbers
} catch (error) {
  console.error(error.message);
  // → "Invalid duration format: \"abc:def\". Expected HH:MM:SS, MM:SS, or SS"
}
```

## Performance

All utilities are optimized for performance:

| Function | Time Complexity | Notes |
|----------|----------------|-------|
| `formatDate()` | O(1) | Uses native `Date.toLocaleDateString()` |
| `stripHTML()` | O(n) | Single regex pass |
| `escapeHTML()` | O(n) | Single pass with lookup |
| `decodeHTMLEntities()` | O(n) | Three regex passes |
| `truncate()` | O(1) | Substring operation |
| `slugify()` | O(n) | Multiple regex passes |
| `parseDuration()` | O(1) | Simple arithmetic |
| `formatDuration()` | O(1) | Simple arithmetic |

**Benchmarks** (typical episode data):
```
formatDate('2024-01-15'):              ~0.1ms
stripHTML(500-char description):       ~0.2ms
slugify('Episode Title'):              ~0.3ms
parseDuration('1:23:45'):              ~0.01ms
```

## Security

### XSS Prevention

Always use `escapeHTML()` for user-generated content:

```typescript
// ❌ Vulnerable
const html = `<div>${userInput}</div>`;

// ✅ Safe
const html = `<div>${escapeHTML(userInput)}</div>`;
```

### HTML Sanitization

`stripHTML()` removes all HTML tags:

```typescript
const userInput = '<script>alert("xss")</script><p>Safe text</p>';
const safe = stripHTML(userInput);
// → 'alert("xss")Safe text'

// For meta tags (no HTML allowed)
<meta name="description" content={stripHTML(description)} />
```

### Safe Slugs

`slugify()` produces safe, predictable slugs:

```typescript
slugify('../../../etc/passwd')
// → "etc-passwd" (path traversal prevented)

slugify('<script>xss</script>')
// → "scriptxssscript" (tags removed)
```

## Locale Support

### Supported Locales

`formatDate()` supports all locales via `Intl.DateTimeFormat`:

```typescript
formatDate('2024-01-15', 'en-US')  // → "January 15, 2024"
formatDate('2024-01-15', 'en-GB')  // → "15 January 2024"
formatDate('2024-01-15', 'de-DE')  // → "15. Januar 2024"
formatDate('2024-01-15', 'ja-JP')  // → "2024年1月15日"
formatDate('2024-01-15', 'ar-EG')  // → "١٥ يناير ٢٠٢٤"
```

### Custom Format Options

For more control, use native `toLocaleDateString`:

```typescript
const date = new Date(episode.publishDate);

// Short format
date.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});
// → "Jan 15, 2024"

// Long format
date.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
// → "Monday, January 15, 2024"
```

## Testing

All utilities have comprehensive test coverage:

```typescript
import { test, expect } from 'vitest';
import { slugify } from '@rejected-media/podcast-framework-core';

test('slugify converts to lowercase', () => {
  expect(slugify('HELLO WORLD')).toBe('hello-world');
});

test('slugify removes special characters', () => {
  expect(slugify('Hello@#$%World!')).toBe('helloworld');
});

test('slugify handles multiple spaces', () => {
  expect(slugify('hello    world')).toBe('hello-world');
});
```

## Related

- **[Sanity Helpers](/api/sanity-helpers/)** - Higher-level data fetching
- **[Server Services](/api/server-services/)** - Use utilities in services

## Next Steps

- **[Theme System](/api/theme/)** - Theming utilities
- **[Sanity Helpers](/api/sanity-helpers/)** - Data fetching helpers
- **[Hosting Adapter](/api/hosting-adapter/)** - Platform abstraction
