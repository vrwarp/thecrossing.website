/**
 * Prepends Astro's configured BASE_URL (e.g. "/thecrossing.website") to any
 * root-relative path so links and public assets work on GitHub Pages subpaths.
 */
export function url(path: string): string {
  if (!path) return import.meta.env.BASE_URL;
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#')
  ) {
    return path;
  }
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return clean ? `${base}/${clean}` : `${base}/`;
}

/**
 * Resolves a site-relative path (including BASE_URL) to an absolute URL using
 * Astro.site, for canonical links, Open Graph images, and JSON-LD.
 */
export function absoluteUrl(path: string, site: URL | string = 'https://vrwarp.github.io'): string {
  const origin = typeof site === 'string' ? site : site.origin;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return new URL(url(path), origin).toString();
}
