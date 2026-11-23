import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const SITE_ORIGIN = 'https://vrwarp.github.io';
const BASE_PATH = '/thecrossing.website';
const SITE_ROOT = `${SITE_ORIGIN}${BASE_PATH}`;

const NON_INDEXABLE_ROUTES = new Set([
  '/home/',
  '/sermons/kingdom-come-matthew-page-2/',
  '/sermons/kingdom-come-matthew-page-3/',
  '/404.html',
  '/404/',
]);

const errors = [];

function fail(msg) {
  errors.push(msg);
}

function walkHtml(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'pagefind' || entry.name === '_astro') continue;
      results.push(...walkHtml(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

function toRoute(filePath) {
  const rel = path.relative(DIST_DIR, filePath).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) {
    return `/${rel.slice(0, -'index.html'.length)}`;
  }
  return `/${rel}`;
}

function normalizeRoute(route) {
  if (route === '/') return '/';
  return route.endsWith('/') ? route : `${route}/`;
}

if (!fs.existsSync(DIST_DIR)) {
  console.error('ERROR: dist/ directory not found. Run `npm run build` first.');
  process.exit(1);
}

// 1. Check robots.txt
const robotsPath = path.join(DIST_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  fail('Missing dist/robots.txt');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes(`Sitemap: ${SITE_ROOT}/sitemap-index.xml`)) {
    fail(`robots.txt must declare Sitemap: ${SITE_ROOT}/sitemap-index.xml`);
  }
  if (/^Disallow:\s*\/\s*$/m.test(robots)) {
    fail('robots.txt must not Disallow: /');
  }
}

// 2. Check sitemap-index.xml and sitemap-0.xml
const sitemapIndexPath = path.join(DIST_DIR, 'sitemap-index.xml');
const sitemap0Path = path.join(DIST_DIR, 'sitemap-0.xml');
const sitemapRoutes = new Set();

if (!fs.existsSync(sitemapIndexPath)) {
  fail('Missing dist/sitemap-index.xml');
} else {
  const idxXml = fs.readFileSync(sitemapIndexPath, 'utf8');
  if (!idxXml.includes(`${SITE_ROOT}/sitemap-0.xml`)) {
    fail(`sitemap-index.xml does not reference ${SITE_ROOT}/sitemap-0.xml`);
  }
}

if (!fs.existsSync(sitemap0Path)) {
  fail('Missing dist/sitemap-0.xml');
} else {
  const s0Xml = fs.readFileSync(sitemap0Path, 'utf8');
  const locMatches = [...s0Xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (locMatches.length === 0) {
    fail('sitemap-0.xml contains zero <loc> entries');
  }
  for (const loc of locMatches) {
    if (!loc.startsWith(`${SITE_ROOT}/`)) {
      fail(`Sitemap URL outside expected base ${SITE_ROOT}/: ${loc}`);
      continue;
    }
    const route = normalizeRoute(loc.slice(SITE_ROOT.length) || '/');
    sitemapRoutes.add(route);
    if (NON_INDEXABLE_ROUTES.has(route)) {
      fail(`Non-indexable route must not appear in sitemap: ${loc}`);
    }
  }
}

function getAttr(tagHtml, attrName) {
  const dq = tagHtml.match(new RegExp(`${attrName}\\s*=\\s*"([^"]*)"`, 'i'));
  if (dq) return dq[1];
  const sq = tagHtml.match(new RegExp(`${attrName}\\s*=\\s*'([^']*)'`, 'i'));
  return sq ? sq[1] : null;
}

function getMetaContent(html, attrKey, attrVal) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metaTags) {
    if (getAttr(tag, attrKey)?.toLowerCase() === attrVal.toLowerCase()) {
      return getAttr(tag, 'content');
    }
  }
  return null;
}

// 3. Audit every built HTML page
const htmlFiles = walkHtml(DIST_DIR);
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const file of htmlFiles) {
  const route = toRoute(file);
  const normRoute = normalizeRoute(route);
  const html = fs.readFileSync(file, 'utf8');
  const isNonIndexable = NON_INDEXABLE_ROUTES.has(route) || NON_INDEXABLE_ROUTES.has(normRoute);

  // Title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) {
    fail(`[${route}] Missing or empty <title>`);
  }

  // Canonical
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  const canonicalTag = linkTags.find((tag) => getAttr(tag, 'rel')?.toLowerCase() === 'canonical');
  const canonical = canonicalTag ? getAttr(canonicalTag, 'href') : null;
  if (!canonical) {
    fail(`[${route}] Missing <link rel="canonical">`);
  } else {
    if (!canonical.startsWith(`${SITE_ROOT}/`)) {
      fail(`[${route}] Canonical URL must start with ${SITE_ROOT}/ (got ${canonical})`);
    }
    if (canonical.replace('https://', '').includes('//')) {
      fail(`[${route}] Canonical URL contains double slashes: ${canonical}`);
    }
  }

  // Robots meta
  const robotsMeta = getMetaContent(html, 'name', 'robots');
  if (!robotsMeta) {
    fail(`[${route}] Missing <meta name="robots">`);
  } else if (isNonIndexable && !robotsMeta.includes('noindex')) {
    fail(`[${route}] Non-indexable page must have robots noindex (got ${robotsMeta})`);
  } else if (!isNonIndexable && robotsMeta.includes('noindex')) {
    fail(`[${route}] Indexable page unexpectedly marked noindex`);
  }

  if (isNonIndexable) continue;

  // Sitemap coverage check
  if (!sitemapRoutes.has(normRoute)) {
    fail(`[${route}] Indexable page is missing from sitemap-0.xml`);
  }

  // Unique title check
  if (title) {
    if (seenTitles.has(title)) {
      fail(`[${route}] Duplicate <title> "${title}" (also on ${seenTitles.get(title)})`);
    } else {
      seenTitles.set(title, route);
    }
  }

  // Meta description
  const desc = (getMetaContent(html, 'name', 'description') || '').trim();
  if (!desc) {
    fail(`[${route}] Missing or empty <meta name="description">`);
  } else {
    if (desc.length < 30) {
      fail(`[${route}] Meta description too short (${desc.length} chars): "${desc}"`);
    }
    if (desc.length > 200) {
      fail(`[${route}] Meta description too long (${desc.length} chars)`);
    }
    if (seenDescriptions.has(desc)) {
      fail(`[${route}] Duplicate meta description (also on ${seenDescriptions.get(desc)})`);
    } else {
      seenDescriptions.set(desc, route);
    }
  }

  // Open Graph & Twitter tags
  const requiredMeta = [
    ['property', 'og:title'],
    ['property', 'og:description'],
    ['property', 'og:type'],
    ['property', 'og:url'],
    ['property', 'og:image'],
    ['name', 'twitter:card'],
  ];
  for (const [attrKey, attrVal] of requiredMeta) {
    const val = getMetaContent(html, attrKey, attrVal);
    if (!val) {
      fail(`[${route}] Missing ${attrVal} meta tag`);
    } else if ((attrVal === 'og:image' || attrVal === 'og:url') && !val.startsWith('https://')) {
      fail(`[${route}] ${attrVal} must be an absolute https:// URL (got ${val})`);
    }
  }

  // Single H1 check
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1Count !== 1) {
    fail(`[${route}] Expected exactly 1 <h1>, found ${h1Count}`);
  }

  // JSON-LD validity check
  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (jsonLdMatches.length === 0) {
    fail(`[${route}] Missing JSON-LD structured data`);
  }
  for (const m of jsonLdMatches) {
    try {
      JSON.parse(m[1]);
    } catch (err) {
      fail(`[${route}] Invalid JSON-LD: ${err.message}`);
    }
  }

  // Image alt attribute check
  const imgMatches = [...html.matchAll(/<img\b([^>]*)>/gi)];
  for (const m of imgMatches) {
    if (!/\balt\s*=/i.test(m[1])) {
      fail(`[${route}] <img> missing alt attribute: <img ${m[1].slice(0, 80)}>`);
    }
  }
}

if (errors.length > 0) {
  console.error(`SEO verification failed with ${errors.length} error(s):\n`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(
  `SEO verification passed! Checked ${htmlFiles.length} HTML pages and ${sitemapRoutes.size} sitemap URLs.`
);
