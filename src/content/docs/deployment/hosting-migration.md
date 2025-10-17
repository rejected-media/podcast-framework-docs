---
title: Hosting Migration Checklist
description: Complete checklist for migrating your podcast website between hosting platforms
---

# Hosting Platform Migration Checklist

Use this checklist when migrating to a new hosting platform (Netlify, Cloudflare, Vercel, etc.).

---

## Pre-Migration Assessment

### 1. Platform Compatibility Review

- [ ] **Runtime Environment**
  - [ ] Identify Node.js version requirements
  - [ ] Check if platform uses Node.js or alternative runtime (V8 isolates, Edge runtime)
  - [ ] List all Node.js-specific APIs used in code
  - [ ] Verify all dependencies are compatible with target runtime

- [ ] **Build System**
  - [ ] Confirm build command works locally
  - [ ] Check build output directory configuration
  - [ ] Verify static assets are properly generated
  - [ ] Test build in CI/CD environment if possible

- [ ] **Serverless Functions**
  - [ ] Identify all serverless endpoints
  - [ ] Check function signature compatibility (handler format)
  - [ ] Verify environment variable access method
  - [ ] Confirm timeout limits are acceptable
  - [ ] Test cold start performance requirements

### 2. Feature Inventory

- [ ] **Static Pages**
  - [ ] List all static routes
  - [ ] Confirm SSG compatibility
  - [ ] Verify image optimization support

- [ ] **Dynamic Features**
  - [ ] API routes / serverless functions
  - [ ] Form submissions
  - [ ] Email sending
  - [ ] Database connections
  - [ ] Third-party integrations

- [ ] **External Services**
  - [ ] CMS (Sanity, Contentful, etc.)
  - [ ] Email (Resend, SendGrid, etc.)
  - [ ] Analytics (GA, Plausible, etc.)
  - [ ] Error monitoring (Sentry, etc.)
  - [ ] Storage (S3, R2, etc.)

### 3. Code Preparation

- [ ] **Environment Variables**
  - [ ] Document all required environment variables
  - [ ] Note any platform-specific variable names
  - [ ] Create `.env.example` with all variables
  - [ ] Test environment variable access in new runtime

- [ ] **Dependencies**
  - [ ] Audit all npm packages for platform compatibility
  - [ ] Identify packages that require Node.js APIs
  - [ ] Find alternative packages if needed
  - [ ] Update `package.json` with platform-specific adapters

- [ ] **Code Abstraction**
  - [ ] Use hosting adapter for environment variables
  - [ ] Abstract platform-specific APIs
  - [ ] Avoid module-level service initialization
  - [ ] Implement lazy loading where needed

---

## Migration Process

### Phase 1: Setup New Platform

- [ ] **Account & Project Setup**
  - [ ] Create account on new platform
  - [ ] Create new project
  - [ ] Connect GitHub repository
  - [ ] Configure build settings:
    - [ ] Build command
    - [ ] Output directory
    - [ ] Node.js version
    - [ ] Framework preset (if available)

- [ ] **Environment Variables**
  - [ ] Add all PUBLIC_ variables
  - [ ] Add all private/secret variables
  - [ ] Verify variable names match code
  - [ ] Test variable access with simple endpoint
  - [ ] **Total variables configured: ___**

- [ ] **Domain Configuration** (defer to Phase 3)
  - [ ] Note: Keep DNS pointing to old platform
  - [ ] Document new platform preview URL

### Phase 2: Code Adaptation

- [ ] **Update Configuration**
  - [ ] Add platform-specific adapter to `astro.config.mjs`
  - [ ] Set correct `output` mode (static/server/hybrid)
  - [ ] Add prerender directives to static pages
  - [ ] Configure platform-specific optimizations

- [ ] **Update API Routes**
  - [ ] Migrate serverless functions to API routes (if needed)
  - [ ] Update environment variable access
  - [ ] Use hosting adapter utilities
  - [ ] Test lazy service initialization
  - [ ] Update error logging

- [ ] **Handle Platform-Specific Issues**
  - [ ] Fix DOMPurify/browser API access
  - [ ] Replace incompatible packages
  - [ ] Update file paths if needed
  - [ ] Fix SSR hydration issues

- [ ] **Build & Test Locally**
  - [ ] Run `npm run build`
  - [ ] Check build output
  - [ ] Verify `_routes.json` or equivalent
  - [ ] Test preview build locally

### Phase 3: Preview Deployment

- [ ] **Deploy to Staging**
  - [ ] Push code to GitHub
  - [ ] Monitor build logs
  - [ ] Check for build errors
  - [ ] Note preview URL: _______________

- [ ] **Functional Testing**
  - [ ] Homepage loads correctly
  - [ ] All static pages render
  - [ ] Dynamic pages load data
  - [ ] Navigation works
  - [ ] Search/filter functionality
  - [ ] Forms submit successfully
  - [ ] Email notifications send
  - [ ] Images load from CDN
  - [ ] Analytics tracking fires
  - [ ] Sitemap accessible
  - [ ] 404 page displays

- [ ] **API Endpoint Testing**
  - [ ] All API routes respond
  - [ ] Authentication works
  - [ ] Database queries succeed
  - [ ] External API calls work
  - [ ] Rate limiting functions
  - [ ] Error handling works

- [ ] **Performance Testing**
  - [ ] Run Lighthouse audit
  - [ ] Check PageSpeed Insights
  - [ ] Measure cold start times
  - [ ] Compare with current platform
  - [ ] Test from multiple regions

- [ ] **Monitor Logs**
  - [ ] Check deployment logs
  - [ ] Monitor function logs
  - [ ] Look for errors/warnings
  - [ ] Verify environment variables loaded

### Phase 4: Production Cutover

⚠️ **IMPORTANT:** Keep old platform running during cutover!

- [ ] **Pre-Cutover Validation**
  - [ ] All tests passing on preview
  - [ ] Performance acceptable
  - [ ] No errors in logs
  - [ ] Team approval obtained

- [ ] **DNS Configuration**
  - [ ] Add custom domain in new platform
  - [ ] Note DNS records to update: _______________
  - [ ] Update DNS records (CNAME/A record)
  - [ ] Enable SSL/TLS
  - [ ] Wait for DNS propagation (1-5 minutes typically)

- [ ] **Verify Production**
  - [ ] Visit production URL
  - [ ] Confirm serving from new platform
  - [ ] Re-run all functional tests
  - [ ] Monitor analytics for traffic
  - [ ] Check for 404s or errors

- [ ] **Monitor Post-Migration**
  - [ ] Watch error logs (24-48 hours)
  - [ ] Monitor performance metrics
  - [ ] Check analytics for anomalies
  - [ ] Verify email delivery
  - [ ] Track form submissions

### Phase 5: Rollback Plan

- [ ] **Prepare Rollback** (before cutover)
  - [ ] Document current DNS settings
  - [ ] Keep old platform deployment active
  - [ ] Note rollback DNS values
  - [ ] Estimate rollback time: ___ minutes

- [ ] **If Rollback Needed**
  - [ ] Revert DNS records to old platform
  - [ ] Wait for DNS propagation
  - [ ] Verify site serving from old platform
  - [ ] Document what went wrong
  - [ ] Fix issues before retrying

### Phase 6: Cleanup (After 2+ Weeks)

- [ ] **Old Platform**
  - [ ] Disable auto-deploys
  - [ ] Stop old platform site (don't delete)
  - [ ] Keep as backup for 1 month
  - [ ] Document decommission date

- [ ] **Documentation**
  - [ ] Update README with new deployment info
  - [ ] Archive migration guide
  - [ ] Update context/STATUS.md
  - [ ] Document lessons learned

- [ ] **Cost Monitoring**
  - [ ] Verify no unexpected charges
  - [ ] Monitor new platform usage
  - [ ] Compare costs with old platform
  - [ ] Update budget projections

---

## Platform-Specific Checklists

### Cloudflare Pages

- [ ] Environment variables accessed via `locals.runtime.env`
- [ ] Sentry disabled or using Browser SDK
- [ ] No module-level service initialization
- [ ] DOMPurify with SSR fallback
- [ ] Functions directory renamed to avoid conflicts
- [ ] Server mode with prerender directives
- [ ] Test endpoint to verify env vars
- [ ] Check `_routes.json` for correct routing

### Netlify

- [ ] Environment variables via `process.env`
- [ ] Sentry full support with `@sentry/node`
- [ ] Netlify Functions in `/functions` or `/netlify/functions`
- [ ] Netlify Identity configured (if needed)
- [ ] Form submissions configured
- [ ] Redirects in `netlify.toml` or `_redirects`
- [ ] Build plugins configured

### Vercel

- [ ] Environment variables via `process.env`
- [ ] Vercel Functions in `/api`
- [ ] Edge Runtime vs Node.js runtime decision
- [ ] Image optimization configured
- [ ] Middleware configured (if needed)
- [ ] `vercel.json` configuration

---

## Common Issues & Solutions

### Issue: Environment variables undefined
**Solution:** Use hosting adapter to access env vars correctly for each platform

### Issue: Module not found errors
**Solution:** Check if package is compatible with platform runtime (V8 vs Node.js)

### Issue: Services failing at module level
**Solution:** Move service initialization inside request handlers (lazy loading)

### Issue: Window/document not defined
**Solution:** Add `typeof window !== 'undefined'` checks, use SSR-safe packages

### Issue: Cold start timeouts
**Solution:** Reduce bundle size, minimize dependencies, optimize initialization

### Issue: CORS errors
**Solution:** Configure CORS headers in API routes, check domain allowlist

---

## Post-Migration Validation

### Day 1-7
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify analytics data
- [ ] Confirm emails delivering
- [ ] Review function logs daily

### Week 2-4
- [ ] Compare costs with old platform
- [ ] Analyze performance improvements
- [ ] Document any issues encountered
- [ ] Train team on new platform
- [ ] Update runbooks and procedures

### Month 1-3
- [ ] Optimize based on learnings
- [ ] Implement platform-specific features
- [ ] Review and update documentation
- [ ] Consider decommissioning old platform

---

## Success Criteria

Migration is successful when:
- ✅ All features working as before
- ✅ Performance equal or better
- ✅ No increase in error rate
- ✅ Team comfortable with new platform
- ✅ Costs within budget
- ✅ Documentation updated

---

**Template Version:** 1.0
**Last Updated:** 2025-10-09
**Based on:** Netlify → Cloudflare Pages migration
