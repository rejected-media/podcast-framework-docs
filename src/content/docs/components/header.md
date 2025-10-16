---
title: Header Component
description: Main navigation header with logo, site name, and responsive mobile menu
---

# Header Component

The Header component provides a responsive navigation header with logo support, site branding, and a mobile-friendly menu.

## Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Mobile menu with hamburger toggle
- ✅ Logo support (image or auto-generated initials)
- ✅ Customizable navigation items
- ✅ Theme-aware styling
- ✅ Accessible (ARIA labels, keyboard navigation)
- ✅ Zero-config defaults

## Basic Usage

```astro
---
import Header from '@rejected-media/podcast-framework-core/components/Header.astro';
---

<Header siteName="My Podcast" />
```

This creates a header with:
- Site name "My Podcast"
- Auto-generated logo (initials)
- Default navigation (Home, Episodes, Guests, About)

## Props

### Required Props

#### `siteName`

**Type:** `string`
**Required:** Yes

The name of your podcast, displayed in the header.

```astro
<Header siteName="Strange Water" />
```

### Optional Props

#### `siteTagline`

**Type:** `string`
**Default:** `undefined`

A tagline displayed below the site name.

```astro
<Header
  siteName="Strange Water"
  siteTagline="Ethereum's podcast"
/>
```

#### `logoUrl`

**Type:** `string`
**Default:** `undefined`

URL to your podcast logo. If not provided, auto-generates initials from `siteName`.

```astro
<Header
  siteName="My Podcast"
  logoUrl="/logo.png"
/>
```

#### `navigation`

**Type:** `NavigationItem[]`
**Default:** `[Home, Episodes, Guests, About]`

Array of navigation items.

**NavigationItem Interface:**
```typescript
interface NavigationItem {
  href: string;
  label: string;
  show?: boolean; // Optional conditional rendering
}
```

**Example:**
```astro
<Header
  siteName="My Podcast"
  navigation={[
    { href: '/', label: 'Home' },
    { href: '/episodes', label: 'Episodes' },
    { href: '/guests', label: 'Guests' },
    { href: '/about', label: 'About' },
    { href: '/contribute', label: 'Contribute', show: podcast?.isActive }
  ]}
/>
```

#### `theme`

**Type:** `Theme`
**Default:** `defaultTheme`

Theme object controlling colors, fonts, and layout.

```astro
---
import { getPodcast } from '@rejected-media/podcast-framework-core';

const podcast = await getPodcast();
---

<Header
  siteName={podcast?.name}
  theme={podcast?.theme}
/>
```

## Complete Example

```astro
---
import Header from '@rejected-media/podcast-framework-core/components/Header.astro';
import { getPodcast } from '@rejected-media/podcast-framework-core';

const podcast = await getPodcast();

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/episodes', label: 'Episodes' },
  { href: '/guests', label: 'Guests' },
  { href: '/about', label: 'About' },
  {
    href: '/contribute',
    label: 'Contribute',
    show: podcast?.isActive
  }
];
---

<Header
  siteName={podcast?.name || "My Podcast"}
  siteTagline={podcast?.tagline}
  logoUrl={podcast?.logo?.url}
  navigation={navigation}
  theme={podcast?.theme}
/>
```

## Responsive Behavior

### Desktop (≥ 768px)

- Full horizontal navigation
- Logo and site name on left
- Navigation links on right
- Hover states on links

### Mobile (< 768px)

- Hamburger menu button
- Collapsible mobile menu
- Stacked navigation links
- Touch-friendly targets

## Styling

### Theme Variables

The Header uses CSS custom properties from your theme:

```css
--color-header-bg     /* Header background color */
--color-header-text   /* Header text color */
--color-primary       /* Logo/accent color */
--color-secondary     /* Navigation link color */
```

### Custom Styles

Override styles with CSS:

```astro
<Header siteName="My Podcast" />

<style>
  header {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style>
```

### Tailwind Classes

The header uses Tailwind classes. Customize via `tailwind.config.mjs`:

```javascript
theme: {
  extend: {
    colors: {
      'header-bg': '#1a1a1a',
      'header-text': '#ffffff',
    }
  }
}
```

## Customization Examples

### Example 1: Simple Custom Navigation

```astro
<Header
  siteName="Dev Podcast"
  navigation={[
    { href: '/', label: 'Home' },
    { href: '/episodes', label: 'Listen' },
    { href: '/sponsors', label: 'Sponsors' },
    { href: '/contact', label: 'Contact' }
  ]}
/>
```

### Example 2: Conditional Navigation

```astro
---
const podcast = await getPodcast();
const isActive = podcast?.isActive;
---

<Header
  siteName={podcast?.name}
  navigation={[
    { href: '/', label: 'Home' },
    { href: '/episodes', label: 'Episodes' },
    { href: '/contribute', label: 'Contribute', show: isActive },
    { href: '/about', label: 'About' }
  ]}
/>
```

### Example 3: With Logo and Tagline

```astro
<Header
  siteName="Tech Talk"
  siteTagline="Weekly conversations with innovators"
  logoUrl="/images/logo.svg"
  navigation={[
    { href: '/', label: 'Home' },
    { href: '/episodes', label: 'Episodes' },
    { href: '/blog', label: 'Blog' }
  ]}
/>
```

## Override Component

Create your own header at `src/components/Header.astro`:

### Minimal Override

```astro
---
export interface Props {
  siteName: string;
}

const { siteName } = Astro.props;
---

<header class="bg-black text-white p-4">
  <nav class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-2xl font-bold">{siteName}</a>
    <div class="flex gap-6">
      <a href="/episodes">Episodes</a>
      <a href="/about">About</a>
    </div>
  </nav>
</header>
```

### Extended Override

```astro
---
// Extend framework component
import FrameworkHeader from '@rejected-media/podcast-framework-core/components/Header.astro';

export interface Props {
  siteName: string;
  showBanner?: boolean;
}

const { showBanner, ...rest } = Astro.props;
---

{showBanner && (
  <div class="bg-blue-500 text-white text-center py-2">
    🎉 New episode every Monday!
  </div>
)}

<FrameworkHeader {...rest} />
```

## Accessibility

The Header component follows WCAG 2.1 AA standards:

### Semantic HTML

```html
<header>
  <nav>
    <a href="/">...</a>
  </nav>
</header>
```

### ARIA Labels

```html
<button
  id="mobile-menu-button"
  aria-label="Toggle mobile menu"
  aria-expanded="false"
>
  Menu
</button>
```

### Keyboard Navigation

- **Tab** - Navigate through links
- **Enter/Space** - Activate link or toggle menu
- **Escape** - Close mobile menu (when open)

### Screen Readers

- Navigation landmarks
- Descriptive link text
- Menu state announcements

## Performance

- **Bundle Size:** ~1 KB (including mobile menu script)
- **JavaScript:** Only for mobile menu toggle
- **CSS:** Inline with component
- **Render:** Static at build time

## Mobile Menu

The mobile menu uses vanilla JavaScript for toggle functionality:

```javascript
// Toggles on button click
// Closes when link is clicked
// Updates ARIA states
// Shows/hides menu and icons
```

**No dependencies** - Pure JavaScript, works everywhere.

## Troubleshooting

### Logo not showing

Check the logo URL is accessible:

```astro
---
const logoUrl = "/logo.png"; // Must exist in public/
---

<Header logoUrl={logoUrl} />
```

### Navigation not rendering

Check navigation array structure:

```astro
---
const navigation = [
  { href: '/', label: 'Home' }, // ✅ Correct
  { url: '/', text: 'Home' },   // ❌ Wrong props
];
---
```

### Mobile menu not working

Ensure the `<script>` tag is included. If you override the component, copy the mobile menu script.

### Theme colors not applying

Check theme is passed to component:

```astro
---
const podcast = await getPodcast();
---

<Header
  siteName={podcast?.name}
  theme={podcast?.theme} // ✅ Pass theme
/>
```

## Related Components

- **[Footer](/components/footer/)** - Companion footer component

## Next Steps

- **[Footer Component](/components/footer/)** - Add a footer
- **[Component Overrides](/customization/component-overrides/)** - Customize the header
- **[Theming](/customization/theming/)** - Customize colors and fonts
