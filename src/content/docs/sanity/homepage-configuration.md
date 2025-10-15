---
title: Homepage Configuration
description: Configure homepage sections via Sanity CMS
---

# Homepage Configuration

Configure your podcast homepage sections, layout, and content directly in Sanity CMS without modifying code.

## Quick Start

1. Open Sanity Studio
2. Click **"Homepage Config"** in sidebar
3. Click **"Create new Homepage Config"**
4. Configure sections
5. Toggle **"Is Active"** ON
6. Click **"Publish"**

:::tip[Only One Active Config]
Only one Homepage Config should have `isActive: true`. The framework uses the first active config it finds.
:::

## Available Sections

### Hero Section

Homepage hero with title, subtitle, and call-to-action.

**Fields:**
- **Enabled:** Show/hide hero
- **Title:** Main hero title
- **Subtitle:** Supporting text
- **CTA Text:** Button text
- **CTA Link:** Button destination

**Example:**
```
Title: "Welcome to Strange Water"
Subtitle: "Deep conversations about Ethereum and Web3"
CTA Text: "Listen Now"
CTA Link: "/episodes"
```

### Featured Episodes Section

Show featured episodes carousel or grid.

**Fields:**
- **Enabled:** Show/hide section
- **Title:** Section heading
- **Layout:** Carousel or grid
- **Limit:** Max episodes to show

**Example:**
```
Title: "Featured Episodes"
Layout: Carousel
Limit: 3
```

Episodes marked with `featured: true` appear here.

### Recent Episodes Section

Show recent episodes.

**Fields:**
- **Enabled:** Show/hide section
- **Title:** Section heading
- **Layout:** Grid or list
- **Limit:** Max episodes to show (default: 6)

**Example:**
```
Title: "Latest Episodes"
Layout: Grid
Limit: 6
```

Shows 6 most recent episodes automatically.

### About Section

Brief about section on homepage.

**Fields:**
- **Enabled:** Show/hide section
- **Title:** Section heading
- **Content:** Rich text content (block content)
- **CTA Text:** Optional button text
- **CTA Link:** Optional button link

**Example:**
```
Title: "About the Show"
Content: [Block content with podcast description]
CTA Text: "Learn More"
CTA Link: "/about"
```

### Newsletter Section

Newsletter signup CTA.

**Fields:**
- **Enabled:** Show/hide section
- **Title:** Section heading
- **Description:** Supporting text
- **Show Only If Active:** Only show for active podcasts

**Example:**
```
Title: "Never Miss an Episode"
Description: "Get weekly episodes delivered to your inbox"
Show Only If Active: true
```

### Custom Sections

Add unlimited custom sections with block content.

**Fields:**
- **Title:** Section heading
- **Content:** Rich text content
- **Order:** Display order (lower numbers first)
- **Background Color:** Optional background (light/dark)

**Example Custom Section:**
```
Title: "Community"
Content: [Block content about community]
Order: 4
Background: light
```

## Configuration Example

```javascript
{
  _type: 'homepageConfig',
  title: 'Homepage',
  isActive: true,

  hero: {
    enabled: true,
    title: 'Welcome to Strange Water',
    subtitle: "Ethereum's podcast",
    ctaText: 'Listen Now',
    ctaLink: '/episodes'
  },

  featuredEpisodes: {
    enabled: true,
    title: 'Featured Episodes',
    layout: 'carousel',
    limit: 3
  },

  recentEpisodes: {
    enabled: true,
    title: 'Recent Episodes',
    layout: 'grid',
    limit: 6
  },

  about: {
    enabled: true,
    title: 'About the Show',
    content: [
      {
        _type: 'block',
        children: [{ text: 'Strange Water brings you...' }]
      }
    ],
    ctaText: 'Learn More',
    ctaLink: '/about'
  },

  newsletter: {
    enabled: true,
    title: 'Never Miss an Episode',
    description: 'Get episodes delivered to your inbox',
    showOnlyIfActive: true
  },

  customSections: [
    {
      title: 'Join Our Community',
      content: [...],
      order: 5,
      background: 'light'
    }
  ]
}
```

## Using Configuration in Code

```astro
---
// src/pages/index.astro
import { getPodcast, getHomepageConfig, getFeatured, getEpisodes } from '@podcast-framework/core';

const podcast = await getPodcast();
const config = await getHomepageConfig();
const featured = config?.featuredEpisodes?.enabled ? await getFeatured(config.featuredEpisodes.limit) : null;
const recent = config?.recentEpisodes?.enabled ? await getEpisodes() : null;
---

{config?.hero?.enabled && (
  <section class="hero">
    <h1>{config.hero.title}</h1>
    <p>{config.hero.subtitle}</p>
    {config.hero.ctaText && (
      <a href={config.hero.ctaLink}>{config.hero.ctaText}</a>
    )}
  </section>
)}

{config?.featuredEpisodes?.enabled && featured && (
  <FeaturedEpisodesCarousel
    episodes={featured}
    title={config.featuredEpisodes.title}
  />
)}

{config?.recentEpisodes?.enabled && recent && (
  <section>
    <h2>{config.recentEpisodes.title}</h2>
    <div class="grid grid-cols-3 gap-6">
      {recent.slice(0, config.recentEpisodes.limit || 6).map(episode => (
        <EpisodeCard episode={episode} />
      ))}
    </div>
  </section>
)}
```

## Section Ordering

Control section order with custom sections:

```
1. Hero (fixed, always first)
2. Featured Episodes
3. Recent Episodes
4. About
5. Custom Section (order: 5)
6. Custom Section (order: 6)
7. Newsletter (fixed, near end)
```

**Customize order:**
```javascript
customSections: [
  { title: 'Community', order: 3 },  // Shows before Recent Episodes
  { title: 'Sponsors', order: 10 }   // Shows after everything
]
```

## Fallback Content

If no Homepage Config exists, pages use fallback content:

```astro
{config ? (
  <!-- CMS-configured content -->
  <Hero {...config.hero} />
) : (
  <!-- Fallback content -->
  <section class="hero">
    <h1>Welcome to {podcast?.name}</h1>
  </section>
)}
```

This ensures your site always works, even without configuration.

## Best Practices

### 1. Start Simple

Enable only essential sections first:
```
✅ Hero
✅ Featured Episodes (3-5 episodes)
✅ Recent Episodes (6 episodes)
✅ Newsletter (if active)
```

Add custom sections later.

### 2. Keep Hero Concise

```
✅ "Welcome to Strange Water"
✅ "Ethereum's podcast"

❌ "Welcome to Strange Water, the best podcast about Ethereum..."
   (too long for hero)
```

### 3. Limit Featured Episodes

```
✅ 3-5 featured episodes (manageable)
❌ 20 featured episodes (overwhelming)
```

### 4. Test Mobile Layout

Preview on mobile:
- Hero stacks vertically
- Grids become single column
- CTAs full-width

## Troubleshooting

### Configuration not applying

**Check 1:** Config is active
- Open Homepage Config
- Verify **"Is Active"** is ON

**Check 2:** Only one config is active
- Search for "Homepage Config"
- Ensure only one has `isActive: true`

**Check 3:** Rebuild site
```bash
npm run build
```

### Sections not showing

**Check enabled field:**
```javascript
hero: {
  enabled: true  // ← Must be true
}
```

### Images not loading in custom sections

Upload images to Sanity:

1. In block content, click image icon
2. Upload image
3. Click "Insert"

## Related

- **[About Page Configuration](/sanity/about-page-configuration/)** - Configure about page
- **[Theme Configuration](/sanity/theme-configuration/)** - Visual theme
- **[Content Management](/sanity/content-management/)** - Manage content

## Next Steps

- **[About Page Configuration](/sanity/about-page-configuration/)** - Configure about page
- **[Custom Sections](/customization/custom-sections/)** - Add custom sections
- **[Components](/components/overview/)** - Use components in sections
