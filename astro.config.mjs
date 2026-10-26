// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';
import { site } from './src/data/site';

// Daty publikacji odcinków do <lastmod> w sitemapie. Konfiguracja nie ma dostępu do kolekcji treści,
// więc czytamy pola `date` i `status` wprost z YAML-i (tylko opublikowane odcinki mają strony).
const episodesDir = './src/content/episodes';
const episodeDates = Object.fromEntries(
  readdirSync(episodesDir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => {
      const yaml = readFileSync(`${episodesDir}/${f}`, 'utf8');
      const published = !/^status:\s*upcoming/m.test(yaml);
      return [f.replace(/\.yaml$/, ''), published ? yaml.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)?.[1] : undefined];
    }),
);
const newestEpisodeDate = Object.values(episodeDates).filter(Boolean).sort().at(-1);

// https://astro.build/config
export default defineConfig({
  site: 'https://paperdriven.design',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Do sitemapy trafiają tylko strony HTML (nie feed, llms.txt, 404 ani /backoffice).
      filter: (page) => !/\/(404|backoffice)(\/.*)?\/?$|\.(xml|txt)$/.test(page),
      // Każdy URL dostaje lastmod (Google używa go do kolejki ponownego crawlowania) i priorytet względny.
      serialize(item) {
        const path = new URL(item.url).pathname;
        const episode = path.match(/^\/odcinki\/([^/]+)\/?$/)?.[1];
        if (episode) return { ...item, lastmod: episodeDates[episode], changefreq: 'monthly', priority: 0.8 };
        if (path === '/') return { ...item, lastmod: newestEpisodeDate, changefreq: 'weekly', priority: 1.0 };
        if (path.startsWith('/polityka-prywatnosci'))
          return { ...item, lastmod: site.legal.policyUpdatedIso, changefreq: 'yearly', priority: 0.3 };
        return { ...item, changefreq: 'monthly', priority: 0.5 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
