---
title: Theme Configuration
description: Configure visual themes in Sanity CMS
---

# Theme Configuration

Configure your podcast's visual theme (colors, fonts, layout) directly in Sanity CMS without touching code.

## Quick Start

1. Open Sanity Studio (http://localhost:3333)
2. Click **"Theme"** in sidebar
3. Click **"Create new Theme"** (or edit existing)
4. Configure colors, fonts, and layout
5. Click **"Publish"**
6. Refresh your website - theme applied!

## Theme Fields

### Colors

All colors use RGB format for opacity support.

**Primary Color:**
- Main brand color
- Used for: links, buttons, accents
- Example: Blue (59, 130, 246)

**Secondary Color:**
- Complementary color
- Used for: navigation, subheadings
- Example: Purple (139, 92, 246)

**Accent Color:**
- Highlight color
- Used for: badges, highlights
- Example: Sky blue (14, 165, 233)

**Background Color:**
- Page background
- Example: Light gray (249, 250, 251)

**Text Color:**
- Main text color
- Example: Dark gray (17, 24, 39)

**Header Colors:**
- Background: Header background
- Text: Header text color

**Footer Colors:**
- Background: Footer background
- Text: Footer text color

**RGB Format:**
```
Red: 220, 38, 38
     ^   ^   ^
     R   G   B

Each number: 0-255
```

:::tip[Color Picker]
Use online tools to convert hex to RGB:
- #3B82F6 → 59, 130, 246
- #DC2626 → 220, 38, 38
:::

### Typography

**Font Family:**
- Body text font
- Example: "Inter, sans-serif"
- Supports Google Fonts

**Heading Font:**
- Headings font (H1, H2, etc.)
- Example: "Montserrat, sans-serif"
- Optional (uses Font Family if not set)

**Google Fonts Integration:**

Framework automatically loads Google Fonts:

```
Font Family: "Roboto"
↓
Loads: https://fonts.googleapis.com/css2?family=Roboto
↓
Applied to: body { font-family: 'Roboto', sans-serif; }
```

**Popular Font Combinations:**
```
Modern:
- Body: Inter
- Heading: Inter

Classic:
- Body: Merriweather
- Heading: Montserrat

Tech:
- Body: Roboto
- Heading: Roboto Mono

Elegant:
- Body: Lora
- Heading: Playfair Display
```

### Layout

**Border Radius:**
- Tailwind class for rounded corners
- Options:
  - `rounded-none` - Sharp corners
  - `rounded` - Slightly rounded
  - `rounded-lg` - Rounded (default)
  - `rounded-xl` - Very rounded
  - `rounded-full` - Fully rounded

**Spacing:**
- Layout spacing preference
- Options:
  - `compact` - Tight spacing
  - `normal` - Balanced spacing (default)
  - `spacious` - Generous spacing

## Complete Example

```javascript
// Theme document in Sanity
{
  _type: 'theme',
  name: 'Brand Theme',

  // Colors
  colors: {
    primary: { r: 220, g: 38, b: 38 },      // Red
    secondary: { r: 245, g: 158, b: 11 },   // Amber
    accent: { r: 34, g: 197, b: 94 },       // Green
    background: { r: 255, g: 255, b: 255 }, // White
    text: { r: 17, g: 24, b: 39 },          // Dark gray
    headerBg: { r: 220, g: 38, b: 38 },     // Red
    headerText: { r: 255, g: 255, b: 255 }, // White
    footerBg: { r: 17, g: 24, b: 39 },      // Dark gray
    footerText: { r: 255, g: 255, b: 255 }  // White
  },

  // Typography
  typography: {
    fontFamily: 'Roboto',
    headingFont: 'Montserrat'
  },

  // Layout
  layout: {
    borderRadius: 'rounded-xl',
    spacing: 'spacious'
  }
}
```

## How Themes Work

### 1. Theme Stored in Sanity

Theme document in Sanity CMS.

### 2. Theme Fetched at Build Time

```astro
---
import { getPodcast } from '@rejected-media/podcast-framework-core';

const podcast = await getPodcast();
const theme = podcast?.theme;
---
```

### 3. CSS Generated

```astro
---
import { generateThemeCSS } from '@rejected-media/podcast-framework-core';

const css = generateThemeCSS(theme);
---

<style set:html={css}></style>
```

### 4. Components Use Theme

```astro
<Header theme={theme} />
<Footer theme={theme} />
```

## Previewing Themes

### Live Preview

Themes update in real-time during development:

1. Open Sanity Studio (http://localhost:3333)
2. Open your website (http://localhost:4321)
3. Edit theme in Studio
4. Click "Publish"
5. Refresh website → Theme applied!

### Multiple Themes

Create multiple themes for testing:

```
Theme 1: Light Theme (default)
Theme 2: Dark Theme (test)
Theme 3: Brand Theme (final)
```

Switch by changing which theme the Podcast references.

## Troubleshooting

### Theme not applying

**Check 1:** Theme is published
- Open Theme document
- Verify "Published" badge (not "Draft")

**Check 2:** Podcast references theme
- Open Podcast document
- Check theme field links to correct theme

**Check 3:** Build with fresh cache
```bash
rm -rf .astro dist
npm run build
```

### Colors look wrong

**Check RGB values:** Must be 0-255 for each component

```
✅ Valid: 59, 130, 246
❌ Invalid: 256, 130, 246 (256 > 255)
❌ Invalid: 59; 130; 246 (semicolons)
❌ Invalid: #3B82F6 (hex format)
```

### Fonts not loading

**Check spelling:**
```
✅ "Inter" (correct)
❌ "inter" (wrong case)
❌ "Inter Bold" (don't include weight)
```

**Check Google Fonts availability:**
Visit https://fonts.google.com/ and search for your font.

### Border radius not working

**Check Tailwind class:**
```
✅ "rounded-lg" (Tailwind class)
❌ "8px" (CSS value)
❌ "large" (not a Tailwind class)
```

Valid classes:
- `rounded-none`, `rounded-sm`, `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`

## Related

- **[Theme System API](/api/theme/)** - Theme utilities
- **[Customization: Theming](/customization/theming/)** - Advanced theming
- **[Getting Started](/getting-started/configuration/)** - Configuration

## Next Steps

- **[Homepage Configuration](/sanity/homepage-configuration/)** - Configure homepage sections
- **[About Page Configuration](/sanity/about-page-configuration/)** - Configure about page
- **[Content Management](/sanity/content-management/)** - Add content
