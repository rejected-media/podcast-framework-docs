---
title: Components Overview
description: Overview of all 8 pre-built components in Podcast Framework
---

# Components Overview

Podcast Framework includes **8 production-ready Astro components** that cover all common podcast website needs. All components are fully customizable through props and can be completely overridden by creating your own version.

## Available Components

### Navigation

- **[Header](/components/header/)** - Main navigation header with logo, site name, and responsive mobile menu
- **[Footer](/components/footer/)** - Site footer with social links, copyright, and newsletter signup slot

### Content

- **[EpisodeSearch](/components/episode-search/)** - Client-side episode search with fuzzy matching
- **[TranscriptViewer](/components/transcript-viewer/)** - Collapsible transcript viewer with timestamps and search
- **[FeaturedEpisodesCarousel](/components/featured-episodes-carousel/)** - Auto-progressing carousel for featured episodes
- **[BlockContent](/components/block-content/)** - Sanity portable text renderer for rich content

### Forms

- **[NewsletterSignup](/components/newsletter-signup/)** - Email subscription form with spam protection

### UI Elements

- **[SkeletonLoader](/components/skeleton-loader/)** - Loading placeholders in 4 variants (text, card, image, list)

## Quick Reference

| Component | Purpose | Props | Override-able |
|-----------|---------|-------|---------------|
| Header | Navigation | `siteName`, `navigation`, `logoUrl` | ✅ |
| Footer | Site footer | `siteName`, `social`, `showNewsletter` | ✅ |
| NewsletterSignup | Email capture | `title`, `description`, `endpoint` | ✅ |
| EpisodeSearch | Episode search | `episodes` | ✅ |
| TranscriptViewer | Show transcripts | `transcript`, `segments` | ✅ |
| FeaturedEpisodesCarousel | Episode carousel | `episodes` | ✅ |
| SkeletonLoader | Loading states | `type`, `count` | ✅ |
| BlockContent | Rich text | `blocks` | ✅ |

## How to Use Components

### Import from Framework

```astro
---
import Header from '@podcast-framework/core/components/Header.astro';
import Footer from '@podcast-framework/core/components/Footer.astro';
---

<Header siteName="My Podcast" />
<Footer siteName="My Podcast" />
```

### Use with Data

```astro
---
import { getEpisodes } from '@podcast-framework/core';
import EpisodeSearch from '@podcast-framework/core/components/EpisodeSearch.astro';

const episodes = await getEpisodes();
---

<EpisodeSearch episodes={episodes} />
```

### Override Components

Create your own version in `src/components/`:

```
my-podcast/
└── src/
    └── components/
        └── Header.astro  ← Your custom header
```

The framework automatically uses your version instead of the default.

## Component Features

### Responsive Design

All components are mobile-first and fully responsive:

- **Mobile** (< 768px) - Touch-friendly, stacked layouts
- **Tablet** (768px - 1024px) - Balanced layouts
- **Desktop** (> 1024px) - Full-featured layouts

### Theme Support

Components respect the theme configured in Sanity CMS:

```astro
---
import Header from '@podcast-framework/core/components/Header.astro';
import { getPodcast } from '@podcast-framework/core';

const podcast = await getPodcast();
const theme = podcast?.theme;
---

<Header siteName={podcast?.name} theme={theme} />
```

Theme controls:
- Colors (primary, secondary, background, text)
- Fonts (heading, body)
- Layout (border radius, spacing)

### Accessibility

All components follow WCAG 2.1 AA standards:

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

### TypeScript Support

All components have full TypeScript types:

```typescript
export interface Props {
  siteName: string;
  logoUrl?: string;
  navigation?: NavigationItem[];
  theme?: Theme;
}
```

## Component Patterns

### Pattern 1: Direct Import

Use when you need a specific component:

```astro
---
import Header from '@podcast-framework/core/components/Header.astro';
---

<Header siteName="My Podcast" />
```

### Pattern 2: Component Resolver

Use in layouts for automatic override detection:

```astro
---
import { getComponent } from '@podcast-framework/core';

const Header = getComponent('Header');
const Footer = getComponent('Footer');
---

<Header siteName="My Podcast" />
<Footer siteName="My Podcast" />
```

`getComponent()` checks `src/components/` first, then falls back to framework.

### Pattern 3: Conditional Rendering

Show components based on data:

```astro
---
import NewsletterSignup from '@podcast-framework/core/components/NewsletterSignup.astro';
import { getPodcast } from '@podcast-framework/core';

const podcast = await getPodcast();
const showNewsletter = podcast?.isActive;
---

{showNewsletter && (
  <NewsletterSignup
    title="Subscribe to our newsletter"
    endpoint="/api/newsletter-subscribe"
  />
)}
```

## Customization Levels

### Level 1: Props

Customize through props (easiest):

```astro
<Header
  siteName="My Podcast"
  logoUrl="/logo.png"
  navigation={[
    { href: '/', label: 'Home' },
    { href: '/episodes', label: 'Episodes' },
    { href: '/custom', label: 'Custom Page' }
  ]}
/>
```

### Level 2: CSS

Override styles with custom CSS:

```astro
<Header siteName="My Podcast" />

<style>
  header {
    background: linear-gradient(to right, #667eea, #764ba2);
  }
</style>
```

### Level 3: Component Override

Create your own version:

```astro
---
// src/components/Header.astro
export interface Props {
  siteName: string;
}

const { siteName } = Astro.props;
---

<header>
  <!-- Your completely custom header -->
  <h1>{siteName}</h1>
</header>
```

### Level 4: Fork and Modify

Copy framework component and modify:

1. Copy `node_modules/@podcast-framework/core/components/Header.astro`
2. Paste to `src/components/Header.astro`
3. Modify as needed

## Performance

Components are optimized for performance:

- **Zero JavaScript** (except interactive components)
- **Static by default** - Pre-rendered at build time
- **Lazy loading** - Images and heavy content load on demand
- **Small bundle size** - Only ship what's needed

**Bundle Sizes:**
- Header: ~1 KB (with mobile menu script)
- Footer: ~500 bytes
- NewsletterSignup: ~2 KB (with validation)
- EpisodeSearch: ~4 KB (with search logic)
- TranscriptViewer: ~3 KB (with collapse logic)
- FeaturedEpisodesCarousel: ~2 KB (with auto-progress)
- SkeletonLoader: ~300 bytes
- BlockContent: ~1 KB

## Best Practices

### 1. Use Framework Components First

Don't rebuild what's already there:

```astro
<!-- ❌ Don't do this -->
<header>
  <nav>
    <!-- Your custom navigation -->
  </nav>
</header>

<!-- ✅ Do this -->
<Header siteName="My Podcast" navigation={myNav} />
```

### 2. Override Only When Needed

Start with props, only override if truly necessary:

```astro
<!-- ✅ Good - Use props -->
<Header
  siteName="My Podcast"
  navigation={customNav}
/>

<!-- ⚠️ Only if props aren't enough -->
<!-- src/components/Header.astro -->
```

### 3. Keep Overrides Simple

If overriding, keep it focused:

```astro
---
// src/components/Header.astro
// Import and extend framework component
import FrameworkHeader from '@podcast-framework/core/components/Header.astro';

export interface Props {
  siteName: string;
  customProp?: string;
}

const { customProp, ...rest } = Astro.props;
---

<div class="header-wrapper">
  {customProp && <div class="banner">{customProp}</div>}
  <FrameworkHeader {...rest} />
</div>
```

### 4. Test Responsive Behavior

Always test on multiple screen sizes:

```bash
# Dev server
npm run dev

# Test mobile: http://localhost:4321 (resize browser)
# Test tablet: 768px width
# Test desktop: 1024px+ width
```

### 5. Maintain Accessibility

If overriding, keep accessibility features:

```astro
<!-- Keep semantic HTML -->
<header>
  <nav aria-label="Main navigation">
    <!-- Navigation -->
  </nav>
</header>

<!-- Keep ARIA labels -->
<button
  aria-label="Toggle mobile menu"
  aria-expanded="false"
>
  Menu
</button>
```

## Next Steps

Explore individual components:

- **[Header](/components/header/)** - Navigation header
- **[Footer](/components/footer/)** - Site footer
- **[NewsletterSignup](/components/newsletter-signup/)** - Email capture
- **[EpisodeSearch](/components/episode-search/)** - Episode search
- **[TranscriptViewer](/components/transcript-viewer/)** - Transcript display
- **[FeaturedEpisodesCarousel](/components/featured-episodes-carousel/)** - Episode carousel
- **[SkeletonLoader](/components/skeleton-loader/)** - Loading states
- **[BlockContent](/components/block-content/)** - Rich text rendering

Or learn about customization:

- **[Component Overrides](/customization/component-overrides/)** - Override any component
- **[Theming](/customization/theming/)** - Customize colors and fonts
- **[Custom Components](/customization/custom-components/)** - Build your own
