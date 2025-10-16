---
title: Quick Start
description: Get your podcast website running in 10 minutes
---

# Quick Start

Get a production-ready podcast website running in **under 10 minutes**. This guide will walk you through creating a new podcast site from scratch.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed ([download here](https://nodejs.org/))
- **Git** installed ([download here](https://git-scm.com/))
- A **Sanity account** (free - sign up at [sanity.io](https://www.sanity.io/))

:::tip[Time estimate]
This entire guide takes **5-10 minutes** from start to finish.
:::

## Step 1: Create Project

Use the Podcast Framework CLI to create a new project:

```bash
npm create podcast-framework my-podcast
```

This will:
- ✅ Clone the podcast-template repository
- ✅ Install all dependencies
- ✅ Set up the project structure
- ✅ Create a `.env.template` file

:::note
The CLI uses the [podcast-template](https://github.com/rejected-media/podcast-template) as a starting point, giving you a complete, working podcast site immediately.
:::

## Step 2: Navigate to Project

```bash
cd my-podcast
```

## Step 3: Set Up Sanity CMS

Initialize your Sanity project:

```bash
npx sanity@latest init
```

**Follow the prompts:**

1. **Create new project?** → Yes
2. **Project name** → `my-podcast` (or your podcast name)
3. **Use default dataset?** → Yes
4. **Output path** → `./sanity` (press Enter)
5. **Select project template** → Clean project with no predefined schemas

:::caution[Important]
Write down your **Project ID** - you'll need it in the next step!
:::

## Step 4: Configure Environment Variables

Create a `.env` file from the template:

```bash
cp .env.template .env
```

Edit `.env` and add your Sanity credentials:

```bash
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID="your-project-id-here"  # From Step 3
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_API_VERSION="2024-01-01"

# Site Configuration
PUBLIC_SITE_URL="http://localhost:4321"
```

:::tip
The template includes commented examples for all optional services (Resend, ConvertKit, Google Analytics, Sentry). You can add these later!
:::

## Step 5: Deploy Sanity Schemas

Deploy the podcast schemas to your Sanity project:

```bash
cd sanity
npx sanity schema deploy
cd ..
```

This adds schemas for:
- Episodes
- Guests
- Hosts
- Podcast metadata
- Theme configuration
- Homepage configuration
- About page configuration
- Contributions

## Step 6: Start Development Servers

Start both the Astro dev server and Sanity Studio:

```bash
# Terminal 1: Astro dev server
npm run dev

# Terminal 2: Sanity Studio (in a new terminal)
npm run dev:sanity
```

Your podcast site is now running at:
- **Website:** http://localhost:4321
- **Sanity Studio:** http://localhost:3333

## Step 7: Add Your First Episode

1. Open Sanity Studio at http://localhost:3333
2. Click **"Podcast"** in the sidebar
3. Fill in your podcast information:
   - Name
   - Tagline
   - Description
   - Links (Spotify, Apple Podcasts, etc.)
4. Click **"Publish"**
5. Click **"Episode"** in the sidebar
6. Click **"Create new Episode"**
7. Fill in episode details:
   - Title
   - Episode number
   - Publish date
   - Duration
   - Description
   - Links (Spotify, Apple, YouTube)
8. Click **"Publish"**

:::tip[RSS Import]
Have existing episodes? Import them from your RSS feed:

```bash
npm run import:episodes
```

This will fetch all episodes from your podcast RSS feed and create them in Sanity.
:::

## Step 8: Customize Your Theme

1. In Sanity Studio, click **"Theme"** in the sidebar
2. Customize colors:
   - Primary color (links, buttons)
   - Background color
   - Text colors
3. Select fonts (Google Fonts integration)
4. Choose layout options
5. Click **"Publish"**

Refresh your website to see the changes!

## Step 9: Add Your First Guest

1. Click **"Guest"** in the sidebar
2. Click **"Create new Guest"**
3. Fill in guest details:
   - Name
   - Slug (auto-generated from name)
   - Bio
   - Photo (upload)
   - Social links (Twitter, LinkedIn, Website)
4. Click **"Publish"**
5. Go back to your episode
6. Add the guest to the episode's "Guests" field
7. Click **"Publish"**

## What You've Built

In 10 minutes, you now have:

- ✅ **Beautiful homepage** with featured episodes
- ✅ **Episode archive** with search functionality
- ✅ **Individual episode pages** with Spotify embeds
- ✅ **Guest directory** with photos and bios
- ✅ **Guest profile pages** with all their episodes
- ✅ **About page** (CMS-configurable)
- ✅ **Newsletter signup** (ready for ConvertKit integration)
- ✅ **Contribution form** (ready for Resend integration)
- ✅ **Custom theme** (your colors and fonts)
- ✅ **Fully responsive** (mobile, tablet, desktop)
- ✅ **Type-safe** (TypeScript with strict mode)
- ✅ **SEO optimized** (meta tags, sitemaps)

## Next Steps

Now that your site is running, you can:

1. **[Deploy to production](/deployment/cloudflare-pages/)** - Go live in 5 minutes
2. **[Customize components](/customization/component-overrides/)** - Make it yours
3. **[Set up email](/api/server-services/)** - Enable newsletter and contributions
4. **[Add analytics](/getting-started/configuration/)** - Track your visitors

## Common Next Steps

### Import Existing Episodes

If you have an existing podcast RSS feed:

```bash
# Set RSS_FEED_URL in .env
echo 'RSS_FEED_URL="https://your-podcast.com/feed.xml"' >> .env

# Import episodes
npm run import:episodes
```

### Set Up Newsletter

1. Create a [ConvertKit account](https://convertkit.com/) (free)
2. Get your API key and Form ID
3. Add to `.env`:

```bash
CONVERTKIT_API_KEY="your-api-key"
CONVERTKIT_FORM_ID="your-form-id"
```

Newsletter signups now work!

### Set Up Contributions

1. Create a [Resend account](https://resend.com/) (free tier available)
2. Get your API key
3. Add to `.env`:

```bash
RESEND_API_KEY="your-api-key"
NOTIFICATION_EMAIL="your@email.com"
```

Contribution form now sends emails!

### Deploy to Production

Deploy to Cloudflare Pages in 5 minutes:

```bash
# Build the site
npm run build

# Deploy (follow prompts)
npx wrangler pages deploy dist
```

Or use the [Cloudflare Pages dashboard](https://dash.cloudflare.com/) for automatic deployments on git push.

## Getting Help

Stuck? Here's where to get help:

- **[GitHub Discussions](https://github.com/rejected-media/podcast-framework/discussions)** - Ask questions
- **[GitHub Issues](https://github.com/rejected-media/podcast-framework/issues)** - Report bugs
- **[Documentation](/getting-started/overview/)** - Read the full docs
- **[Examples](/examples/basic-podcast/)** - See example projects

## Troubleshooting

### "Module not found: @rejected-media/podcast-framework-core"

Make sure dependencies are installed:

```bash
npm install
```

### "Sanity client error: Project not found"

Check your `.env` file - `PUBLIC_SANITY_PROJECT_ID` must match your Sanity project ID.

### "Build failed: Type error"

Make sure you're using Node.js 18 or higher:

```bash
node --version  # Should show v18.0.0 or higher
```

### Episode images not showing

Images must be uploaded to Sanity. In Sanity Studio:

1. Go to your episode
2. Click the "Cover Image" field
3. Upload an image
4. Click "Publish"

## What's Next?

Continue learning:

- **[Project Structure](/getting-started/project-structure/)** - Understand the file layout
- **[Configuration](/getting-started/configuration/)** - Configure your site
- **[Components](/components/overview/)** - Learn about the components
- **[Deployment](/deployment/cloudflare-pages/)** - Deploy to production

---

**🎉 Congratulations!** You've created your first podcast website with Podcast Framework. Now go make it yours!
