---
title: About Page Configuration
description: Configure about page content via Sanity CMS
---

# About Page Configuration

Configure your podcast's about page sections and content directly in Sanity CMS.

## Quick Start

1. Open Sanity Studio
2. Click **"About Page Config"** in sidebar
3. Click **"Create new About Page Config"**
4. Configure sections
5. Toggle **"Is Active"** ON
6. Click **"Publish"**

The about page at `/about` will use this configuration.

## Available Sections

### About Section

Main about content describing your podcast.

**Fields:**
- **Enabled:** Show/hide section
- **Title:** Section heading (default: "About the Show")
- **Content:** Rich text content (block content)

**Example:**
```
Title: "About Strange Water"
Content:
  "Strange Water brings you deep conversations with the people
   building Ethereum and Web3. From protocol developers to..."
```

### Hosts Section

Display podcast hosts with bios and photos.

**Fields:**
- **Enabled:** Show/hide section
- **Title:** Section heading (default: "The Host" or "The Hosts")
- **Layout:** Cards or list
- **Hosts:** Array of Host references

**Layouts:**

**Cards** (default):
```
┌───────────────────────────┐
│ [Photo] Name              │
│         Bio text...       │
│         Twitter | Website │
└───────────────────────────┘
```

**List:**
```
Name
Bio text...

Name 2
Bio text...
```

**Example:**
```
Title: "The Host"
Layout: cards
Hosts: [Rex Kirshner]
```

### Mission Section

Your podcast's mission or goals.

**Fields:**
- **Enabled:** Show/hide section
- **Title:** Section heading (default: "Our Mission")
- **Content:** Rich text content

**Example:**
```
Title: "Our Mission"
Content:
  "To make Ethereum accessible through conversations with
   the people building it."
```

### Subscribe CTA Section

Call-to-action for subscribing.

**Fields:**
- **Enabled:** Show/hide (default: enabled)
- **Custom Title:** Override default title
- **Custom Description:** Override default description

**Defaults:**
- Active podcast: "Subscribe to [Podcast Name]"
- Concluded podcast: "Listen to [Podcast Name]"

**Example:**
```
Custom Title: "Join Our Listeners"
Custom Description: "Get episodes on Spotify, Apple, and more"
```

### Community Section

Link to contribution page.

**Fields:**
- **Enabled:** Show/hide (default: enabled for active podcasts)
- **Custom Text:** Override default text

**Default:**
```
"Want to contribute to the show?
Share your ideas, suggest guests, or submit content"
```

**Example:**
```
Custom Text: "Join our community of listeners and contributors"
```

### Custom Sections

Add unlimited custom sections with block content.

**Fields:**
- **Title:** Section heading
- **Content:** Rich text content
- **Order:** Display order (lower numbers first)

**Example:**
```
Title: "FAQ"
Content: [Block content with questions and answers]
Order: 4
```

## Configuration Example

```javascript
{
  _type: 'aboutPageConfig',
  title: 'About Page',
  isActive: true,

  aboutSection: {
    enabled: true,
    title: 'About Strange Water',
    content: [
      {
        _type: 'block',
        children: [{ text: 'Strange Water brings you...' }]
      }
    ]
  },

  hostsSection: {
    enabled: true,
    title: 'The Host',
    layout: 'cards',
    hosts: [
      { _ref: 'host-rex-kirshner' }
    ]
  },

  missionSection: {
    enabled: true,
    title: 'Our Mission',
    content: [
      {
        _type: 'block',
        children: [{ text: 'To make Ethereum accessible...' }]
      }
    ]
  },

  subscribeCTA: {
    enabled: true,
    customTitle: 'Listen to Strange Water',
    customDescription: 'All episodes available on your favorite platform'
  },

  communitySection: {
    enabled: false  // Podcast concluded, no new contributions
  },

  customSections: [
    {
      title: 'Acknowledgments',
      content: [...],
      order: 5
    }
  ]
}
```

## Using Configuration in Code

```astro
---
// src/pages/about.astro
import { getPodcast, getAboutPageConfig } from '@podcast-framework/core';
import BlockContent from '@podcast-framework/core/components/BlockContent.astro';

const podcast = await getPodcast();
const config = await getAboutPageConfig();
---

<!-- About Section -->
{config?.aboutSection?.enabled && (
  <section>
    <h2>{config.aboutSection.title}</h2>
    <BlockContent blocks={config.aboutSection.content} />
  </section>
)}

<!-- Hosts Section -->
{config?.hostsSection?.enabled && (
  <section>
    <h2>{config.hostsSection.title}</h2>
    {config.hostsSection.layout === 'cards' ? (
      <div class="grid grid-cols-2 gap-8">
        {config.hostsSection.hosts?.map(host => (
          <article>
            <img src={host.photo?.url} alt={host.name} />
            <h3>{host.name}</h3>
            <p>{host.bio}</p>
          </article>
        ))}
      </div>
    ) : (
      <div class="space-y-6">
        {config.hostsSection.hosts?.map(host => (
          <article>
            <h3>{host.name}</h3>
            <p>{host.bio}</p>
          </article>
        ))}
      </div>
    )}
  </section>
)}

<!-- Mission Section -->
{config?.missionSection?.enabled && (
  <section>
    <h2>{config.missionSection.title}</h2>
    <BlockContent blocks={config.missionSection.content} />
  </section>
)}
```

## Section Ordering

Sections appear in this order:

1. About Section
2. Hosts Section
3. Mission Section
4. Custom Sections (sorted by `order` field)
5. Subscribe CTA
6. Community Section

**Custom ordering:**
```javascript
customSections: [
  { title: 'History', order: 1 },    // Shows first
  { title: 'Team', order: 2 },       // Shows second
  { title: 'Contact', order: 100 }   // Shows last
]
```

## Fallback Content

If no About Page Config exists, the page shows default content:

```astro
{config ? (
  <!-- CMS-configured content -->
) : (
  <!-- Fallback content -->
  <section>
    <h2>The Show</h2>
    <p>{podcast?.name} brings you deep conversations...</p>
  </section>

  <section>
    <h2>The Host</h2>
    <p>{podcast?.name} is hosted by...</p>
  </section>
)}
```

## Host Cards vs List

### Cards Layout

Best for 1-3 hosts with photos:

```
┌──────────────────┐  ┌──────────────────┐
│ [Photo]          │  │ [Photo]          │
│ Name             │  │ Name             │
│ Bio text...      │  │ Bio text...      │
│ Twitter | Website│  │ Twitter | Website│
└──────────────────┘  └──────────────────┘
```

### List Layout

Best for hosts without photos or many hosts:

```
Name
Bio text...

Name 2
Bio text...

Name 3
Bio text...
```

## Conditional Sections

### Show Community Section Only for Active Podcasts

```javascript
communitySection: {
  enabled: true,
  customText: 'Want to contribute?'
}
```

In code:
```astro
{config?.communitySection?.enabled && podcast?.isActive && (
  <section>
    <p>{config.communitySection.customText}</p>
    <a href="/contribute">Share your ideas →</a>
  </section>
)}
```

### Hide Subscribe CTA

```javascript
subscribeCTA: {
  enabled: false  // Don't show subscribe section
}
```

## Troubleshooting

### Config not applying

**Check 1:** Config is active
- Verify `isActive: true`

**Check 2:** Only one config active
- Only one About Page Config should have `isActive: true`

**Check 3:** Rebuild
```bash
npm run build
```

### Hosts not showing

**Check 1:** Hosts exist
- Create Host documents in Sanity

**Check 2:** Hosts are referenced
- In config, add hosts to `hostsSection.hosts` array

### Block content not rendering

**Check 1:** Content is published
- Content must be saved AND published

**Check 2:** BlockContent component used
```astro
<BlockContent blocks={config.aboutSection.content} />
```

## Related

- **[Homepage Configuration](/sanity/homepage-configuration/)** - Configure homepage
- **[Theme Configuration](/sanity/theme-configuration/)** - Visual theme
- **[Content Management](/sanity/content-management/)** - Manage content

## Next Steps

- **[Customization: Custom Sections](/customization/custom-sections/)** - Add custom sections
- **[BlockContent Component](/components/block-content/)** - Rich text rendering
- **[Deployment](/deployment/cloudflare-pages/)** - Deploy changes
