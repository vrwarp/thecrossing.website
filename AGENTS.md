# AGENTS.md — Developer & Agent Guide for The Crossing Website

This repository is an **Astro 5 + Tailwind CSS v4** static website for **The Crossing** (the English-speaking, multiethnic ministry of Chinese For Christ Church of Hayward), deployed to GitHub Pages under the subpath `/thecrossing.website`.

This guide captures the technical constraints, visual design language, content standards, and verification workflows required to edit this site consistently.

---

## 1. Core Technical Rules (Read Before Editing)

1. **Always use `url()` for internal links and `public/` assets:**
   - Import `{ url } from '../lib/url'` (adjust relative depth).
   - Write `<a href={url('/im-new')}>` and `<img src={url('/images/site/logo.webp')} />`.
   - **Never** hardcode root-relative `/im-new` or `/images/...` in `.astro` templates (CI checks for this and will fail), because GitHub Pages serves the site under `/thecrossing.website/`.
2. **Never commit `thecrossing-website-original/`:**
   - It is `.gitignore`d and kept locally for content/asset reference only. CI verifies it stays untracked.
3. **Prefer WebP images & pure CSS effects:**
   - Store static images in `public/images/{site,staff,sermons,community}/*.webp`.
   - Use CSS transitions (`transform`, `opacity`), native `<details>` accordions, and native `<dialog>` modals rather than heavy JS libraries.
4. **Use `<YouTubeEmbed>` and `<EmbedFrame>` for embeds:**
   - Never paste raw YouTube `<iframe>` tags on content pages; use `src/components/YouTubeEmbed.astro` so pages load with zero YouTube JS until clicked.
   - Use `src/components/EmbedFrame.astro` for Google Forms, Google Calendars, Google Maps, Google Docs/Sheets, and PDFs.

---

## 2. Design Philosophy & Visual Language

### Editorial Typography ("Anti-AI" System)
Avoid generic AI-template styling (`Inter` everywhere, indigo/purple gradients, `blur-3xl` glow blobs behind dark headers, symmetrical SaaS 3×2 shadow-card grids). Maintain the site's editorial system defined in `src/layouts/BaseLayout.astro` and `src/styles/global.css`:
- **`Plus Jakarta Sans`** (`--font-display`, `--font-sans`): Clean geometric headings and body copy.
- **`Instrument Serif`** (`--font-serif`, regular & italic): Expressive editorial emphasis in hero headlines, section titles, and Vision blockquotes.
- **`JetBrains Mono`** (`--font-mono`): Structured metadata, breadcrumbs, eyebrows, dates, and `01 / 02 / 03` section indices.

### Strict Clickable-Card Discipline
**Things that look like cards must always be clickable; non-clickable things must not look like cards or buttons.**
- **Clickable (`<a>` cards):** Keep `rounded-xl border border-stone-300 bg-white` (with hover border/elevation transitions) strictly for actual link targets (`SeriesCard`, homepage *Get Connected* cards, `/get-connected` ministry cards, Hoopla *From Our Bookshelf* links, `/resources` hub cards) and dark CTA banners with clear action buttons.
- **Non-clickable informational content:** Do **not** wrap announcements, schedules, staff portraits, parking details, core values, safety notes, or book synopses in white bordered boxes or pill-shaped badges. Instead use:
  - **Hairline-ruled splits & lists:** `divide-y divide-stone-300 border-y border-stone-300` (or `md:grid-cols-2 md:divide-x md:divide-y-0`).
  - **Left-accented callouts:** `border-l-2 border-accent pl-6` (or `border-stone-900`) for parent reassurance, safety notes, office contacts, or schedule highlights.
  - **Borderless photography:** `<figure>` with `rounded-xl overflow-hidden` and `<figcaption>` underneath.

### Photography, Framing & Loading Standards
- **Demonstrate community visually:** Convey *multiethnic, cross-generational family* through real photography rather than just stating it in copy.
- **Match photo demographics to context:**
  - Youth photos (`youth-hangout.webp`, `youth-group-cross.webp`) belong on Youth / *Life Together* youth tiles—not Mature Adults.
  - Growth Groups redwood retreat (`cross-gen-redwoods.webp`) belongs on *Life Together* / *Our Church*—not Mature Adults (`mature-adults-group.webp`).
- **Protect faces & caption contrast:**
  - Use `object-top` on people-focused cards (`children-class.webp`, `youth-*`, `moms-and-toddler.webp`, staff portraits) and `object-[50%_45%]` on `cross-gen-redwoods.webp`.
  - Use strong bottom gradient scrims (`bg-gradient-to-t from-obsidian via-obsidian/85 to-transparent pt-16` or `via-obsidian/55 pt-10`) whenever placing captions over bright areas of a photo.
- **Eager-load above-the-fold & primary grid images:**
  - Set `loading="eager"` and `decoding="sync"` on hero/header images, `/get-connected` ministry cards, and the top 8 `Past Series` `SeriesCard`s (`eager={idx < 8}`) so cards never appear blank while scrolling.

### Overscroll & Subtle Pure-CSS Parallax
- **Seamless Dark Overscroll (`src/styles/global.css`, `src/layouts/BaseLayout.astro`):**
  - `html` and `body` use `--color-obsidian` (`#0B0D10`) alongside `<meta name="theme-color" content="#0B0D10" />`, while `<main>` carries `bg-stone-50`. Top and bottom rubber-band overscroll blends seamlessly into the dark `<Header />` and `<Footer />` instead of flashing light stone.
  - Use `overflow-x: clip;` on `html, body` (never `overflow-x: hidden`, which breaks `position: sticky`).
- **Subtle Pure-CSS Parallax (`src/styles/global.css`):**
  - `.parallax-media` applies a gentle GPU-composited drift (`translateY(-4%) -> translateY(4%)` with `scale(1.08)`) via CSS Scroll-Driven Animations (`animation-timeline: view()`, `animation-range: cover`).
  - Always place `.parallax-media` inside an `overflow-hidden` container, keep `@supports (animation-timeline: view())` progressive enhancement, and preserve `@media (prefers-reduced-motion: reduce)` disable rules.

---

## 3. Content Fidelity & Zero-Abridgement Policy

- **Do not abridge resource, CE, event, or ministry pages.** Preserve full book/series synopses, narrator credits, course objectives, Scripture quotes, announcements, room numbers, contact emails, and external links from `thecrossing-website-original/`.
- Only remove genuinely defunct third-party services (e.g., discontinued **Google Podcasts** and **Stitcher** were removed from `SITE.podcasts` in `src/data/site.ts`).
- Ensure parent-critical logistics stay prominent on children/youth/after-school pages (first-time visit reassurance, check-in/pick-up times & locations, allergies, screened volunteer/leader policy, consent forms).

---
- Every page must have a unique `<title>`, unique `<meta name="description">` (30–200 chars), single `<h1>`, `alt` attributes on all `<img>` tags, and valid canonical/Open Graph/Twitter metadata via `BaseLayout.astro`.
- Pass `indexable={false}` on non-indexable pages (e.g., `404.astro`) and exclude redirect/utility routes from `@astrojs/sitemap` in `astro.config.mjs` (and `scripts/verify-seo.mjs`).
- Pass `image` / `imageAlt` / `structuredData` props to `BaseLayout.astro` when a page has specific artwork or Schema.org entities (e.g., `sermons/[slug].astro`). `PageHeader.astro` emits `BreadcrumbList` JSON-LD automatically whenever `breadcrumbs` are provided.

---

## 4. Directory Map

- `astro.config.mjs` — Astro config (`site`, `base: '/thecrossing.website'`, `@astrojs/sitemap` with redirect/404 filter, Tailwind v4 Vite plugin).
- `public/robots.txt` — Crawler rules and `Sitemap:` pointer to `sitemap-index.xml`.
- `src/styles/global.css` — Tailwind CSS v4 `@theme` design tokens (obsidian, stone, amber accent, Instrument Serif + Plus Jakarta Sans + JetBrains Mono), overscroll setup, and `.parallax-media` scroll-driven keyframes.
- `src/layouts/BaseLayout.astro` — Root HTML shell, canonical URL, robots meta, Open Graph/Twitter cards, JSON-LD (`Church` + `WebSite` on `/`, `WebPage` on inner pages), Google Fonts, `theme-color`, `<Header />`, `<main data-pagefind-body>`, `<Footer />`, `<SearchModal />`.
- `src/data/site.ts` — Single source of truth for `SITE` (address, service time, contact, social, active `podcasts`, archive links) and `NAV_ITEMS`.
- `src/lib/url.ts` — Subpath-safe `url(path)` and `absoluteUrl(path, site)` helpers.
- `src/content.config.ts` — Zod schema for `sermons` collection (`title`, `book`, `dateRange`, `description`, `coverImage`, `featured`, `order`, `episodes[]`).
- `src/content/sermons/*.json` — 57 sermon series (2006–2026), one JSON file per series.
- `src/components/` — Reusable `.astro` UI components (`Header`, `Footer`, `PageHeader`, `YouTubeEmbed`, `EmbedFrame`, `SeriesCard`, `SearchModal`).
- `src/pages/` — File-based routes matching the site's URLs 1:1.
- `scripts/verify-seo.mjs` — Zero-dependency SEO, sitemap, canonical, Open Graph, `<h1>`, and JSON-LD regression check against `dist/`.
- `.github/workflows/ci.yml` — PR & push CI checks (`astro check`, `astro build`, `verify:seo`, sermon `coverImage` file existence, no hardcoded root-relative links, `thecrossing-website-original` untracked).

---

## 5. Common Tasks

### Add a new sermon series or episode
1. Add cover image as `public/images/sermons/<slug>.webp`.
2. Create or edit `src/content/sermons/<slug>.json` matching the Zod schema in `src/content.config.ts`.
3. Set `"featured": true` on the active series (and `"featured": false` on the previous one), and lower `"order"` so it appears first.

### Update navigation, service times, or podcast links
- Edit `SITE` or `NAV_ITEMS` in `src/data/site.ts`.

### Add or replace a community/ministry photo
1. Convert the image to `.webp` (`cwebp -q 84` or Pillow) and save it in `public/images/{site,staff,sermons,community}/*.webp`.
2. Reference it with `url('/images/...')`.
3. Check focal point (`object-top` / `object-center` / `object-[50%_45%]`) and verify visually in desktop + mobile screenshots.

---

## 6. Verification & Release Workflow

### Build, Typecheck & SEO Verification (Required After Every Change)
```bash
npm run check       # Type-checks Astro templates & content schemas
npm run build       # Builds static site to dist/ and generates Pagefind + sitemap
npm run verify:seo  # Verifies robots.txt, sitemap coverage, canonicals, OG, H1, JSON-LD, and alt tags
```

### Visual Inspection (Recommended for Layout/Style Changes)
1. Serve the built site locally with `npx astro preview --port 4322`.
2. Capture desktop (`1440×1200` / `1440×3600`) and mobile (`500×1200`) screenshots via headless Chrome (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` on macOS; note macOS headless Chrome enforces a `500px` minimum width and benefits from `--virtual-time-budget=2000` so images finish decoding).
3. Inspect screenshots for contrast, face cropping, non-clickable card-like boxes, and mobile wrapping.

### Git & PR Workflow
- Always confirm with the user before running `git commit` or deploying.
- Use a feature branch → commit → `gh pr create` → `gh pr checks <num> --watch` → `gh pr merge <num> --squash --delete-branch` once `CI/verify` passes.
