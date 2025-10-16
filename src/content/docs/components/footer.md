---
title: Footer Component
description: Site footer with navigation, social links, and newsletter slot
---

# Footer Component

The Footer component provides a comprehensive site footer with brand information, navigation links, social/subscribe links, and an optional newsletter signup slot.

## Features

- ✅ Responsive 3-column layout (stacks on mobile)
- ✅ Brand section with site name and description
- ✅ Navigation links
- ✅ Social/subscribe links (Spotify, Apple Podcasts, etc.)
- ✅ Newsletter signup slot (optional)
- ✅ Auto-updating copyright year
- ✅ Theme-aware styling

## Basic Usage

```astro
---
import Footer from '@rejected-media/podcast-framework-core/components/Footer.astro';
---

<Footer siteName="My Podcast" />
```

## Props

### Required Props

#### `siteName`

**Type:** `string`
**Required:** Yes

Your podcast name, displayed in the footer.

```astro
<Footer siteName="Strange Water" />
```

### Optional Props

#### `siteDescription`

**Type:** `string`
**Default:** `""` (empty)

A brief description of your podcast, shown in the brand section.

```astro
<Footer
  siteName="Strange Water"
  siteDescription="Deep conversations about Ethereum and Web3"
/>
```

#### `navigation`

**Type:** `Array<{ href: string; label: string; show?: boolean }>`
**Default:** `[Home, Episodes, Guests, About]`

Footer navigation links.

```astro
<Footer
  siteName="My Podcast"
  navigation={[
    { href: '/', label: 'Home' },
    { href: '/episodes', label: 'Episodes' },
    { href: '/about', label: 'About' },
    { href: '/privacy', label: 'Privacy Policy' }
  ]}
/>
```

#### `socialLinks`

**Type:** `SocialLink[]`
**Default:** `[]`

Subscribe/social links (Spotify, Apple Podcasts, YouTube, etc.).

**SocialLink Interface:**
```typescript
interface SocialLink {
  href: string;
  label: string;
  icon?: string;
}
```

**Example:**
```astro
<Footer
  siteName="My Podcast"
  socialLinks={[
    { href: 'https://spotify.com/...', label: 'Spotify' },
    { href: 'https://podcasts.apple.com/...', label: 'Apple Podcasts' },
    { href: 'https://youtube.com/...', label: 'YouTube' }
  ]}
/>
```

#### `theme`

**Type:** `Theme`
**Default:** `defaultTheme`

Theme configuration for colors and layout.

```astro
---
import { getPodcast } from '@rejected-media/podcast-framework-core';

const podcast = await getPodcast();
---

<Footer
  siteName={podcast?.name}
  theme={podcast?.theme}
/>
```

#### `showNewsletter`

**Type:** `boolean`
**Default:** `false`

Show the newsletter signup slot.

```astro
<Footer
  siteName="My Podcast"
  showNewsletter={true}
/>
```

## Complete Example

```astro
---
import Footer from '@rejected-media/podcast-framework-core/components/Footer.astro';
import NewsletterSignup from '@rejected-media/podcast-framework-core/components/NewsletterSignup.astro';
import { getPodcast } from '@rejected-media/podcast-framework-core';

const podcast = await getPodcast();

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/episodes', label: 'Episodes' },
  { href: '/guests', label: 'Guests' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' }
];

const socialLinks = [
  { href: podcast?.spotifyUrl, label: 'Spotify' },
  { href: podcast?.appleUrl, label: 'Apple Podcasts' },
  { href: podcast?.youtubeUrl, label: 'YouTube' },
  { href: podcast?.rssUrl, label: 'RSS Feed' }
].filter(link => link.href); // Remove links without URLs
---

<Footer
  siteName={podcast?.name || "My Podcast"}
  siteDescription={podcast?.description}
  navigation={navigation}
  socialLinks={socialLinks}
  theme={podcast?.theme}
  showNewsletter={podcast?.isActive}
>
  <NewsletterSignup slot="newsletter" />
</Footer>
```

## Layout

The footer has a responsive 3-column grid layout:

### Desktop (≥ 768px)

```
┌─────────────────────────────────────┐
│  Brand (2fr) │ Navigation │ Subscribe│
│              │             │          │
│  Description │  - Home     │ - Spotify│
│              │  - Episodes │ - Apple  │
│              │  - Guests   │ - YouTube│
├─────────────────────────────────────┤
│        Newsletter Signup (optional)  │
├─────────────────────────────────────┤
│        © 2024 Podcast. All rights...│
└─────────────────────────────────────┘
```

### Mobile (< 768px)

Stacks into single column:

```
┌──────────────┐
│    Brand     │
├──────────────┤
│  Navigation  │
├──────────────┤
│   Subscribe  │
├──────────────┤
│  Newsletter  │
├──────────────┤
│  Copyright   │
└──────────────┘
```

## Newsletter Slot

The footer provides a `newsletter` slot for custom newsletter signup:

```astro
<Footer siteName="My Podcast" showNewsletter={true}>
  <NewsletterSignup slot="newsletter" />
</Footer>
```

**Without slot content:**
```html
<!-- Shows placeholder -->
<p>Newsletter signup component goes here</p>
```

**With slot content:**
```html
<!-- Shows your newsletter component -->
<NewsletterSignup />
```

## Customization Examples

### Example 1: Simple Footer

```astro
<Footer
  siteName="Dev Talks"
  siteDescription="Weekly interviews with developers"
/>
```

### Example 2: With Social Links

```astro
<Footer
  siteName="Tech Pod"
  socialLinks={[
    { href: 'https://spotify.com/show/123', label: 'Spotify' },
    { href: 'https://podcasts.apple.com/podcast/123', label: 'Apple' },
    { href: 'https://twitter.com/techpod', label: 'Twitter' }
  ]}
/>
```

### Example 3: Full Footer with Newsletter

```astro
---
import NewsletterSignup from '@rejected-media/podcast-framework-core/components/NewsletterSignup.astro';
---

<Footer
  siteName="Startup Stories"
  siteDescription="Behind the scenes with founders"
  navigation={[
    { href: '/', label: 'Home' },
    { href: '/episodes', label: 'Episodes' },
    { href: '/founders', label: 'Founders' },
    { href: '/resources', label: 'Resources' }
  ]}
  socialLinks={[
    { href: 'https://spotify.com/...', label: 'Spotify' },
    { href: 'https://apple.com/...', label: 'Apple Podcasts' }
  ]}
  showNewsletter={true}
>
  <NewsletterSignup
    slot="newsletter"
    title="Get weekly episodes"
    description="Never miss an interview"
  />
</Footer>
```

## Styling

### Theme Variables

The Footer uses these CSS custom properties:

```css
--color-footer-bg     /* Footer background color */
--color-footer-text   /* Footer text color */
--color-secondary     /* Section heading color */
--color-primary       /* Border accent color */
```

### Custom Styles

```astro
<Footer siteName="My Podcast" />

<style>
  footer {
    border-top: 4px solid var(--color-primary);
  }
</style>
```

## Override Component

Create `src/components/Footer.astro`:

### Minimal Override

```astro
---
export interface Props {
  siteName: string;
}

const { siteName } = Astro.props;
const year = new Date().getFullYear();
---

<footer class="bg-gray-900 text-white py-8">
  <div class="container mx-auto text-center">
    <p>&copy; {year} {siteName}. All rights reserved.</p>
  </div>
</footer>
```

### Extended Override

```astro
---
import FrameworkFooter from '@rejected-media/podcast-framework-core/components/Footer.astro';

export interface Props {
  siteName: string;
  showSupportBanner?: boolean;
}

const { showSupportBanner, ...rest } = Astro.props;
---

<FrameworkFooter {...rest}>
  {showSupportBanner && (
    <div class="bg-yellow-100 p-4 text-center mb-4">
      ❤️ Support us on <a href="/donate">Patreon</a>
    </div>
  )}
</FrameworkFooter>
```

## Accessibility

### Semantic HTML

```html
<footer>
  <nav aria-label="Footer navigation">
    <!-- Links -->
  </nav>
</footer>
```

### External Links

Social links open in new tabs safely:

```html
<a
  href="https://spotify.com/..."
  target="_blank"
  rel="noopener noreferrer"
>
  Spotify
</a>
```

## Performance

- **Bundle Size:** ~500 bytes
- **JavaScript:** None (pure HTML/CSS)
- **Render:** Static at build time

## Related Components

- **[Header](/components/header/)** - Companion header component
- **[NewsletterSignup](/components/newsletter-signup/)** - Use in newsletter slot

## Next Steps

- **[NewsletterSignup](/components/newsletter-signup/)** - Add newsletter signup
- **[Component Overrides](/customization/component-overrides/)** - Customize footer
- **[Theming](/customization/theming/)** - Customize colors
