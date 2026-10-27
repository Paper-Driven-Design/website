/**
 * /llms.txt — streszczenie strony w Markdownie dla asystentów AI (format: https://llmstxt.org).
 * Generowane z tych samych danych co strona i feed, więc nie rozjeżdża się z treścią.
 */
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { episodeUrl, plainTitle } from '../lib/seo';

export async function GET(context: APIContext) {
  const base = (context.site ?? new URL(site.url)).toString().replace(/\/$/, '');

  const episodes = (await getCollection('episodes', ({ data }) => data.status === 'published')).sort(
    (a, b) => b.data.number - a.data.number,
  );

  const platforms = site.platforms
    .filter((p) => p.href !== '#' && !('comingSoon' in p && p.comingSoon))
    .map((p) => `- ${p.label}: ${/^https?:\/\//.test(p.href) ? p.href : `${base}${p.href}`}`);

  const hosts = site.hosts.map(
    (h) => `### ${h.name}\n${h.roleShort}. ${h.bio}\n${h.links.map((l) => `- ${l.label}: ${l.href}`).join('\n')}`,
  );

  const episodeLines = episodes.map(({ id, data }) => {
    const extra = [
      `premiera ${data.dateLabel}`,
      `czas ${data.duration}`,
      data.youtube && `YouTube: ${data.youtube}`,
      data.spotify && `Spotify: ${data.spotify}`,
      data.apple && `Apple Podcasts: ${data.apple}`,
      data.audio.url && `MP3: ${data.audio.url}`,
    ]
      .filter(Boolean)
      .join(' · ');
    const summary = (data.description ?? data.lead ?? data.summary).replace(/\s+/g, ' ').trim();
    return `- [#${String(data.number).padStart(3, '0')} ${plainTitle(data)}](${episodeUrl(id)}): ${summary} (${extra})`;
  });

  const faq = site.faq.map((f) => `**${f.q}**\n${f.a}`).join('\n\n');

  const text = `# ${site.name}

> ${site.podcast.subtitle}. ${site.description}

Strona: ${base}/
Kanał RSS podcastu: ${base}${site.podcast.feedPath}
Język: polski. ${site.cadence}.

## O podcaście

${site.podcast.summary}

## Prowadzący

${hosts.join('\n\n')}

## Gdzie słuchać

${platforms.join('\n')}

## Odcinki

${episodeLines.join('\n')}

## Najczęstsze pytania

${faq}

## Manifest

${site.manifest.quote}

${site.manifest.paragraphs.join('\n\n')}
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
