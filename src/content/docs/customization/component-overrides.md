---
title: Component Overrides
description: Override framework components with your own implementations
---

# Component Overrides

Customize any framework component by creating your own version with the same name. The framework automatically detects and uses your version.

## How It Works

The framework uses a resolution system that checks your project first:

```
1. Check: src/components/Header.astro (your override)
   ↓ Found? Use it!
   ↓ Not found? Continue...

2. Check: node_modules/@rejected-media/podcast-framework-core/components/Header.astro
   ↓ Use framework version
```

**Result:** Zero configuration, automatic override detection!

## Basic Override

### Step 1: Create Component

Create component in `src/components/` with exact same name:

```
my-podcast/
└── src/
    └── components/
        └── Header.astro  ← Your custom header
```

### Step 2: Implement Component

```astro
---
// src/components/Header.astro
export interface Props {
  siteName: string;
}

const { siteName } = Astro.props;
---

<header class="custom-header">
  <h1>{siteName}</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/episodes">Episodes</a>
  </nav>
</header>

<style>
  .custom-header {
    background: linear-gradient(to right, #667eea, #764ba2);
    color: white;
    padding: 2rem;
  }
</style>
```

### Step 3: Use Component

Framework automatically uses your version:

```astro
---
// In your page
import Header from '@rejected-media/podcast-framework-core/components/Header.astro';
// → Actually loads src/components/Header.astro (your override)
---

<Header siteName="My Podcast" />
```

**No configuration needed!** The component resolver handles it automatically.

## Override Strategies

### Strategy 1: Complete Replacement

Build component from scratch:

```astro
---
// src/components/Header.astro
export interface Props {
  siteName: string;
}

const { siteName } = Astro.props;
---

<header>
  <!-- Your completely custom implementation -->
</header>
```

**When to use:**
- Need fundamentally different functionality
- Want complete control
- Framework component doesn't fit your needs

### Strategy 2: Extend Framework Component

Import and wrap framework component:

```astro
---
// src/components/Header.astro
import FrameworkHeader from '@rejected-media/podcast-framework-core/components/Header.astro';

export interface Props {
  siteName: string;
  showBanner?: boolean;
}

const { showBanner, ...rest } = Astro.props;
---

{showBanner && (
  <div class="banner">
    🎉 New episode every Monday!
  </div>
)}

<FrameworkHeader {...rest} />
```

**When to use:**
- Add features to existing component
- Maintain framework functionality
- Reduce maintenance burden

### Strategy 3: Copy and Modify

Copy framework component and modify:

```bash
# Copy framework component
cp node_modules/@rejected-media/podcast-framework-core/components/Header.astro src/components/

# Modify as needed
code src/components/Header.astro
```

**When to use:**
- Need most of framework functionality
- Want to tweak specific parts
- Comfortable maintaining code

## Examples

### Example 1: Custom Header

```astro
---
// src/components/Header.astro
export interface Props {
  siteName: string;
  navigation?: Array<{ href: string; label: string }>;
}

const { siteName, navigation = [] } = Astro.props;
---

<header class="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
  <div class="container mx-auto px-4 py-6 flex justify-between items-center">
    <a href="/" class="text-2xl font-bold">{siteName}</a>

    <nav class="hidden md:flex gap-6">
      {navigation.map(item => (
        <a
          href={item.href}
          class="hover:text-purple-200 transition"
        >
          {item.label}
        </a>
      ))}
    </nav>

    <!-- Mobile menu (your implementation) -->
  </div>
</header>
```

### Example 2: Footer with Extra Section

```astro
---
// src/components/Footer.astro
import FrameworkFooter from '@rejected-media/podcast-framework-core/components/Footer.astro';

export interface Props {
  siteName: string;
  showSponsors?: boolean;
}

const { showSponsors, ...rest } = Astro.props;
---

<FrameworkFooter {...rest} />

{showSponsors && (
  <div class="bg-gray-100 py-8">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <h3 class="text-xl font-bold mb-4">Our Sponsors</h3>
      <div class="flex justify-center gap-8">
        <img src="/sponsors/logo1.svg" alt="Sponsor 1" />
        <img src="/sponsors/logo2.svg" alt="Sponsor 2" />
      </div>
    </div>
  </div>
)}
```

### Example 3: Newsletter with Custom Success Message

```astro
---
// src/components/NewsletterSignup.astro
import FrameworkNewsletter from '@rejected-media/podcast-framework-core/components/NewsletterSignup.astro';

export interface Props {
  variant?: 'inline' | 'footer';
  customSuccessMessage?: string;
}

const { customSuccessMessage, ...rest } = Astro.props;
---

<FrameworkNewsletter {...rest} />

{customSuccessMessage && (
  <script define:vars={{ customSuccessMessage }}>
    // Override success message
    document.addEventListener('DOMContentLoaded', () => {
      const forms = document.querySelectorAll('.newsletter-form');
      forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          // ... your custom handling
        });
      });
    });
  </script>
)}
```

### Example 4: Episode Search with Analytics

```astro
---
// src/components/EpisodeSearch.astro
import FrameworkSearch from '@rejected-media/podcast-framework-core/components/EpisodeSearch.astro';

export interface Props {
  placeholder?: string;
  trackAnalytics?: boolean;
}

const { trackAnalytics, ...rest } = Astro.props;
---

<FrameworkSearch {...rest} />

{trackAnalytics && (
  <script>
    document.getElementById('episode-search')?.addEventListener('input', (e) => {
      const query = e.target.value;

      if (query && window.gtag) {
        gtag('event', 'search', {
          search_term: query,
          event_category: 'engagement'
        });
      }
    });
  </script>
)}
```

## Maintaining Props Compatibility

When overriding, maintain the same props interface:

```astro
---
// Framework component
export interface Props {
  siteName: string;
  navigation?: NavigationItem[];
}

// Your override - keep same props, add new ones
export interface Props {
  siteName: string;
  navigation?: NavigationItem[];
  customFeature?: boolean;  // Your addition
}
---
```

**Why:** Other components may pass props to your override.

## Testing Overrides

### Check Override is Used

```bash
# Build and check which component is used
npm run build

# Check build output
ls -la node_modules/@rejected-media/podcast-framework-core/components/Header.astro
ls -la src/components/Header.astro

# If src/components/Header.astro exists, it's used ✅
```

### Debug Component Resolution

```astro
---
// Add logging
console.log('Using custom Header override');

import { hasOverride } from '@rejected-media/podcast-framework-core';
console.log('Has override?', hasOverride('Header'));
---
```

## Best Practices

### 1. Start Small

Override progressively:

```
Day 1: Override Header (small change)
       ↓ Test
Day 2: Override Footer (small change)
       ↓ Test
Day 3: Override EpisodeSearch (bigger change)
       ↓ Test thoroughly
```

### 2. Document Changes

Add comments explaining customizations:

```astro
---
/**
 * Custom Header Override
 *
 * Changes from framework:
 * - Gradient background
 * - Custom mobile menu
 * - Added search icon
 */
---
```

### 3. Keep Props Compatible

```astro
---
// ✅ Good - Extends props
export interface Props {
  ...FrameworkProps,
  customProp?: string
}

// ❌ Bad - Removes required props
export interface Props {
  customProp: string  // Missing siteName!
}
---
```

### 4. Test Responsive Behavior

Test overrides on all screen sizes:

```bash
npm run dev

# Test at:
# - 375px (mobile)
# - 768px (tablet)
# - 1024px (desktop)
# - 1440px (large desktop)
```

### 5. Maintain Accessibility

Keep accessibility features:

```astro
<!-- Keep semantic HTML -->
<header>
  <nav aria-label="Main navigation">
    <!-- Navigation -->
  </nav>
</header>

<!-- Keep ARIA labels -->
<button
  aria-label="Toggle menu"
  aria-expanded="false"
>
  Menu
</button>
```

## Removing Overrides

### Return to Framework Version

Simply delete your override:

```bash
rm src/components/Header.astro
```

Framework version is used automatically on next build.

### Temporary Disable

Rename to disable:

```bash
# Disable override
mv src/components/Header.astro src/components/Header.astro.backup

# Re-enable
mv src/components/Header.astro.backup src/components/Header.astro
```

## Advanced Override Patterns

### Conditional Override

Use environment variables:

```astro
---
// src/components/Header.astro
const useBeta = import.meta.env.PUBLIC_USE_BETA_HEADER;

if (!useBeta) {
  // Use framework version
  import FrameworkHeader from '@rejected-media/podcast-framework-core/components/Header.astro';
  export default FrameworkHeader;
}

// Beta header implementation
---
```

### Per-Page Override

Different header for different pages:

```astro
---
// src/pages/special.astro
import CustomHeader from '../components/SpecialHeader.astro';

// Other pages use framework Header automatically
---

<CustomHeader siteName="Special Page" />
```

### Wrapper Component

Wrap framework component for consistent modifications:

```astro
---
// src/components/HeaderWrapper.astro
import Header from '@rejected-media/podcast-framework-core/components/Header.astro';

export interface Props {
  siteName: string;
}

const { ...props } = Astro.props;
---

<div class="header-wrapper">
  <div class="announcement-bar">
    🎉 New episode every Monday!
  </div>
  <Header {...props} />
</div>
```

## Troubleshooting

### Override not being used

**Check 1:** Filename matches exactly
```
✅ Header.astro
❌ header.astro (wrong case)
❌ CustomHeader.astro (wrong name)
```

**Check 2:** Location is correct
```
✅ src/components/Header.astro
❌ src/Header.astro
❌ components/Header.astro
```

**Check 3:** Clear build cache
```bash
rm -rf .astro dist
npm run build
```

### Props don't match

Ensure props interface matches framework:

```typescript
// Framework expects
interface Props {
  siteName: string;
}

// Your override must accept
interface Props {
  siteName: string;  // Required!
  extra?: string;    // Optional additions OK
}
```

### Build errors after override

**Check TypeScript errors:**
```bash
npm run build
# Check error messages
```

**Common issues:**
- Missing props
- Wrong types
- Import errors

## Related

- **[Components](/components/overview/)** - Framework components
- **[Theming](/customization/theming/)** - Theme customization
- **[Custom Components](/customization/custom-components/)** - Build new components

## Next Steps

- **[Theming](/customization/theming/)** - Customize colors and fonts
- **[Custom Components](/customization/custom-components/)** - Build new components
- **[Examples](/examples/custom-components/)** - See examples
