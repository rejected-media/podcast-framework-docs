---
title: Theme System
description: Theme configuration and CSS generation utilities
---

# Theme System

The theme system provides utilities for managing podcast themes, generating CSS custom properties, and integrating with Google Fonts. All themes are stored in Sanity CMS and applied at runtime.

## Import

```typescript
import {
  defaultTheme,
  generateThemeCSS,
  getGoogleFontsURL,
  mergeTheme
} from '@podcast-framework/core';
```

## Theme Object

```typescript
interface Theme {
  colors: {
    primary: string;        // RGB format: "59, 130, 246"
    secondary: string;
    accent: string;
    background: string;
    text: string;
    headerBg: string;
    headerText: string;
    footerBg: string;
    footerText: string;
  };
  typography: {
    fontFamily: string;     // "Inter, sans-serif"
    headingFont: string;    // Optional heading font
  };
  layout: {
    borderRadius: string;   // Tailwind class: "rounded-lg"
    spacing: string;        // "normal" | "compact" | "spacious"
  };
}
```

## Functions

### `defaultTheme`

Default theme used as fallback when CMS theme fails to load.

**Type:** `Theme`

**Value:**
```typescript
export const defaultTheme: Theme = {
  colors: {
    primary: '59, 130, 246',      // Blue
    secondary: '139, 92, 246',    // Purple
    accent: '14, 165, 233',       // Sky blue
    background: '249, 250, 251',  // Light gray
    text: '17, 24, 39',           // Dark gray
    headerBg: '0, 0, 0',          // Black
    headerText: '255, 255, 255',  // White
    footerBg: '0, 0, 0',          // Black
    footerText: '255, 255, 255',  // White
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    headingFont: 'Inter, system-ui, -apple-system, sans-serif',
  },
  layout: {
    borderRadius: 'rounded-lg',
    spacing: 'normal',
  },
};
```

**Usage:**
```astro
---
import { defaultTheme } from '@podcast-framework/core';

// Use as fallback
const theme = podcast?.theme || defaultTheme;
---

<Header theme={theme} />
```

### `generateThemeCSS()`

Generate CSS custom properties from theme object.

**Signature:**
```typescript
function generateThemeCSS(theme: Theme): string
```

**Parameters:**
- `theme` - Theme configuration object

**Returns:** CSS string with custom properties

**Example:**
```typescript
const css = generateThemeCSS(theme);
```

**Generated CSS:**
```css
:root {
  /* Colors (RGB format allows rgba() usage) */
  --color-primary: 59, 130, 246;
  --color-secondary: 139, 92, 246;
  --color-accent: 14, 165, 233;
  --color-background: 249, 250, 251;
  --color-text: 17, 24, 39;
  --color-header-bg: 0, 0, 0;
  --color-header-text: 255, 255, 255;
  --color-footer-bg: 0, 0, 0;
  --color-footer-text: 255, 255, 255;

  /* Typography */
  --font-family: Inter, system-ui, sans-serif;
  --font-heading: Inter, system-ui, sans-serif;
}

body {
  background: rgb(var(--color-background));
  color: rgb(var(--color-text));
  font-family: var(--font-family);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}
```

**Usage in BaseLayout:**
```astro
---
import { getPodcast, generateThemeCSS, defaultTheme } from '@podcast-framework/core';

const podcast = await getPodcast();
const theme = podcast?.theme || defaultTheme;
const themeCSS = generateThemeCSS(theme);
---

<html>
  <head>
    <style set:html={themeCSS}></style>
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Security:**
RGB values are validated to prevent CSS injection:

```typescript
// ❌ Invalid RGB (rejected)
{ primary: "1, 2, 3; }body{ background: red; }" }
// → Fallback to default

// ✅ Valid RGB (accepted)
{ primary: "59, 130, 246" }
// → Used
```

### `getGoogleFontsURL()`

Generate Google Fonts import URL from font family names.

**Signature:**
```typescript
function getGoogleFontsURL(fonts: string[]): string
```

**Parameters:**
- `fonts` - Array of Google Font family names

**Returns:** Google Fonts API URL

**Examples:**
```typescript
getGoogleFontsURL(['Inter'])
// → "https://fonts.googleapis.com/css2?family=Inter&display=swap"

getGoogleFontsURL(['Inter', 'Merriweather'])
// → "https://fonts.googleapis.com/css2?family=Inter&family=Merriweather&display=swap"

getGoogleFontsURL([])
// → "" (empty string)
```

**Usage:**
```astro
---
import { getGoogleFontsURL } from '@podcast-framework/core';

const podcast = await getPodcast();
const fonts = [
  podcast?.theme?.typography?.fontFamily,
  podcast?.theme?.typography?.headingFont
].filter(Boolean);

const googleFontsURL = getGoogleFontsURL(fonts);
---

<html>
  <head>
    {googleFontsURL && (
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href={googleFontsURL} rel="stylesheet" />
    )}
  </head>
</html>
```

### `mergeTheme()`

Merge theme with overrides (partial customization).

**Signature:**
```typescript
function mergeTheme(
  base: Theme,
  overrides: Partial<Theme>
): Theme
```

**Parameters:**
- `base` - Base theme
- `overrides` - Partial theme to merge

**Returns:** Merged theme

**Examples:**
```typescript
import { defaultTheme, mergeTheme } from '@podcast-framework/core';

// Override only primary color
const customTheme = mergeTheme(defaultTheme, {
  colors: {
    primary: '220, 38, 38'  // Red
  }
});

// Override only fonts
const fontTheme = mergeTheme(defaultTheme, {
  typography: {
    fontFamily: 'Roboto, sans-serif',
    headingFont: 'Montserrat, sans-serif'
  }
});

// Override multiple sections
const mixedTheme = mergeTheme(defaultTheme, {
  colors: {
    primary: '16, 185, 129',    // Green
    secondary: '245, 158, 11'   // Amber
  },
  layout: {
    borderRadius: 'rounded-xl',
    spacing: 'spacious'
  }
});
```

**Usage:**
```typescript
// Brand-specific customization
const brandTheme = mergeTheme(defaultTheme, {
  colors: {
    primary: brandColors.primary,
    secondary: brandColors.secondary
  }
});

// Environment-specific customization
const devTheme = mergeTheme(baseTheme, {
  colors: {
    primary: '239, 68, 68'  // Red for dev environment
  }
});
```

## RGB Color Format

### Why RGB Instead of Hex?

Theme colors use RGB format (`"59, 130, 246"`) instead of hex (`"#3B82F6"`):

**Advantage:** Allows opacity variations

```css
/* RGB format enables rgba() */
background: rgb(var(--color-primary));           /* Solid */
background: rgba(var(--color-primary), 0.5);     /* 50% opacity */
background: rgba(var(--color-primary), 0.1);     /* 10% opacity */

/* Hex format doesn't work with CSS variables */
/* This is NOT possible: */
background: var(--color-primary-hex) + "80";     /* ❌ Invalid */
```

**Usage in Components:**
```css
.card {
  background: rgba(var(--color-primary), 0.1);
  border: 2px solid rgb(var(--color-primary));
}

.card:hover {
  background: rgba(var(--color-primary), 0.2);
}
```

### Converting Hex to RGB

```typescript
function hexToRGB(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `${r}, ${g}, ${b}`;
}

hexToRGB('#3B82F6')  // → "59, 130, 246"
```

### Converting RGB to Hex

```typescript
function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.split(',').map(n => parseInt(n.trim()));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

rgbToHex('59, 130, 246')  // → "#3b82f6"
```

## CSS Custom Properties

### Available Variables

Generated by `generateThemeCSS()`:

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

### Usage in Components

```css
/* Solid color */
background: rgb(var(--color-primary));
color: rgb(var(--color-text));

/* With opacity */
background: rgba(var(--color-primary), 0.1);
border: 1px solid rgba(var(--color-secondary), 0.3);

/* Typography */
font-family: var(--font-family);
h1, h2, h3 {
  font-family: var(--font-heading);
}
```

### Inline Styles

```astro
<div
  style="background: rgb(var(--color-primary)); color: white;"
  class="p-4 rounded-lg"
>
  Themed content
</div>
```

## Security & Validation

### RGB Validation

Colors are validated to prevent CSS injection:

```typescript
// ✅ Valid RGB values
validateRGBValue("59, 130, 246")      // → "59, 130, 246"
validateRGBValue("0, 0, 0")           // → "0, 0, 0"
validateRGBValue("255, 255, 255")    // → "255, 255, 255"

// ❌ Invalid values (use fallback)
validateRGBValue("256, 0, 0")        // → fallback (out of range)
validateRGBValue("59; 130; 246")     // → fallback (wrong format)
validateRGBValue("rgb(59, 130, 246)") // → fallback (wrong format)
validateRGBValue("'; alert('xss')")  // → fallback (injection attempt)
```

### Font Sanitization

Font families are sanitized to prevent CSS injection:

```typescript
// ✅ Safe font families
sanitizeFontFamily("Inter, sans-serif")          // → "Inter, sans-serif"
sanitizeFontFamily("'Roboto Mono', monospace")   // → "'Roboto Mono', monospace"

// ❌ Dangerous inputs (sanitized)
sanitizeFontFamily("Inter; }body{ background: red")  // → "Inter  body background: red"
sanitizeFontFamily("'; alert('xss')")                // → "' alert('xss')"
```

**Blocked characters:** `{`, `}`, `;`

## Theming Workflow

### 1. Define Theme in Sanity

```typescript
// In Sanity Studio
{
  _type: 'theme',
  name: 'Brand Theme',
  colors: {
    primary: { r: 59, g: 130, b: 246 },
    secondary: { r: 139, g: 92, b: 246 },
    // ... more colors
  },
  typography: {
    fontFamily: 'Inter',
    headingFont: 'Montserrat'
  },
  layout: {
    borderRadius: 'rounded-xl',
    spacing: 'spacious'
  }
}
```

### 2. Fetch Theme

```astro
---
import { getPodcast, defaultTheme } from '@podcast-framework/core';

const podcast = await getPodcast();
const theme = podcast?.theme || defaultTheme;
---
```

### 3. Generate CSS

```astro
---
import { generateThemeCSS } from '@podcast-framework/core';

const themeCSS = generateThemeCSS(theme);
---

<style set:html={themeCSS}></style>
```

### 4. Use in Components

```astro
<header style="background: rgb(var(--color-header-bg));">
  <h1 style="color: rgb(var(--color-header-text));">
    {siteName}
  </h1>
</header>
```

## Complete Example

```astro
---
// src/layouts/BaseLayout.astro
import { getPodcast, generateThemeCSS, getGoogleFontsURL, defaultTheme } from '@podcast-framework/core';

const podcast = await getPodcast();
const theme = podcast?.theme || defaultTheme;

// Generate CSS
const themeCSS = generateThemeCSS(theme);

// Google Fonts
const fonts = [
  theme.typography.fontFamily,
  theme.typography.headingFont
].filter(Boolean);
const googleFontsURL = getGoogleFontsURL(fonts);
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Google Fonts -->
    {googleFontsURL && (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href={googleFontsURL} rel="stylesheet" />
      </>
    )}

    <!-- Theme CSS -->
    <style set:html={themeCSS}></style>

    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Customization Examples

### Example 1: Dark Theme

```typescript
import { mergeTheme, defaultTheme } from '@podcast-framework/core';

const darkTheme = mergeTheme(defaultTheme, {
  colors: {
    background: '17, 24, 39',     // Dark
    text: '249, 250, 251',        // Light
    headerBg: '0, 0, 0',
    headerText: '255, 255, 255',
    footerBg: '0, 0, 0',
    footerText: '255, 255, 255'
  }
});
```

### Example 2: Brand Colors

```typescript
import { mergeTheme, defaultTheme } from '@podcast-framework/core';

const brandTheme = mergeTheme(defaultTheme, {
  colors: {
    primary: '220, 38, 38',       // Red-600
    secondary: '234, 88, 12',     // Orange-600
    accent: '251, 146, 60'        // Orange-400
  }
});
```

### Example 3: Custom Fonts

```typescript
import { mergeTheme, defaultTheme, getGoogleFontsURL } from '@podcast-framework/core';

const customFontTheme = mergeTheme(defaultTheme, {
  typography: {
    fontFamily: 'Roboto, sans-serif',
    headingFont: 'Montserrat, sans-serif'
  }
});

const fontsURL = getGoogleFontsURL(['Roboto', 'Montserrat']);
// → Load both fonts
```

### Example 4: Layout Variations

```typescript
import { mergeTheme, defaultTheme } from '@podcast-framework/core';

// Rounded corners
const roundedTheme = mergeTheme(defaultTheme, {
  layout: {
    borderRadius: 'rounded-xl',  // More rounded
    spacing: 'normal'
  }
});

// Sharp corners
const sharpTheme = mergeTheme(defaultTheme, {
  layout: {
    borderRadius: 'rounded-none',  // No rounding
    spacing: 'compact'
  }
});
```

## Using Theme Colors

### In Astro Components

```astro
<!-- Solid color -->
<div style="background: rgb(var(--color-primary));">
  Content
</div>

<!-- With opacity -->
<div style="background: rgba(var(--color-primary), 0.1);">
  Subtle background
</div>

<!-- Border -->
<div style="border: 2px solid rgb(var(--color-secondary));">
  Bordered content
</div>
```

### In Tailwind CSS

Configure Tailwind to use theme colors:

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      }
    }
  }
};
```

Then use in classes:

```html
<div class="bg-primary text-white">
  Uses theme primary color
</div>

<div class="bg-primary/10">
  10% opacity primary color
</div>
```

### In CSS Files

```css
.custom-button {
  background: rgb(var(--color-primary));
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}

.custom-button:hover {
  background: rgba(var(--color-primary), 0.9);
}

.custom-card {
  border: 1px solid rgba(var(--color-secondary), 0.2);
  background: rgba(var(--color-background), 1);
}
```

## Advanced Usage

### Theme Preview

```astro
---
import { defaultTheme, generateThemeCSS } from '@podcast-framework/core';

const themes = [
  defaultTheme,
  lightTheme,
  darkTheme,
  brandTheme
];
---

{themes.map((theme, index) => (
  <div class="theme-preview">
    <h3>Theme {index + 1}</h3>
    <div style={generateThemeCSS(theme)}>
      <button style="background: rgb(var(--color-primary));">
        Primary
      </button>
      <button style="background: rgb(var(--color-secondary));">
        Secondary
      </button>
    </div>
  </div>
))}
```

### Dynamic Theme Switching

```astro
<button id="toggle-theme">Toggle Theme</button>

<script>
  import { defaultTheme, darkTheme, generateThemeCSS } from '@podcast-framework/core';

  let isDark = false;

  document.getElementById('toggle-theme')?.addEventListener('click', () => {
    isDark = !isDark;
    const theme = isDark ? darkTheme : defaultTheme;
    const css = generateThemeCSS(theme);

    // Inject new theme CSS
    const styleEl = document.querySelector('style[data-theme]');
    if (styleEl) {
      styleEl.textContent = css;
    }
  });
</script>
```

### Conditional Theming

```astro
---
const isHoliday = checkIfHoliday();
const baseTheme = podcast?.theme || defaultTheme;

const theme = isHoliday
  ? mergeTheme(baseTheme, {
      colors: {
        primary: '220, 38, 38',    // Holiday red
        accent: '34, 197, 94'      // Holiday green
      }
    })
  : baseTheme;
---
```

## Troubleshooting

### Theme colors not applying

Check CSS is injected in `<head>`:

```astro
<head>
  <style set:html={themeCSS}></style>  <!-- Must be in head -->
</head>
```

### Google Fonts not loading

Ensure preconnect links are added:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href={googleFontsURL} rel="stylesheet" />
```

### Invalid RGB values

Check console for warnings:

```
Warning: Invalid RGB value: "256, 0, 0", using fallback: 0, 0, 0
```

Fix in Sanity CMS - RGB values must be 0-255.

### Theme changes not reflecting

Clear build cache:

```bash
rm -rf .astro dist
npm run build
```

## Related

- **[Sanity Theme Configuration](/sanity/theme-configuration/)** - Configure themes in Sanity
- **[Customization](/customization/theming/)** - Theming guide

## Next Steps

- **[Sanity Helpers](/api/sanity-helpers/)** - Fetch podcast and theme
- **[Customization: Theming](/customization/theming/)** - Customize your theme
- **[Sanity: Theme Configuration](/sanity/theme-configuration/)** - Configure in CMS
