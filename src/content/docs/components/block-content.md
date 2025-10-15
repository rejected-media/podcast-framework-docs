---
title: Block Content Component
description: Sanity portable text renderer for rich content
---

# Block Content Component

The BlockContent component renders Sanity's portable text (block content) into HTML. Supports common block types including paragraphs, headings, lists, and text formatting.

## Features

- ✅ Paragraphs and headings (H1-H6)
- ✅ Text marks (bold, italic, code, underline)
- ✅ Blockquotes
- ✅ Styled with Tailwind classes
- ✅ XSS-safe rendering
- ✅ Prose typography support
- ✅ Custom CSS classes
- ✅ Lightweight (~1 KB)

## Basic Usage

```astro
---
import BlockContent from '@podcast-framework/core/components/BlockContent.astro';

const episode = await getEpisode(Astro.params.slug);
---

<BlockContent blocks={episode.showNotes} />
```

## Props

### Optional Props

#### `blocks`

**Type:** `any[]` (Sanity portable text blocks)
**Default:** `undefined`

Array of Sanity block content. Component returns `null` if not provided.

```astro
<BlockContent blocks={episode.showNotes} />
```

#### `class`

**Type:** `string`
**Default:** `undefined`

Custom CSS classes to apply to the container.

```astro
<BlockContent
  blocks={episode.showNotes}
  class="prose-lg max-w-4xl"
/>
```

## Complete Example

```astro
---
import { getEpisode } from '@podcast-framework/core';
import BlockContent from '@podcast-framework/core/components/BlockContent.astro';
import BaseLayout from '@podcast-framework/core/layouts/BaseLayout.astro';

const episode = await getEpisode(Astro.params.slug);
---

<BaseLayout title={episode.title}>
  <article class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-4">{episode.title}</h1>

    <p class="text-lg text-gray-600 mb-8">
      {episode.description}
    </p>

    <!-- Spotify player -->
    {episode.spotifyLink && (
      <iframe src={getSpotifyEmbedUrl(episode.spotifyLink)} />
    )}

    <!-- Show Notes -->
    {episode.showNotes && (
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6">Show Notes</h2>
        <BlockContent
          blocks={episode.showNotes}
          class="prose prose-lg max-w-none"
        />
      </div>
    )}

    <!-- About the Episode -->
    {episode.about && (
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6">About</h2>
        <BlockContent
          blocks={episode.about}
          class="prose max-w-none"
        />
      </div>
    )}
  </article>
</BaseLayout>
```

## Supported Block Types

### Paragraphs

**Sanity Input:**
```javascript
{
  _type: 'block',
  style: 'normal',
  children: [
    { text: 'This is a paragraph.' }
  ]
}
```

**Rendered HTML:**
```html
<p class="text-lg text-gray-700 leading-relaxed mb-6">
  This is a paragraph.
</p>
```

### Headings

**Sanity Input:**
```javascript
{
  _type: 'block',
  style: 'h1',
  children: [
    { text: 'Heading Text' }
  ]
}
```

**Rendered HTML:**
```html
<!-- H1 -->
<h1 class="text-3xl font-bold mb-4">Heading Text</h1>

<!-- H2 -->
<h2 class="text-2xl font-bold mb-3">Heading Text</h2>

<!-- H3 -->
<h3 class="text-xl font-semibold mb-2">Heading Text</h3>

<!-- H4 -->
<h4 class="text-lg font-semibold mb-2">Heading Text</h4>

<!-- H5 -->
<h5 class="font-semibold mb-2">Heading Text</h5>

<!-- H6 -->
<h6 class="font-semibold mb-2 text-sm">Heading Text</h6>
```

### Text Formatting

**Bold:**
```javascript
{
  text: 'bold text',
  marks: ['strong']
}
```
→ `<strong>bold text</strong>`

**Italic:**
```javascript
{
  text: 'italic text',
  marks: ['em']
}
```
→ `<em>italic text</em>`

**Code:**
```javascript
{
  text: 'code text',
  marks: ['code']
}
```
→ `<code class="bg-gray-100 px-1 py-0.5 rounded">code text</code>`

**Underline:**
```javascript
{
  text: 'underlined text',
  marks: ['underline']
}
```
→ `<u>underlined text</u>`

### Blockquotes

**Sanity Input:**
```javascript
{
  _type: 'block',
  style: 'blockquote',
  children: [
    { text: 'This is a quote.' }
  ]
}
```

**Rendered HTML:**
```html
<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">
  This is a quote.
</blockquote>
```

## Styling

### Default Classes

The component applies these Tailwind classes:

```css
/* Container */
.prose .max-w-none

/* Paragraph */
.text-lg .text-gray-700 .leading-relaxed .mb-6

/* Headings */
.text-3xl .font-bold .mb-4    /* H1 */
.text-2xl .font-bold .mb-3    /* H2 */
.text-xl .font-semibold .mb-2 /* H3 */

/* Code */
.bg-gray-100 .px-1 .py-0.5 .rounded

/* Blockquote */
.border-l-4 .border-gray-300 .pl-4 .italic .my-4
```

### Custom Styling

Override with Tailwind prose classes:

```astro
<BlockContent
  blocks={showNotes}
  class="prose prose-lg prose-blue max-w-none"
/>
```

**Prose Variants:**
- `prose-sm` - Smaller text
- `prose-lg` - Larger text
- `prose-xl` - Extra large text
- `prose-blue` - Blue links
- `prose-slate` - Slate color scheme

### Custom CSS

```astro
<BlockContent blocks={showNotes} />

<style is:global>
  .prose p {
    font-size: 1.125rem;
    line-height: 1.75;
    color: #374151;
  }

  .prose h2 {
    color: #1e40af;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .prose blockquote {
    border-left-color: #3b82f6;
    background-color: #eff6ff;
    padding: 1rem;
  }
</style>
```

## Sanity Schema Example

Configure rich text in your Sanity schema:

```typescript
// schemas/episode.ts
export default {
  name: 'episode',
  type: 'document',
  fields: [
    // ... other fields
    {
      name: 'showNotes',
      title: 'Show Notes',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
              { title: 'Underline', value: 'underline' }
            ]
          }
        }
      ]
    }
  ]
};
```

## Limitations

### Lists Not Yet Supported

List rendering is not yet implemented:

```javascript
{
  _type: 'list',  // Not supported yet
  items: [...]
}
```

**Workaround:** Use paragraphs with dashes:

```
- Item 1
- Item 2
- Item 3
```

### Links Not Yet Supported

Link marks are not yet implemented:

```javascript
{
  text: 'link text',
  marks: ['link']  // Not supported yet
}
```

**Workaround:** Include full URLs in text:

```
Visit https://example.com for more info
```

### Images Not Yet Supported

Image blocks are not yet implemented:

```javascript
{
  _type: 'image',  // Not supported yet
  asset: {...}
}
```

**Workaround:** Use separate image fields in schema.

## Extending the Component

### Adding Link Support

```astro
---
// src/components/BlockContent.astro
// Copy framework component and extend

function renderBlock(block: any): string {
  if (block._type === 'block') {
    const text = block.children?.map((child: any) => {
      let content = child.text || '';

      // Existing marks...
      if (child.marks?.includes('strong')) {
        content = `<strong>${content}</strong>`;
      }

      // Add link support
      if (child.marks?.includes('link')) {
        const mark = block.markDefs?.find((m: any) => m._key === child.marks.find((m: string) => m.startsWith('link')));
        if (mark?.href) {
          content = `<a href="${mark.href}" class="text-blue-600 hover:underline">${content}</a>`;
        }
      }

      return content;
    }).join('') || '';

    // ... rest of rendering
  }
}
---
```

### Adding List Support

```astro
---
function renderBlock(block: any): string {
  // ... existing code

  if (block._type === 'list') {
    const tag = block.style === 'number' ? 'ol' : 'ul';
    const items = block.items?.map((item: any) => {
      return `<li>${item.text}</li>`;
    }).join('');

    return `<${tag} class="list-disc ml-6 mb-4">${items}</${tag}>`;
  }

  return '';
}
---
```

## Accessibility

### Semantic HTML

The component renders semantic HTML:

```html
<h1>Heading</h1>
<p>Paragraph</p>
<blockquote>Quote</blockquote>
<strong>Bold</strong>
<em>Italic</em>
```

### Screen Readers

- Headings provide document structure
- Blockquotes announced as quotations
- Code announced as code blocks

## Performance

- **Bundle Size:** ~1 KB
- **JavaScript:** None (renders at build time)
- **Render:** Static HTML
- **XSS Protection:** DOM-based rendering (safe)

## Troubleshooting

### Content not rendering

Check that blocks array exists:

```astro
{episode.showNotes ? (
  <BlockContent blocks={episode.showNotes} />
) : (
  <p>No show notes available</p>
)}
```

### Styling not applied

Ensure Tailwind prose plugin is installed:

```bash
npm install @tailwindcss/typography
```

```javascript
// tailwind.config.mjs
export default {
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### Text formatting not working

Verify marks are configured in Sanity schema:

```typescript
marks: {
  decorators: [
    { title: 'Strong', value: 'strong' },
    { title: 'Emphasis', value: 'em' },
    { title: 'Code', value: 'code' }
  ]
}
```

### Content looks unstyled

Add prose classes:

```astro
<!-- ❌ Missing prose classes -->
<BlockContent blocks={content} />

<!-- ✅ With prose classes -->
<BlockContent blocks={content} class="prose max-w-none" />
```

## Customization Examples

### Example 1: Dark Mode

```astro
<BlockContent blocks={showNotes} class="prose prose-invert" />
```

### Example 2: Custom Color Scheme

```astro
<BlockContent blocks={showNotes} class="prose prose-blue" />

<style is:global>
  .prose-blue h2 {
    color: #3b82f6;
  }

  .prose-blue a {
    color: #2563eb;
  }

  .prose-blue blockquote {
    border-left-color: #60a5fa;
    color: #1e40af;
  }
</style>
```

### Example 3: Two-column Layout

```astro
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <BlockContent
    blocks={episode.showNotes}
    class="prose max-w-none"
  />
  <BlockContent
    blocks={episode.transcript}
    class="prose max-w-none"
  />
</div>
```

## Related Components

- **[Episode Page](/examples/episode-page/)** - Use BlockContent for show notes
- **[About Page](/examples/about-page/)** - Use BlockContent for page content

## Next Steps

- **[Sanity Schemas](/sanity/schemas/)** - Configure block content in Sanity
- **[Content Management](/sanity/content-management/)** - Add rich content in Sanity Studio
- **[Customization](/customization/component-overrides/)** - Extend BlockContent component
