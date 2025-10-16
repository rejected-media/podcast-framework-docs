---
title: Newsletter Signup Component
description: Email subscription form with spam protection and accessible controls
---

# Newsletter Signup Component

The NewsletterSignup component provides an email subscription form with two visual variants, honeypot spam protection, and full accessibility support.

## Features

- ✅ Two visual variants (inline, footer)
- ✅ Honeypot spam protection
- ✅ Accessible form controls (ARIA labels, keyboard navigation)
- ✅ Real-time validation
- ✅ Success/error states
- ✅ Mobile responsive
- ✅ API integration with `/api/newsletter-subscribe`

## Basic Usage

```astro
---
import NewsletterSignup from '@rejected-media/podcast-framework-core/components/NewsletterSignup.astro';
---

<NewsletterSignup />
```

This creates an inline newsletter signup form with default styling.

## Props

### Optional Props

#### `variant`

**Type:** `'inline' | 'footer'`
**Default:** `'inline'`

Visual variant of the newsletter form.

**Variants:**
- **`inline`** - Centered, standalone form (max-width: 500px)
- **`footer`** - Footer-optimized layout (max-width: 500px, left-aligned)

```astro
<!-- Inline variant (default) -->
<NewsletterSignup variant="inline" />

<!-- Footer variant -->
<NewsletterSignup variant="footer" />
```

#### `placeholder`

**Type:** `string`
**Default:** `"Your email address"`

Email input placeholder text.

```astro
<NewsletterSignup placeholder="Enter your email..." />
```

#### `buttonText`

**Type:** `string`
**Default:** `"Subscribe"`

Submit button text.

```astro
<NewsletterSignup buttonText="Sign Up" />
```

## Complete Example

```astro
---
import NewsletterSignup from '@rejected-media/podcast-framework-core/components/NewsletterSignup.astro';
---

<div class="bg-blue-50 rounded-lg p-8 text-center">
  <h2 class="text-2xl font-bold mb-3">Never Miss an Episode</h2>
  <p class="text-gray-600 mb-6">
    Get weekly episodes delivered to your inbox
  </p>

  <NewsletterSignup
    variant="inline"
    placeholder="your@email.com"
    buttonText="Subscribe Now"
  />
</div>
```

## Visual Variants

### Inline Variant

Best for dedicated sections or call-to-action areas:

```astro
<section class="py-12 bg-gray-100">
  <div class="max-w-2xl mx-auto px-4 text-center">
    <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
    <p class="text-lg text-gray-600 mb-8">
      Join our community and get notified about new episodes
    </p>
    <NewsletterSignup variant="inline" />
  </div>
</section>
```

### Footer Variant

Designed for use in the Footer component:

```astro
<Footer
  siteName="My Podcast"
  showNewsletter={true}
>
  <NewsletterSignup
    slot="newsletter"
    variant="footer"
    placeholder="your@email.com"
  />
</Footer>
```

## Spam Protection

The component includes a **honeypot field** to prevent bot submissions:

```html
<!-- Hidden from users, but visible to bots -->
<input
  type="text"
  name="website"
  style="display:none"
  tabindex="-1"
  aria-hidden="true"
  autocomplete="off"
/>
```

**How it works:**
- Hidden from human users (display: none)
- Bots often fill all fields, including hidden ones
- If `website` field has a value, submission is silently rejected
- Bot thinks it succeeded (prevents revealing the honeypot)

## Form States

The component handles three states:

### 1. Default State

```
┌─────────────────────────────────┐
│  [email@example.com] [Subscribe]│
└─────────────────────────────────┘
```

### 2. Submitting State

```
┌─────────────────────────────────┐
│  [email@example.com] [Subscribing...]│
└─────────────────────────────────┘
(Button disabled)
```

### 3. Success State

```
┌─────────────────────────────────┐
│  Thanks for subscribing! ✓       │
└─────────────────────────────────┘
(Form hidden, success message shown)
```

### 4. Error State

```
┌─────────────────────────────────┐
│  [email@example.com] [Subscribe]│
│  ⚠ Something went wrong...       │
└─────────────────────────────────┘
```

## API Integration

The component submits to `/api/newsletter-subscribe`:

```javascript
// POST /api/newsletter-subscribe
{
  "email": "user@example.com"
}

// Response (success)
{
  "message": "Thanks for subscribing!",
  "success": true
}

// Response (error)
{
  "message": "Email already subscribed",
  "success": false
}
```

**Implementation:**
```typescript
// src/pages/api/newsletter-subscribe.ts
import type { APIRoute } from 'astro';
import { NewsletterService } from '@rejected-media/podcast-framework-core';

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json();

  const service = new NewsletterService({
    apiKey: import.meta.env.CONVERTKIT_API_KEY,
    formId: import.meta.env.CONVERTKIT_FORM_ID
  });

  const result = await service.subscribe(email);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

## Styling

### CSS Custom Properties

The component uses theme variables:

```css
--color-primary    /* Button background */
```

### Custom Styles

Override with CSS:

```astro
<NewsletterSignup />

<style>
  .newsletter-signup input[type="email"] {
    border-color: #3b82f6;
  }

  .newsletter-signup button {
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
  }
</style>
```

## Accessibility

### ARIA Labels

```html
<label for="email-inline" class="sr-only">
  Email address
</label>
<input
  type="email"
  id="email-inline"
  aria-required="true"
  aria-describedby="newsletter-status-inline"
/>
<div
  id="newsletter-status-inline"
  role="status"
  aria-live="polite"
></div>
```

### Keyboard Navigation

- **Tab** - Focus email input
- **Tab** - Focus submit button
- **Enter** - Submit form (from either input or button)

### Screen Readers

- Input has descriptive label (visually hidden)
- Status updates announced via `aria-live="polite"`
- Required field indicated with `aria-required="true"`

## Responsive Design

### Desktop

```
┌────────────────────────────────────────┐
│  [email@example.com...] [Subscribe]    │
└────────────────────────────────────────┘
```

### Mobile (< 640px)

```
┌────────────────────────┐
│ [email@example.com...] │
├────────────────────────┤
│     [Subscribe]        │
└────────────────────────┘
```

Inputs stack vertically on mobile for better usability.

## Performance

- **Bundle Size:** ~2 KB (including validation logic)
- **JavaScript:** Required for form submission
- **CSS:** Inline, scoped styles
- **Network:** Single API call on submit

## Error Handling

The component handles multiple error scenarios:

```javascript
// Network error
catch (error) {
  statusDiv.textContent = 'Network error. Please check your connection and try again.';
  statusDiv.className = 'newsletter-status error';
}

// Server error
if (!response.ok) {
  const data = await response.json();
  statusDiv.textContent = data.message || 'Something went wrong. Please try again.';
  statusDiv.className = 'newsletter-status error';
}

// Honeypot triggered (bot detected)
if (website) {
  // Silently succeed to not reveal honeypot
  statusDiv.textContent = 'Thanks for subscribing!';
  statusDiv.className = 'newsletter-status success';
}
```

## Customization Examples

### Example 1: Custom Colors

```astro
<NewsletterSignup />

<style is:global>
  .newsletter-signup input[type="email"]:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .newsletter-signup button {
    background: #10b981;
  }

  .newsletter-signup button:hover {
    background: #059669;
  }
</style>
```

### Example 2: With Analytics Tracking

```astro
<NewsletterSignup />

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.newsletter-form');

    form?.addEventListener('submit', (e) => {
      // Track newsletter signups
      if (window.gtag) {
        gtag('event', 'newsletter_signup', {
          event_category: 'engagement',
          event_label: 'newsletter_form'
        });
      }
    });
  });
</script>
```

### Example 3: Multi-step Form

```astro
---
// Show signup after user reads 3 episodes
const shouldShowNewsletter = checkUserEngagement();
---

{shouldShowNewsletter && (
  <div class="fixed bottom-4 right-4 bg-white shadow-2xl rounded-lg p-6 max-w-md">
    <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
      ×
    </button>
    <h3 class="text-xl font-bold mb-2">Enjoying the show?</h3>
    <p class="text-gray-600 mb-4">Get episodes delivered to your inbox</p>
    <NewsletterSignup variant="inline" />
  </div>
)}
```

## Troubleshooting

### Form not submitting

Check that the API route exists:

```bash
# Should exist
src/pages/api/newsletter-subscribe.ts
```

### Endpoint returns 404

Verify the endpoint path in the component matches your API route:

```javascript
// Component expects:
fetch('/api/newsletter-subscribe', { ... })

// API route should be at:
src/pages/api/newsletter-subscribe.ts
```

### ConvertKit integration not working

Check environment variables:

```bash
# .env
CONVERTKIT_API_KEY="your-api-key"
CONVERTKIT_FORM_ID="your-form-id"
```

### Honeypot incorrectly triggered

Ensure the honeypot field is properly hidden:

```html
<input
  type="text"
  name="website"
  style="display:none"    <!-- Must be display:none -->
  tabindex="-1"
  autocomplete="off"
/>
```

## Related Components

- **[Footer](/components/footer/)** - Uses NewsletterSignup in newsletter slot
- **[Server Services](/api/server-services/)** - NewsletterService for ConvertKit integration

## Next Steps

- **[Server Services](/api/server-services/)** - Set up NewsletterService
- **[Configuration](/getting-started/configuration/)** - Configure ConvertKit
- **[Deployment](/deployment/environment-variables/)** - Set production env vars
