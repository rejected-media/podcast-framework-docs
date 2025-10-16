---
title: Theming
description: Customize colors, fonts, and layout of your podcast website
---

# Theming

Customize your podcast's visual appearance using the CMS-driven theme system. Change colors, fonts, and layout without touching code.

## Quick Start

1. Open Sanity Studio (http://localhost:3333)
2. Click **"Theme"** in sidebar
3. Edit colors, fonts, and layout
4. Click **"Publish"**
5. Refresh website → Theme applied!

## Theme Levels

### Level 1: Sanity CMS (Easiest)

Configure theme in Sanity Studio:

**Colors:** RGB sliders or input
**Fonts:** Google Fonts dropdown
**Layout:** Radio buttons

**No code required!**

### Level 2: CSS Custom Properties

Override CSS variables:

```astro
---
// src/layouts/BaseLayout.astro
---

<style is:global>
  :root {
    --color-primary: 220, 38, 38;  /* Red */
  }
</style>
```

### Level 3: Tailwind Configuration

Customize Tailwind theme:

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
      }
    }
  }
};
```

### Level 4: Component Overrides

Override components for complete control:

```astro
// src/components/Header.astro
<header class="custom-styles">
  <!-- Your design -->
</header>
```

## Color Customization

### Using Sanity CMS

**Step 1:** Open Theme document

**Step 2:** Edit colors

```
Primary Color:
  R: 59  (0-255)
  G: 130
  B: 246

Result: rgb(59, 130, 246) → Blue
```

**Step 3:** Preview changes

Save and refresh website to see changes.

### Popular Color Schemes

**Blue (Default):**
```
Primary: 59, 130, 246     (Blue)
Secondary: 139, 92, 246   (Purple)
Accent: 14, 165, 233      (Sky)
```

**Red:**
```
Primary: 220, 38, 38      (Red-600)
Secondary: 234, 88, 12    (Orange-600)
Accent: 251, 146, 60      (Orange-400)
```

**Green:**
```
Primary: 16, 185, 129     (Emerald-500)
Secondary: 5, 150, 105    (Emerald-600)
Accent: 52, 211, 153      (Emerald-400)
```

**Dark:**
```
Background: 17, 24, 39    (Gray-900)
Text: 249, 250, 251       (Gray-50)
Primary: 96, 165, 250     (Blue-400)
```

### Color Tools

**Convert hex to RGB:**
```
#3B82F6 → R: 59, G: 130, B: 246
#DC2626 → R: 220, G: 38, B: 38
```

**Online tools:**
- [rgbacolorpicker.com](https://rgbacolorpicker.com/)
- [colorpicker.me](https://colorpicker.me/)

### Using Colors in Code

**RGB format allows opacity:**

```css
/* Solid */
background: rgb(var(--color-primary));

/* Transparent */
background: rgba(var(--color-primary), 0.1);   /* 10% */
background: rgba(var(--color-primary), 0.5);   /* 50% */
background: rgba(var(--color-primary), 0.9);   /* 90% */
```

**Example:**
```astro
<div
  style="background: rgba(var(--color-primary), 0.1);"
  class="p-8 rounded-lg"
>
  Subtle background
</div>
```

## Typography Customization

### Using Google Fonts

**Step 1:** Choose fonts at [fonts.google.com](https://fonts.google.com/)

**Step 2:** Enter font name in Sanity Theme:

```
Font Family: "Inter"
Heading Font: "Montserrat"
```

**Step 3:** Framework loads fonts automatically:

```html
<!-- Auto-generated -->
<link href="https://fonts.googleapis.com/css2?family=Inter&family=Montserrat" />
```

### Popular Font Combinations

**Modern:**
```
Body: Inter
Heading: Inter
```

**Classic:**
```
Body: Merriweather
Heading: Montserrat
```

**Tech:**
```
Body: Roboto
Heading: Roboto Mono
```

**Elegant:**
```
Body: Lora
Heading: Playfair Display
```

**Minimal:**
```
Body: Work Sans
Heading: Work Sans
```

### Custom Fonts

Use custom fonts (not from Google):

```astro
---
// src/layouts/BaseLayout.astro
---

<style is:global>
  @font-face {
    font-family: 'CustomFont';
    src: url('/fonts/custom-font.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  :root {
    --font-family: 'CustomFont', sans-serif;
  }
</style>
```

## Layout Customization

### Border Radius

Control how rounded elements are:

**Options (Tailwind classes):**
- `rounded-none` - Square corners
- `rounded-sm` - Slightly rounded
- `rounded` - Rounded
- `rounded-lg` - More rounded (default)
- `rounded-xl` - Very rounded
- `rounded-2xl` - Extra rounded
- `rounded-full` - Fully rounded (pills)

**Example:**
```
rounded-lg (default):
┌─────────┐
│ Content │
└─────────┘

rounded-xl:
╭─────────╮
│ Content │
╰─────────╯

rounded-none:
┌─────────┐
│ Content │
└─────────┘
```

### Spacing

Control layout spacing:

**Options:**
- `compact` - Tight spacing, more content visible
- `normal` - Balanced spacing (default)
- `spacious` - Generous spacing, breathable design

**Example:**
```
Compact:
Card padding: 1rem
Section margin: 2rem

Normal:
Card padding: 1.5rem
Section margin: 4rem

Spacious:
Card padding: 2rem
Section margin: 6rem
```

## Advanced Theming

### CSS Custom Properties

All theme values are exposed as CSS variables:

```css
/* Colors */
--color-primary
--color-secondary
--color-accent
--color-background
--color-text
--color-header-bg
--color-header-text
--color-footer-bg
--color-footer-text

/* Typography */
--font-family
--font-heading
```

**Override in your CSS:**

```astro
<style is:global>
  :root {
    --color-primary: 220, 38, 38;  /* Override to red */
  }

  /* Or use CSS variables */
  .custom-button {
    background: rgb(var(--color-primary));
    color: white;
  }

  .custom-button:hover {
    background: rgba(var(--color-primary), 0.9);
  }
</style>
```

### Dark Mode

Implement dark mode with theme switching:

```astro
---
import { mergeTheme, defaultTheme } from '@rejected-media/podcast-framework-core';

const darkTheme = mergeTheme(defaultTheme, {
  colors: {
    background: '17, 24, 39',    // Dark
    text: '249, 250, 251',       // Light
  }
});
---

<button id="theme-toggle">Toggle Dark Mode</button>

<script>
  let isDark = false;

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    isDark = !isDark;

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
</script>

<style>
  :root {
    --color-background: 255, 255, 255;
    --color-text: 17, 24, 39;
  }

  :root.dark {
    --color-background: 17, 24, 39;
    --color-text: 249, 250, 251;
  }
</style>
```

### Per-Page Themes

Different theme for different pages:

```astro
---
// src/pages/special.astro
import { mergeTheme, defaultTheme, generateThemeCSS } from '@rejected-media/podcast-framework-core';

const specialTheme = mergeTheme(defaultTheme, {
  colors: {
    primary: '220, 38, 38',  // Red for this page
  }
});

const themeCSS = generateThemeCSS(specialTheme);
---

<style set:html={themeCSS}></style>

<!-- Page content -->
```

## Troubleshooting

### Theme not applying

**Check 1:** Theme is published in Sanity
- Open Theme document
- Verify "Published" badge

**Check 2:** Podcast references theme
- Open Podcast document
- Check theme field

**Check 3:** Clear cache
```bash
rm -rf .astro dist
npm run build
```

### Colors look wrong

**Check RGB values:** Must be 0-255

```
✅ Valid: 59, 130, 246
❌ Invalid: 256, 0, 0 (256 > 255)
```

### Fonts not loading

**Check spelling:**
```
✅ "Inter" (exact match required)
❌ "inter" (lowercase)
```

Visit [fonts.google.com](https://fonts.google.com/) to verify exact font name.

### Custom CSS not overriding theme

Use `!important` sparingly:

```css
/* ❌ Avoid if possible */
.custom {
  color: red !important;
}

/* ✅ Better - More specific selector */
body .custom {
  color: red;
}
```

## Related

- **[Theme Configuration](/sanity/theme-configuration/)** - Configure in Sanity
- **[Component Overrides](/customization/component-overrides/)** - Override components
- **[Theme System API](/api/theme/)** - Theme utilities

## Next Steps

- **[Component Overrides](/customization/component-overrides/)** - Override components
- **[Custom Components](/customization/custom-components/)** - Build new components
- **[Examples](/examples/custom-theme/)** - See theming examples
