---
title: Sanity Schemas
description: Understanding Podcast Framework's Sanity schemas
---

# Sanity Schemas

Podcast Framework provides 8 pre-built Sanity schemas that cover all common podcast website needs. All schemas are extensible - add custom fields without modifying framework code.

## Available Schemas

### Core Content (4 schemas)

1. **Episode** - Individual podcast episodes
2. **Guest** - Podcast guests
3. **Host** - Podcast hosts
4. **Podcast** - Podcast metadata (one document)

### Configuration (3 schemas)

5. **Theme** - Visual theme configuration
6. **Homepage Config** - Homepage section configuration
7. **About Page Config** - About page content configuration

### User Content (1 schema)

8. **Contribution** - Community contributions

## Episode Schema

The most important schema - represents individual podcast episodes.

### Fields

**Core Metadata:**
- `title` (string, required) - Episode title
- `slug` (slug, required) - URL-safe slug (auto-generated from title)
- `episodeNumber` (number, required) - Episode number (1, 2, 3, ...)
- `publishDate` (date, required) - Publish date
- `duration` (string) - Duration in HH:MM:SS or MM:SS format
- `description` (text, required) - Episode description

**Content:**
- `showNotes` (block content) - Rich text show notes
- `transcript` (text) - Full episode transcript
- `transcriptSegments` (array) - Timestamped segments (advanced)

**People:**
- `hosts` (reference array) - References to Host documents
- `guests` (reference array) - References to Guest documents

**Media:**
- `coverImage` (image) - Episode cover art
- `audioUrl` (url) - Direct MP3 URL

**Platform Links:**
- `spotifyLink` (url) - Spotify episode URL
- `applePodcastLink` (url) - Apple Podcasts episode URL
- `youtubeLink` (url) - YouTube episode URL

**Features:**
- `featured` (boolean) - Mark as featured episode

**Example Document:**
```javascript
{
  _type: 'episode',
  _id: 'episode-42',
  title: 'The Future of Ethereum',
  slug: { current: 'the-future-of-ethereum' },
  episodeNumber: 42,
  publishDate: '2024-01-15',
  duration: '1:23:45',
  description: 'Deep dive into Ethereum scaling solutions...',
  showNotes: [
    {
      _type: 'block',
      children: [{ text: 'In this episode...' }]
    }
  ],
  hosts: [{ _ref: 'host-rex' }],
  guests: [{ _ref: 'guest-vitalik' }],
  coverImage: { asset: { _ref: 'image-xyz' } },
  spotifyLink: 'https://open.spotify.com/episode/...',
  featured: true,
  transcript: '**Speaker A:** Welcome to the show...'
}
```

## Guest Schema

Represents podcast guests.

### Fields

**Core:**
- `name` (string, required) - Guest name
- `slug` (slug, required) - URL-safe slug
- `bio` (text) - Guest biography
- `photo` (image) - Guest photo

**Social Links:**
- `twitter` (string) - Twitter/X handle (without @)
- `website` (url) - Personal or company website
- `linkedin` (url) - LinkedIn profile URL

**Example Document:**
```javascript
{
  _type: 'guest',
  _id: 'guest-vitalik',
  name: 'Vitalik Buterin',
  slug: { current: 'vitalik-buterin' },
  bio: 'Co-founder of Ethereum...',
  photo: { asset: { _ref: 'image-abc' } },
  twitter: 'VitalikButerin',
  website: 'https://vitalik.ca'
}
```

## Host Schema

Similar to Guest schema but for podcast hosts.

### Fields

Same as Guest schema:
- `name`, `slug`, `bio`, `photo`
- `twitter`, `website`, `linkedin`

**Difference:** Referenced in Episode's `hosts` field instead of `guests`.

## Podcast Schema

Podcast-level metadata (create only ONE document).

### Fields

**Core:**
- `name` (string, required) - Podcast name
- `tagline` (string) - Short tagline
- `description` (text) - Full description
- `isActive` (boolean) - Currently releasing episodes?
- `logo` (image) - Podcast logo
- `favicon` (image) - Browser favicon

**Platform Links:**
- `spotifyShowId` (string) - Spotify show ID
- `spotifyUrl` (url) - Spotify show URL
- `applePodcastsUrl` (url) - Apple Podcasts URL
- `youtubeUrl` (url) - YouTube channel URL
- `rssUrl` (url) - RSS feed URL

**Social:**
- `twitterUrl` (url) - Twitter/X profile
- `discordUrl` (url) - Discord server

**Newsletter:**
- `newsletterEnabled` (boolean) - Enable newsletter signups
- `convertKitApiKey` (string) - ConvertKit API secret
- `convertKitFormId` (string) - ConvertKit form ID

**Example:**
```javascript
{
  _type: 'podcast',
  name: 'Strange Water',
  tagline: "Ethereum's podcast",
  description: 'Deep conversations about Ethereum...',
  isActive: false,  // Concluded podcast
  spotifyUrl: 'https://open.spotify.com/show/...',
  applePodcastsUrl: 'https://podcasts.apple.com/...',
  newsletterEnabled: false  // No new episodes
}
```

## Contribution Schema

Community contributions (episode ideas, guest recommendations, questions, feedback).

### Fields

**Core:**
- `contributionType` (string) - Type of contribution
- `submitterName` (string) - Optional submitter name
- `submitterEmail` (string) - Optional email
- `status` (string) - Processing status
- `submittedAt` (datetime) - Submission timestamp

**Type-Specific Fields:**
- Episode ideas: `episodeTopic`, `episodeDescription`, `episodeRationale`
- Guest recommendations: `guestName`, `guestBackground`, `guestRationale`, `guestContact`
- Questions: `question`, `questionContext`
- Feedback: `feedbackType`, `feedbackContent`

**Created Automatically** by ContributionService.

## Theme Schema

Visual theme configuration.

### Fields

**Colors:**
- Primary, secondary, accent
- Background, text
- Header background/text
- Footer background/text

**Typography:**
- Font family
- Heading font

**Layout:**
- Border radius (Tailwind class)
- Spacing preference

**See:** [Theme Configuration](/sanity/theme-configuration/) for details.

## Homepage Config Schema

Configure homepage sections via CMS.

**Fields:**
- Hero section settings
- Featured episodes section
- Recent episodes section
- Custom sections (array)

**See:** [Homepage Configuration](/sanity/homepage-configuration/) for details.

## About Page Config Schema

Configure about page content via CMS.

**Fields:**
- About section
- Hosts section (layout, content)
- Mission section
- Custom sections (array)

**See:** [About Page Configuration](/sanity/about-page-configuration/) for details.

## Schema Extension

Extend any schema with custom fields:

### Example: Add Sponsor Field

```typescript
// sanity/schemas/index.ts
import { extendEpisodeSchema } from '@podcast-framework/sanity-schema';
import { defineField } from 'sanity';

const episodeWithSponsor = extendEpisodeSchema([
  defineField({
    name: 'sponsor',
    title: 'Episode Sponsor',
    type: 'reference',
    to: [{ type: 'sponsor' }]
  }),
  defineField({
    name: 'sponsorAdUrl',
    title: 'Sponsor Ad URL',
    type: 'url'
  })
]);

export const schemaTypes = [
  episodeWithSponsor,  // Use extended schema
  guestSchema,
  // ... other schemas
];
```

### Example: Add Custom Guest Field

```typescript
import { extendGuestSchema } from '@podcast-framework/sanity-schema';

const guestWithCompany = extendGuestSchema([
  defineField({
    name: 'company',
    title: 'Company',
    type: 'string'
  }),
  defineField({
    name: 'role',
    title: 'Role/Title',
    type: 'string'
  })
]);
```

**See:** [Schema Extensions](/customization/schema-extensions/) for more examples.

## Schema Validation

Schemas include built-in validation:

```typescript
// Episode Number
validation: Rule => Rule.required().positive().integer()
// → Must be positive integer (1, 2, 3, ...)

// Slug
validation: Rule => Rule.required()
// → Required field

// Duration
description: 'Format: HH:MM:SS or MM:SS'
// → Validates format manually
```

## Document Preview

### Episode Preview

Shows in document list:

```
Episode 42: The Future of Ethereum
[Cover image thumbnail]
```

### Guest Preview

```
Vitalik Buterin
[Photo thumbnail]
```

### Custom Preview

Customize document preview:

```typescript
// In schema definition
preview: {
  select: {
    title: 'title',
    episodeNumber: 'episodeNumber',
    media: 'coverImage'
  },
  prepare(selection) {
    return {
      title: `Ep ${selection.episodeNumber}: ${selection.title}`,
      media: selection.media
    };
  }
}
```

## Related

- **[Setup](/sanity/setup/)** - Initial Sanity configuration
- **[Content Management](/sanity/content-management/)** - Add content to Sanity
- **[Schema Extensions](/customization/schema-extensions/)** - Extend schemas

## Next Steps

- **[Content Management](/sanity/content-management/)** - Start adding content
- **[Theme Configuration](/sanity/theme-configuration/)** - Customize theme
- **[Schema Extensions](/customization/schema-extensions/)** - Add custom fields
