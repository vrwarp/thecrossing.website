// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const EXCLUDED_SITEMAP_PATHS = new Set([
  '/thecrossing.website/home',
  '/thecrossing.website/home/',
  '/thecrossing.website/sermons/kingdom-come-matthew-page-2',
  '/thecrossing.website/sermons/kingdom-come-matthew-page-2/',
  '/thecrossing.website/sermons/kingdom-come-matthew-page-3',
  '/thecrossing.website/sermons/kingdom-come-matthew-page-3/',
  '/thecrossing.website/404',
  '/thecrossing.website/404/',
]);

export default defineConfig({
  site: 'https://vrwarp.github.io',
  base: '/thecrossing.website',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !EXCLUDED_SITEMAP_PATHS.has(pathname);
      },
    }),
  ],
  vite: {
    // @ts-expect-error — @tailwindcss/vite uses Vite 7 types while Astro 5 bundles Vite 6 types
    plugins: [tailwindcss()],
  },
});
