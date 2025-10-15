---
title: Custom Domains
description: Set up custom domains for your podcast website
---

# Custom Domains

Configure custom domains for your podcast website on Cloudflare Pages, Netlify, or Vercel.

## Cloudflare Pages

### Step 1: Add Domain

1. Cloudflare Pages → Your project
2. Click **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Enter domain: `yourpodcast.com` or `www.yourpodcast.com`
5. Click **"Continue"**

### Step 2: Configure DNS

**If domain is on Cloudflare DNS:**
- DNS configured automatically ✅
- CNAME record added automatically

**If domain is elsewhere:**

Add CNAME record at your DNS provider:

```
Type: CNAME
Name: @ (for root domain) or www (for subdomain)
Value: your-project.pages.dev
TTL: Auto or 3600
```

**For apex domain (no www):**

Some DNS providers require:
```
Type: CNAME
Name: @
Value: your-project.pages.dev
Proxy: Enabled (if supported)
```

Or use ALIAS/ANAME record (if supported):
```
Type: ALIAS
Name: @
Value: your-project.pages.dev
```

### Step 3: SSL Certificate

Cloudflare provisions SSL automatically (5-10 minutes):

**Check status:**
```
⏳ Pending validation
⏳ Pending certificate
✅ Active
```

**Force HTTPS:**
1. Custom domains → Domain → **"Always use HTTPS"** → ON

### Step 4: Update Site URL

Update environment variable:

```bash
PUBLIC_SITE_URL="https://yourpodcast.com"
```

**In Cloudflare dashboard:**
1. Settings → Environment variables
2. Edit `PUBLIC_SITE_URL`
3. Change to your custom domain
4. Save
5. Trigger rebuild

### Step 5: Redirect www

Redirect www → non-www (or vice versa):

**Create Page Rule:**
1. Cloudflare Dashboard → Your domain
2. Rules → Page Rules
3. Add rule:
   ```
   URL: www.yourpodcast.com/*
   Setting: Forwarding URL (301 - Permanent Redirect)
   Destination: https://yourpodcast.com/$1
   ```

Or use `_redirects` file:

```
# public/_redirects
https://www.yourpodcast.com/* https://yourpodcast.com/:splat 301
```

## Netlify

### Step 1: Add Domain

1. Site settings → **Domain management**
2. Click **"Add custom domain"**
3. Enter domain: `yourpodcast.com`
4. Click **"Verify"**

### Step 2: Configure DNS

**If domain is on Netlify DNS:**
- Configured automatically ✅

**If domain is elsewhere:**

Add records:

```
# Root domain
Type: A
Name: @
Value: 75.2.60.5 (Netlify's load balancer)

# www subdomain
Type: CNAME
Name: www
Value: your-site.netlify.app
```

**Or use CNAME (if supported):**
```
Type: ALIAS/ANAME
Name: @
Value: your-site.netlify.app
```

### Step 3: HTTPS

Netlify provisions SSL automatically via Let's Encrypt.

**Enable HTTPS:**
1. Domain settings → HTTPS
2. Toggle **"Force HTTPS"** → ON

### Step 4: Update Site URL

```bash
# In Netlify dashboard
PUBLIC_SITE_URL="https://yourpodcast.com"
```

## Vercel

### Step 1: Add Domain

1. Project → **Settings** → **Domains**
2. Enter domain: `yourpodcast.com`
3. Click **"Add"**

### Step 2: Configure DNS

Add records at your DNS provider:

```
# Root domain
Type: A
Name: @
Value: 76.76.21.21 (Vercel)

# www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Verify Domain

1. Vercel checks DNS records
2. Wait for verification (5-10 minutes)
3. Status changes to **"Valid"**

### Step 4: SSL

Vercel provisions SSL automatically.

### Step 5: Update Site URL

```bash
# In Vercel dashboard
PUBLIC_SITE_URL="https://yourpodcast.com"
```

## DNS Records Explained

### CNAME Record

Points domain to another domain:

```
yourpodcast.com → your-project.pages.dev
```

**Pros:**
- Simple setup
- Automatic updates

**Cons:**
- Some providers don't support CNAME for root domain

### A Record

Points domain to IP address:

```
yourpodcast.com → 75.2.60.5
```

**Pros:**
- Universally supported
- Works for root domain

**Cons:**
- IP address might change (rare)

### ALIAS/ANAME Record

Like CNAME but works for root domain:

```
yourpodcast.com → your-project.pages.dev
```

**Pros:**
- Works for root domain
- Automatic updates

**Cons:**
- Not all DNS providers support

## Subdomain vs Root Domain

### Root Domain (Apex)

```
yourpodcast.com
```

**Pros:**
- Shorter URL
- More professional

**Cons:**
- Requires ALIAS/ANAME support (or A record)

### Subdomain

```
www.yourpodcast.com
podcast.yourdomain.com
```

**Pros:**
- Easy CNAME setup
- Universally supported

**Cons:**
- Slightly longer URL

### Recommendation

Use both:
```
yourpodcast.com (primary)
www.yourpodcast.com (redirects to primary)
```

## Domain Verification

### Verify Ownership

Platforms verify you own the domain:

**Cloudflare:** Automatic (if using Cloudflare DNS)

**Netlify:** Add TXT record:
```
Type: TXT
Name: _netlify
Value: [verification token]
```

**Vercel:** Add TXT record:
```
Type: TXT
Name: _vercel
Value: [verification token]
```

### Check Propagation

DNS changes take time to propagate:

**Check DNS:**
```bash
# Check A record
dig yourpodcast.com

# Check CNAME record
dig www.yourpodcast.com

# Check from specific DNS server
dig @8.8.8.8 yourpodcast.com
```

**Online tools:**
- [dnschecker.org](https://dnschecker.org/)
- [whatsmydns.net](https://whatsmydns.net/)

**Propagation time:**
- Minimum: 5 minutes
- Typical: 30 minutes - 2 hours
- Maximum: 48 hours

## SSL/HTTPS

### Automatic SSL

All platforms provision SSL automatically:

- **Cloudflare:** Universal SSL (instant)
- **Netlify:** Let's Encrypt (5-10 minutes)
- **Vercel:** Let's Encrypt (5-10 minutes)

### Force HTTPS

Redirect HTTP → HTTPS:

**Cloudflare:**
- SSL/TLS → Edge Certificates → Always Use HTTPS → ON

**Netlify:**
- Domain settings → HTTPS → Force HTTPS → ON

**Vercel:**
- Automatic (no configuration needed)

### Certificate Renewal

Automatically renewed before expiration:

- Let's Encrypt: 90-day certificates, auto-renewed at 60 days
- Cloudflare: Auto-renewed

## Multiple Domains

### Add Secondary Domains

Point multiple domains to same site:

```
yourpodcast.com → Main site
yourpodcast.net → Redirects to .com
yourpodcast.org → Redirects to .com
```

**Setup redirects:**

**Cloudflare:**
```
# public/_redirects
https://yourpodcast.net/* https://yourpodcast.com/:splat 301
https://yourpodcast.org/* https://yourpodcast.com/:splat 301
```

**Netlify:**
```toml
# netlify.toml
[[redirects]]
  from = "https://yourpodcast.net/*"
  to = "https://yourpodcast.com/:splat"
  status = 301
  force = true
```

### Branch Domains

Deploy branches to subdomains:

```
main branch → yourpodcast.com
staging branch → staging.yourpodcast.com
dev branch → dev.yourpodcast.com
```

## Troubleshooting

### Domain shows "Site not found"

**Check 1:** DNS records are correct
```bash
dig yourpodcast.com  # Should show CNAME or A record
```

**Check 2:** Domain is added in platform dashboard

**Check 3:** DNS has propagated (wait 30 min - 2 hours)

### SSL certificate pending

**Check 1:** DNS points to platform
```bash
dig yourpodcast.com
# Should show platform's IP/CNAME
```

**Check 2:** No CAA records blocking Let's Encrypt
```bash
dig CAA yourpodcast.com
# Should be empty or include letsencrypt.org
```

**Check 3:** Wait longer (can take up to 24 hours)

### www not redirecting

**Add redirect:**

**Cloudflare:**
```
# public/_redirects
https://www.yourpodcast.com/* https://yourpodcast.com/:splat 301
```

**Netlify:**
```toml
# netlify.toml
[[redirects]]
  from = "https://www.yourpodcast.com/*"
  to = "https://yourpodcast.com/:splat"
  status = 301
```

### Mixed content warnings

Ensure all resources use HTTPS:

```astro
<!-- ❌ HTTP (causes warning) -->
<img src="http://example.com/image.jpg" />

<!-- ✅ HTTPS -->
<img src="https://example.com/image.jpg" />
```

## Related

- **[Cloudflare Pages](/deployment/cloudflare-pages/)** - Deploy to Cloudflare
- **[Environment Variables](/deployment/environment-variables/)** - Configure variables
- **[Netlify](/deployment/netlify/)** - Deploy to Netlify

## Next Steps

- **[Environment Variables](/deployment/environment-variables/)** - Update site URL
- **[Performance](/advanced/performance/)** - Optimize performance (coming soon)
- **[Monitoring](/advanced/monitoring/)** - Monitor your site (coming soon)
