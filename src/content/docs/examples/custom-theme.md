---
title: Custom Theme Example
description: Example of creating a custom branded theme
---

# Custom Theme Example

This example shows how to create a fully customized theme for your podcast using the CMS-driven theme system.

## Goal

Create a custom theme with:
- Brand colors (red and orange)
- Custom fonts (Roboto and Montserrat)
- Rounded corners
- Spacious layout

## Step-by-Step

### Step 1: Open Sanity Studio

```bash
npm run dev:sanity
```

Visit http://localhost:3333

### Step 2: Create Theme

1. Click **"Theme"** in sidebar
2. Click **"Create new Theme"**
3. Name: "Brand Theme"

### Step 3: Configure Colors

**Primary Color:** Red
```
R: 220
G: 38
B: 38
```

**Secondary Color:** Orange
```
R: 234
G: 88
B: 12
```

**Accent Color:** Light Orange
```
R: 251
G: 146
B: 60
```

**Background:** White
```
R: 255
G: 255
B: 255
```

**Text:** Dark Gray
```
R: 17
G: 24
B: 39
```

**Header Background:** Red (same as primary)
```
R: 220
G: 38
B: 38
```

**Header Text:** White
```
R: 255
G: 255
B: 255
```

**Footer Background:** Dark Gray
```
R: 31
G: 41
B: 55
```

**Footer Text:** White
```
R: 255
G: 255
B: 255
```

### Step 4: Configure Typography

**Font Family:** "Roboto"

**Heading Font:** "Montserrat"

### Step 5: Configure Layout

**Border Radius:** "rounded-xl" (very rounded)

**Spacing:** "spacious"

### Step 6: Publish Theme

Click **"Publish"**

### Step 7: Apply to Podcast

1. Click **"Podcast"** in sidebar
2. Open your podcast document
3. Scroll to **"Theme"** field
4. Select "Brand Theme"
5. Click **"Publish"**

### Step 8: Preview

Refresh your website → Custom theme applied!

## Result

Your podcast now has:

**Colors:**
- Red primary color on buttons and links
- Orange accents
- White background
- Dark text for readability

**Typography:**
- Roboto for body text (clean, modern)
- Montserrat for headings (distinctive)

**Layout:**
- Extra rounded corners on cards
- Generous spacing between sections
- Breathable, spacious design

## Code Implementation

The theme is automatically converted to CSS:

```css
:root {
  /* Colors */
  --color-primary: 220, 38, 38;        /* Red */
  --color-secondary: 234, 88, 12;      /* Orange */
  --color-accent: 251, 146, 60;        /* Light orange */
  --color-background: 255, 255, 255;   /* White */
  --color-text: 17, 24, 39;            /* Dark gray */
  --color-header-bg: 220, 38, 38;      /* Red */
  --color-header-text: 255, 255, 255;  /* White */
  --color-footer-bg: 31, 41, 55;       /* Dark gray */
  --color-footer-text: 255, 255, 255;  /* White */

  /* Typography */
  --font-family: Roboto, sans-serif;
  --font-heading: Montserrat, sans-serif;
}

/* Google Fonts auto-loaded */
@import url('https://fonts.googleapis.com/css2?family=Roboto&family=Montserrat&display=swap');
```

## Using Theme in Custom Components

```astro
---
// src/components/CustomCard.astro
---

<div class="card">
  <h3>Custom Component</h3>
  <p>Uses theme colors automatically</p>
  <button>Click Me</button>
</div>

<style>
  .card {
    background: rgb(var(--color-background));
    border: 2px solid rgb(var(--color-primary));
    padding: 2rem;
    border-radius: 1rem;  /* matches rounded-xl */
  }

  .card h3 {
    color: rgb(var(--color-primary));
    font-family: var(--font-heading);
  }

  .card button {
    background: rgb(var(--color-primary));
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
  }

  .card button:hover {
    background: rgba(var(--color-primary), 0.9);
  }
</style>
```

## Advanced Customization

### Multiple Themes

Create themes for different purposes:

```
Theme 1: Brand Theme (production)
Theme 2: Holiday Theme (seasonal)
Theme 3: Dark Theme (alternative)
```

Switch by updating Podcast's theme reference.

### Theme Variations

Create variations of your theme:

**Light Variation:**
```
Background: 255, 255, 255 (white)
Text: 17, 24, 39 (dark)
```

**Dark Variation:**
```
Background: 17, 24, 39 (dark)
Text: 249, 250, 251 (light)
```

### Per-Page Theme Overrides

Use different theme for specific pages:

```astro
---
// src/pages/special.astro
import { mergeTheme, defaultTheme, generateThemeCSS } from '@rejected-media/podcast-framework-core';

const pageTheme = mergeTheme(defaultTheme, {
  colors: {
    primary: '16, 185, 129',  // Green for this page
  }
});

const themeCSS = generateThemeCSS(pageTheme);
---

<style set:html={themeCSS}></style>

<!-- Page uses green theme -->
```

## Color Palette Generator

Use these tools to create harmonious color palettes:

- [coolors.co](https://coolors.co/) - Generate palettes
- [paletton.com](https://paletton.com/) - Color scheme designer
- [colorhunt.co](https://colorhunt.co/) - Curated palettes

**Then convert to RGB:**

```
Hex: #DC2626
↓
RGB: 220, 38, 38
↓
Sanity: R: 220, G: 38, B: 38
```

## Complete Theme Configuration

```javascript
{
  _type: 'theme',
  name: 'Brand Theme',

  colors: {
    primary: { r: 220, g: 38, b: 38 },      // Red-600
    secondary: { r: 234, g: 88, b: 12 },    // Orange-600
    accent: { r: 251, g: 146, b: 60 },      // Orange-400
    background: { r: 255, g: 255, b: 255 }, // White
    text: { r: 17, g: 24, b: 39 },          // Gray-900
    headerBg: { r: 220, g: 38, b: 38 },     // Red-600
    headerText: { r: 255, g: 255, b: 255 }, // White
    footerBg: { r: 31, g: 41, b: 55 },      // Gray-800
    footerText: { r: 255, g: 255, b: 255 }  // White
  },

  typography: {
    fontFamily: 'Roboto',
    headingFont: 'Montserrat'
  },

  layout: {
    borderRadius: 'rounded-xl',
    spacing: 'spacious'
  }
}
```

## Testing Your Theme

### Visual Testing

Check theme on all pages:

```bash
# Homepage
http://localhost:4321/

# Episodes
http://localhost:4321/episodes

# Individual episode
http://localhost:4321/episodes/welcome-to-the-show

# About
http://localhost:4321/about
```

### Responsive Testing

Test on multiple screen sizes:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Large: 1440px

### Accessibility Testing

Check contrast ratios:

**Tool:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

```
Text on Background:
- Foreground: rgb(17, 24, 39)
- Background: rgb(255, 255, 255)
- Ratio: 18:1 ✅ (WCAG AAA)

Button Text:
- Foreground: rgb(255, 255, 255)
- Background: rgb(220, 38, 38)
- Ratio: 5.9:1 ✅ (WCAG AA)
```

## Related

- **[Theming Guide](/customization/theming/)** - Complete theming guide
- **[Theme Configuration](/sanity/theme-configuration/)** - Configure in Sanity
- **[Theme System API](/api/theme/)** - Theme utilities

## Next Steps

- **[Component Overrides](/customization/component-overrides/)** - Customize components
- **[Basic Podcast Example](/examples/basic-podcast/)** - Complete example
- **[Deployment](/deployment/cloudflare-pages/)** - Deploy your themed site
