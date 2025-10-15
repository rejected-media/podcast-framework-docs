---
title: Server Services
description: Backend services for contributions and newsletter subscriptions
---

# Server Services

Server Services provide pure business logic for backend functionality like community contributions and newsletter subscriptions. Platform-agnostic and designed for use in API routes.

## Import

```typescript
import {
  ContributionService,
  NewsletterService
} from '@podcast-framework/core';

import type {
  ContributionRequest,
  ContributionResult,
  NewsletterSubscribeRequest,
  NewsletterSubscribeResult
} from '@podcast-framework/core';
```

## Why Use Services?

### Separation of Concerns

Services handle **business logic**, API routes handle **HTTP**:

```typescript
// ❌ Mixed concerns (hard to test, hard to reuse)
export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  // Validation logic
  if (!data.email) return new Response('Invalid', { status: 400 });

  // Business logic
  await saveToSanity(data);
  await sendEmail(data);

  // HTTP response
  return new Response('OK');
};

// ✅ Separated concerns (testable, reusable)
export const POST: APIRoute = async (context) => {
  const data = await request.json();

  const service = new NewsletterService(config);
  const result = await service.subscribe(data);

  return new Response(
    JSON.stringify(result),
    { status: result.success ? 200 : 400 }
  );
};
```

### Platform Agnostic

Services work on **any platform**:

```typescript
// Same service code works on:
// - Cloudflare Pages Functions
// - Netlify Functions
// - Vercel Serverless Functions
// - Node.js Express
// - AWS Lambda
```

## ContributionService

Handle community contributions (episode ideas, guest recommendations, questions, feedback).

### Configuration

```typescript
import { ContributionService } from '@podcast-framework/core';
import type { ContributionServiceConfig } from '@podcast-framework/core';

const config: ContributionServiceConfig = {
  sanityProjectId: 'abc123',
  sanityDataset: 'production',
  sanityApiToken: 'sk...',      // Write token (needed for creating documents)
  sanityApiVersion: '2024-01-01',
  resendApiKey: 're_...',
  resendFromEmail: 'noreply@yourpodcast.com',
  notificationEmail: 'contributions@yourpodcast.com',
  studioUrl: 'https://yourpodcast.com'  // Optional (for email links)
};

const service = new ContributionService(config);
```

### Methods

#### `submitContribution()`

Main handler for contribution submissions.

**Signature:**
```typescript
async submitContribution(
  request: ContributionRequest
): Promise<ContributionResult>
```

**Parameters:**
```typescript
interface ContributionRequest {
  contributionType: "episode-idea" | "guest-recommendation" | "question" | "feedback";
  submitterName?: string;
  submitterEmail?: string;
  website?: string;  // Honeypot

  // Episode idea fields
  episodeTopic?: string;
  episodeDescription?: string;
  episodeRationale?: string;

  // Guest recommendation fields
  guestName?: string;
  guestBackground?: string;
  guestRationale?: string;
  guestContact?: string;

  // Question fields
  question?: string;
  questionContext?: string;

  // Feedback fields
  feedbackType?: "feedback" | "suggestion" | "bug";
  feedbackContent?: string;
}
```

**Returns:**
```typescript
interface ContributionResult {
  success: boolean;
  message: string;
  contributionId?: string;
  error?: string;
}
```

**Example:**
```typescript
// src/pages/api/contribute.ts
import type { APIRoute } from 'astro';
import { ContributionService, getRequiredEnv } from '@podcast-framework/core';

export const POST: APIRoute = async (context) => {
  const env = getRequiredEnv([
    'PUBLIC_SANITY_PROJECT_ID',
    'PUBLIC_SANITY_DATASET',
    'SANITY_API_TOKEN',
    'RESEND_API_KEY',
    'NOTIFICATION_EMAIL'
  ], context);

  const service = new ContributionService({
    sanityProjectId: env.PUBLIC_SANITY_PROJECT_ID,
    sanityDataset: env.PUBLIC_SANITY_DATASET,
    sanityApiToken: env.SANITY_API_TOKEN,
    resendApiKey: env.RESEND_API_KEY,
    resendFromEmail: 'noreply@yourpodcast.com',
    notificationEmail: env.NOTIFICATION_EMAIL
  });

  const requestData = await context.request.json();
  const result = await service.submitContribution(requestData);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### Features

**Validation:**
- Required field validation
- Email format validation
- Field length limits
- Type-specific validation

**Spam Protection:**
- Honeypot detection
- Silently accepts bot submissions

**Data Persistence:**
- Saves to Sanity CMS
- Returns contribution ID

**Email Notifications:**
- Sends formatted email via Resend
- Includes all contribution details
- Link to view in Sanity Studio

## NewsletterService

Handle newsletter subscriptions via ConvertKit.

### Configuration

```typescript
import { NewsletterService } from '@podcast-framework/core';
import type { NewsletterServiceConfig } from '@podcast-framework/core';

const config: NewsletterServiceConfig = {
  sanityProjectId: 'abc123',
  sanityDataset: 'production',
  sanityApiVersion: '2024-01-01'
};

const service = new NewsletterService(config);
```

### Methods

#### `subscribe()`

Main handler for newsletter subscriptions.

**Signature:**
```typescript
async subscribe(
  request: NewsletterSubscribeRequest
): Promise<NewsletterSubscribeResult>
```

**Parameters:**
```typescript
interface NewsletterSubscribeRequest {
  email: string;
  website?: string;  // Honeypot
}
```

**Returns:**
```typescript
interface NewsletterSubscribeResult {
  success: boolean;
  message: string;
  error?: string;
}
```

**Example:**
```typescript
// src/pages/api/newsletter-subscribe.ts
import type { APIRoute } from 'astro';
import { NewsletterService, getRequiredEnv } from '@podcast-framework/core';

export const POST: APIRoute = async (context) => {
  const env = getRequiredEnv([
    'PUBLIC_SANITY_PROJECT_ID',
    'PUBLIC_SANITY_DATASET'
  ], context);

  const service = new NewsletterService({
    sanityProjectId: env.PUBLIC_SANITY_PROJECT_ID,
    sanityDataset: env.PUBLIC_SANITY_DATASET
  });

  const requestData = await context.request.json();
  const result = await service.subscribe(requestData);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### Features

**Validation:**
- Email format validation
- Podcast config validation
- ConvertKit credentials check

**Business Rules:**
- Only active podcasts accept signups
- Newsletter must be enabled in CMS
- ConvertKit must be configured

**Spam Protection:**
- Honeypot detection
- Silently accepts bot submissions

**ConvertKit Integration:**
- Subscribes to ConvertKit form
- Handles API errors gracefully
- Returns user-friendly messages

**Caching:**
- Caches podcast config for 5 minutes
- Reduces Sanity API calls

## Complete API Route Examples

### Contribution Handler

```typescript
// src/pages/api/contribute.ts
import type { APIRoute } from 'astro';
import {
  ContributionService,
  getRequiredEnv,
  getClientIP,
  logError
} from '@podcast-framework/core';

export const POST: APIRoute = async (context) => {
  try {
    // Get environment variables
    const env = getRequiredEnv([
      'PUBLIC_SANITY_PROJECT_ID',
      'PUBLIC_SANITY_DATASET',
      'SANITY_API_TOKEN',
      'RESEND_API_KEY',
      'NOTIFICATION_EMAIL'
    ], context);

    // Create service
    const service = new ContributionService({
      sanityProjectId: env.PUBLIC_SANITY_PROJECT_ID,
      sanityDataset: env.PUBLIC_SANITY_DATASET,
      sanityApiToken: env.SANITY_API_TOKEN,
      resendApiKey: env.RESEND_API_KEY,
      resendFromEmail: 'noreply@yourpodcast.com',
      notificationEmail: env.NOTIFICATION_EMAIL,
      studioUrl: 'https://yourpodcast.com'
    });

    // Get request data
    const requestData = await context.request.json();

    // Process contribution
    const result = await service.submitContribution(requestData);

    // Log success
    if (result.success) {
      console.log('Contribution received:', result.contributionId);
    }

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    logError(error, {
      tags: { endpoint: 'contribute' },
      extra: { ip: getClientIP(context) }
    }, context);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error'
      }),
      { status: 500 }
    );
  }
};
```

### Newsletter Handler

```typescript
// src/pages/api/newsletter-subscribe.ts
import type { APIRoute } from 'astro';
import {
  NewsletterService,
  getRequiredEnv,
  getClientIP,
  logError
} from '@podcast-framework/core';

export const POST: APIRoute = async (context) => {
  try {
    const env = getRequiredEnv([
      'PUBLIC_SANITY_PROJECT_ID',
      'PUBLIC_SANITY_DATASET'
    ], context);

    const service = new NewsletterService({
      sanityProjectId: env.PUBLIC_SANITY_PROJECT_ID,
      sanityDataset: env.PUBLIC_SANITY_DATASET
    });

    const requestData = await context.request.json();
    const result = await service.subscribe(requestData);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    logError(error, {
      tags: { endpoint: 'newsletter-subscribe' },
      extra: { ip: getClientIP(context) }
    }, context);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error'
      }),
      { status: 500 }
    );
  }
};
```

## Testing Services

Services are pure business logic and easy to test:

```typescript
import { describe, test, expect } from 'vitest';
import { NewsletterService } from '@podcast-framework/core';

describe('NewsletterService', () => {
  test('validates email format', () => {
    const service = new NewsletterService(config);

    expect(service.validateEmail('valid@email.com')).toBe(true);
    expect(service.validateEmail('invalid-email')).toBe(false);
    expect(service.validateEmail('')).toBe(false);
  });

  test('detects spam bots', () => {
    const service = new NewsletterService(config);

    expect(service.isSpamBot('')).toBe(false);
    expect(service.isSpamBot(undefined)).toBe(false);
    expect(service.isSpamBot('http://spam.com')).toBe(true);
  });

  test('subscribes to ConvertKit', async () => {
    const service = new NewsletterService(config);

    const result = await service.subscribe({
      email: 'test@example.com'
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain('subscription');
  });
});
```

## Error Handling

Services return structured error responses:

```typescript
// Validation error
{
  success: false,
  message: "Please provide a valid email address."
}

// Configuration error
{
  success: false,
  message: "Newsletter configuration error."
}

// API error
{
  success: false,
  message: "Unable to process subscription. Please try again later.",
  error: "ConvertKit API returned 500"
}

// Success
{
  success: true,
  message: "Success! Check your email to confirm your subscription.",
  contributionId: "contribution-123"  // For ContributionService
}
```

## Customization

### Extend Services

```typescript
// src/lib/custom-contribution-service.ts
import { ContributionService } from '@podcast-framework/core';

export class CustomContributionService extends ContributionService {
  async submitContribution(request: ContributionRequest) {
    // Add custom validation
    if (request.episodeTopic?.includes('spam')) {
      return {
        success: false,
        message: 'Invalid topic'
      };
    }

    // Call parent method
    const result = await super.submitContribution(request);

    // Add custom post-processing
    if (result.success) {
      await this.notifySlack(request);
    }

    return result;
  }

  async notifySlack(request: ContributionRequest) {
    // Send Slack notification
  }
}
```

### Custom Email Templates

```typescript
// Override email generation
class CustomContributionService extends ContributionService {
  generateEmailContent(request: ContributionRequest): string {
    return `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h1>New Contribution</h1>
          <p><strong>Type:</strong> ${request.contributionType}</p>
          <p><strong>Content:</strong> ${request.episodeTopic || request.question}</p>
        </body>
      </html>
    `;
  }
}
```

## Troubleshooting

### "Missing required environment variables"

Check `.env` file:

```bash
# Contribution Service
PUBLIC_SANITY_PROJECT_ID="abc123"
PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="sk..."
RESEND_API_KEY="re_..."
NOTIFICATION_EMAIL="you@example.com"

# Newsletter Service
PUBLIC_SANITY_PROJECT_ID="abc123"
PUBLIC_SANITY_DATASET="production"
# ConvertKit credentials come from Sanity podcast document
```

### ConvertKit API errors

Check credentials in Sanity:

1. Open Sanity Studio
2. Go to Podcast document
3. Verify:
   - `isActive` = true
   - `newsletterEnabled` = true
   - `convertKitApiKey` = your API secret
   - `convertKitFormId` = your form ID

### Resend emails not sending

Check API key and from email:

```typescript
// Test Resend directly
const resend = new Resend('re_...');
const result = await resend.emails.send({
  from: 'noreply@yourpodcast.com',  // Must be verified domain
  to: 'test@example.com',
  subject: 'Test',
  html: '<p>Test</p>'
});
```

### Contributions not saving to Sanity

Check API token has write permissions:

```bash
# In Sanity dashboard
# Settings → API → Tokens → Create new token
# Permissions: Editor (read + write)
```

## Security

### Input Validation

Services validate all inputs:

```typescript
// Email validation
validateEmail('invalid-email')  // → false

// Field length validation
validateFieldLength('x'.repeat(1000), 'topic', 100)
// → "Topic must be under 100 characters (currently 1000)"

// Required field validation
validateRequiredFields({ contributionType: 'episode-idea' })
// → "Please provide an episode topic for your idea."
```

### XSS Prevention

All user input is escaped before use in emails:

```typescript
escapeHTML('<script>alert("xss")</script>')
// → "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### Spam Protection

Honeypot field detects bots:

```typescript
isSpamBot('http://spam-site.com')  // → true (bot detected)
isSpamBot('')                       // → false (human)
isSpamBot(undefined)                // → false (human)

// Bots get fake success (doesn't reveal honeypot)
if (isSpamBot(request.website)) {
  return { success: true, message: "Success" };
}
```

## Related

- **[Hosting Adapter](/api/hosting-adapter/)** - Platform abstraction
- **[Newsletter Component](/components/newsletter-signup/)** - Frontend component
- **[Deployment](/deployment/environment-variables/)** - Production configuration

## Next Steps

- **[Deployment](/deployment/cloudflare-pages/)** - Deploy API routes
- **[Environment Variables](/deployment/environment-variables/)** - Configure services
- **[Sanity Setup](/sanity/setup/)** - Configure Sanity for services
