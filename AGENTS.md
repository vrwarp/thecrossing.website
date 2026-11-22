# AGENTS.md — Developer & Agent Guide for The Crossing Website

This repository is an **Astro 5 + Tailwind CSS v4** static website deployed to GitHub Pages under the subpath `/thecrossing.website`. It is structured for fast, reliable, low-context agentic edits (e.g., with Gemini Flash models).

## Core Rules (Read Before Editing)

1. **Always use `url()` for internal links and `public/` assets:**
   - Import `{ url } from '../lib/url'` (adjust relative path).
   - Write `<a href={url('/im-new')}>` and `<img src={url('/images/site/logo.webp')} />`.
   - Never hardcode `/im-new` or `/images/...` directly, because GitHub Pages serves this site at `/thecrossing.website/`.
2. **Never commit `thecrossing-website-original/`:**
   - It is `.gitignore`d and kept locally for reference only.
3. **Prefer WebP images & pure CSS effects:**
   - Store static images in `public/images/{site,staff,sermons}/*.webp`.
   - Use CSS transitions (`transform`, `opacity`), `<details>` accordions, and native `<dialog>` modals rather than heavy JS libraries.
4. **Use `<YouTubeEmbed>` for YouTube videos:**
   - Never paste raw YouTube `<iframe>` tags on content pages; use `src/components/YouTubeEmbed.astro` so pages load with zero YouTube JS until clicked.

## Directory Map

- `astro.config.mjs` — Astro config (`site`, `base: '/thecrossing.website'`, Tailwind v4 Vite plugin).
- `src/styles/global.css` — Tailwind CSS v4 `@theme` design tokens (obsidian, stone, amber accent, Plus Jakarta Sans + Inter).
- `src/data/site.ts` — Single source of truth for church address, service times, contact info, and `NAV_ITEMS`.
- `src/lib/url.ts` — Subpath-safe `url(path)` helper.
- `src/content.config.ts` — Zod schema for `sermons` collection.
- `src/content/sermons/*.json` — One JSON file per sermon series (`title`, `book`, `description`, `coverImage`, `featured`, `order`, `episodes[]`).
- `src/components/` — Small, single-purpose `.astro` UI components (`Header`, `Footer`, `PageHeader`, `YouTubeEmbed`, `EmbedFrame`, `SeriesCard`, `SearchModal`).
- `src/pages/` — File-based routes matching the site's URLs 1:1.

## Common Tasks

### Add a new sermon series or episode
1. Add cover image as `public/images/sermons/<slug>.webp`.
2. Create or edit `src/content/sermons/<slug>.json` matching the Zod schema in `src/content.config.ts`.
3. Set `"featured": true` on the active series (and `false` on the previous one), and lower `"order"` so it appears first.

### Update navigation or church info
- Edit `src/data/site.ts` (`SITE` or `NAV_ITEMS`).

## Verification Commands

Always run both commands after making changes:
```bash
npm run check   # Type-checks Astro templates & content schemas
npm run build   # Builds static site to dist/ and generates Pagefind search index
```
