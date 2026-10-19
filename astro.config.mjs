// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://paperdriven.design',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Do sitemapy trafiają tylko strony HTML (nie feed, llms.txt ani 404).
      filter: (page) => !/\/404\/?$|\.(xml|txt)$/.test(page),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
