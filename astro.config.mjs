// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vrwarp.github.io',
  base: '/thecrossing.website',
  trailingSlash: 'ignore',
  vite: {
    // @ts-expect-error — @tailwindcss/vite uses Vite 7 types while Astro 5 bundles Vite 6 types
    plugins: [tailwindcss()],
  },
});
