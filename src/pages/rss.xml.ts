import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const episodes = (await getCollection('episodes', ({ data }) => data.status === 'published')).sort(
    (a, b) => b.data.number - a.data.number,
  );

  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items: episodes.map((episode) => ({
      title: `#${String(episode.data.number).padStart(3, '0')} — ${episode.data.title}`,
      description: episode.data.summary,
      pubDate: episode.data.date,
      link: `/odcinki/${episode.id}/`,
      categories: [...episode.data.tags],
      ...(episode.data.audio.url
        ? { enclosure: { url: episode.data.audio.url, type: 'audio/mpeg', length: 0 } }
        : {}),
    })),
    customData: `<language>pl-pl</language>`,
  });
}
