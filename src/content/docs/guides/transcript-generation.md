---
title: Transcript Generation
description: Guide for generating episode transcripts using OpenAI Whisper API
---

# Episode Transcript Generation

This document explains how to generate episode transcripts using OpenAI's Whisper API.

## Overview

The transcript generation system uses OpenAI's Whisper API to automatically transcribe podcast episodes. Transcripts are stored in Sanity CMS and displayed on episode pages with search and copy functionality.

**Benefits:**
- **SEO:** 10x more indexable content per episode page
- **Accessibility:** Screen reader support and WCAG compliance
- **User Experience:** Searchable, skimmable content
- **Long-tail Keywords:** Every phrase becomes discoverable

**Cost:** $0.006/minute of audio (~$0.36 per 60-minute episode)

---

## Prerequisites

### 1. OpenAI API Key

Get your API key from: https://platform.openai.com/api-keys

Add to `.env`:
```bash
OPENAI_API_KEY=sk-...
```

### 2. Audio File URLs

Episodes need direct MP3 URLs for transcription. Add `audioUrl` field to episodes in Sanity.

**Sources for audio URLs:**
- RSS feed (most podcast hosts provide direct MP3 links)
- Podcast host dashboard (Anchor, RSS.com, etc.)
- Manual download + hosting (temporary for batch processing)

**Note:** Spotify doesn't provide direct MP3 access via API. Use RSS feed URLs instead.

---

## Usage

### Generate All Transcripts

```bash
node scripts/generate-transcripts.js --all
```

This will:
1. Fetch all episodes from Sanity
2. Show cost estimate
3. Download audio files
4. Transcribe via Whisper API
5. Save transcripts to Sanity
6. Clean up temp files

**Estimated time:** ~2-3 minutes per episode (includes download + upload)

**Estimated cost for 69 episodes (60 min avg):**
- Total minutes: 69 × 60 = 4,140 minutes
- Total cost: 4,140 × $0.006 = **~$25**

### Generate Missing Transcripts Only

```bash
node scripts/generate-transcripts.js --missing
```

Only transcribes episodes that don't already have transcripts.

### Generate Single Episode

```bash
node scripts/generate-transcripts.js --episode=42
```

Transcribe a specific episode by episode number.

---

## Workflow

### Initial Setup (One-Time)

1. **Add Audio URLs to Sanity**

   Option A: Import from RSS feed
   ```bash
   # Update import-from-rss.js to extract audio URLs
   node scripts/import-from-rss.js
   ```

   Option B: Manual CSV import
   ```csv
   episodeNumber,audioUrl
   1,https://anchor.fm/s/dcf17d04/podcast/play/67890123/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F...
   2,https://anchor.fm/s/dcf17d04/podcast/play/67890124/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F...
   ```

   Option C: Add manually in Sanity Studio for each episode

2. **Verify Audio URLs**

   ```bash
   # Test one episode first
   node scripts/generate-transcripts.js --episode=1
   ```

3. **Batch Transcription**

   ```bash
   # Transcribe all episodes overnight
   node scripts/generate-transcripts.js --all
   ```

### Ongoing (New Episodes)

For each new episode:

1. Add `audioUrl` to episode in Sanity
2. Run transcription:
   ```bash
   node scripts/generate-transcripts.js --episode=<number>
   ```
3. Verify transcript on episode page

---

## Transcript Display

Transcripts are displayed on episode pages with:

- **Toggle button:** "Show Transcript" / "Hide Transcript"
- **Search functionality:** Find text within transcript
- **Highlight matches:** Yellow background on search results
- **Copy button:** Copy full transcript to clipboard
- **Scrollable container:** Max height with smooth scrolling

**Component:** `src/components/TranscriptViewer.astro`

---

## Sanity Schema

The episode schema includes these transcript-related fields:

| Field | Type | Description |
|-------|------|-------------|
| `transcript` | Text | Full transcript text (visible in Studio) |
| `transcriptSegments` | Array | Timestamped segments from Whisper (hidden) |
| `transcriptDuration` | Number | Audio duration in seconds (hidden) |
| `transcriptGeneratedAt` | DateTime | Timestamp of generation (hidden) |
| `audioUrl` | URL | Direct MP3 link for transcription |

**Hidden fields** are used for metadata but not shown in Sanity Studio UI.

---

## Troubleshooting

### "No audio URL found for episode X"

**Solution:** Add `audioUrl` field to episode in Sanity with direct MP3 link.

### "Failed to download audio: 403 Forbidden"

**Solution:** Audio URL may be protected. Try:
1. Check if URL expires (some hosts use time-limited URLs)
2. Use RSS feed URL instead of direct CDN link
3. Download manually and host temporarily

### "Transcription failed: File too large"

**Solution:** Whisper API has a 25MB file size limit. For larger files:
1. Compress audio (lower bitrate)
2. Split into smaller chunks
3. Use local Whisper model instead of API

### "Cost estimate too high"

**Solution:**
1. Start with `--episode=1` to test one episode
2. Use `--missing` to only transcribe needed episodes
3. Transcribe in batches (e.g., 10 episodes at a time)

### Transcript not showing on episode page

**Solution:**
1. Verify transcript saved in Sanity (check episode in Studio)
2. Clear browser cache / rebuild site
3. Check browser console for JavaScript errors

---

## Cost Optimization

### Strategies

1. **Batch Processing:** Transcribe overnight to avoid watching progress
2. **Selective Transcription:** Only transcribe high-traffic episodes first
3. **Manual Review:** Edit auto-generated transcripts for accuracy (improves SEO)
4. **Reuse:** Once transcribed, it's permanent (one-time cost)

### Cost Breakdown

| Scenario | Episodes | Avg Duration | Total Minutes | Cost |
|----------|----------|--------------|---------------|------|
| Single episode | 1 | 60 min | 60 | $0.36 |
| Pilot season (10) | 10 | 60 min | 600 | $3.60 |
| Full archive (69) | 69 | 60 min | 4,140 | $24.84 |
| New episode/week | 1 | 60 min | 60 | $0.36 |
| Year of episodes (52) | 52 | 60 min | 3,120 | $18.72 |

**ROI Calculation:**
- Cost for Strange Water: $25
- SEO value: 10x more indexable content
- Accessibility compliance: Priceless
- Time saved vs manual transcription: 100+ hours

---

## Alternative: Manual Transcription

If you prefer manual transcripts or want to edit auto-generated ones:

1. Transcribe via auto-generation
2. Download transcript from Sanity
3. Edit for accuracy (fix names, technical terms)
4. Paste back into Sanity

**Time estimate:** 4x audio duration (60 min episode = 4 hours editing)

---

## Future Enhancements

### Potential Improvements

1. **Speaker Diarization:** Identify who's speaking (requires custom Whisper deployment)
2. **Timestamped Navigation:** Click transcript to jump to audio position
3. **Auto-Summary:** Generate episode summary from transcript (GPT-4)
4. **Keyword Extraction:** Auto-generate SEO keywords from transcript
5. **Translation:** Multi-language transcripts for international audiences

### Automation

Add to Netlify build process:
1. Detect new episodes without transcripts
2. Auto-generate transcripts on deploy
3. Update Sanity via webhook

**Limitation:** Netlify function timeout (10 seconds), so requires external service (AWS Lambda, Cloudflare Workers).

---

## References

- **Whisper API Docs:** https://platform.openai.com/docs/guides/speech-to-text
- **Pricing:** https://openai.com/pricing
- **Sanity Schema:** `sanity/schemaTypes/episode.ts`
- **Generation Script:** `scripts/generate-transcripts.js`
- **UI Component:** `src/components/TranscriptViewer.astro`

---

**Last Updated:** 2025-10-07
**Author:** Claude (Sonnet 4.5)
