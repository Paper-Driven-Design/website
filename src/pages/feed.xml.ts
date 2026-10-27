/**
 * Kanał podcastowy (RSS 2.0 + przestrzeń iTunes) dla Spotify, Apple Podcasts i innych aplikacji.
 * Adres: https://paperdriven.design/feed.xml — stabilny, to jego zgłaszasz na platformach.
 *
 * Wymagania Apple/Spotify, które spełnia:
 *  - <itunes:image> 3000x3000, <itunes:category>, <itunes:explicit>, <itunes:author>, <itunes:owner>
 *  - <enclosure url length type> z pełnym URL-em MP3 i rozmiarem w bajtach (audio.bytes w YAML)
 *  - <guid isPermaLink="true"> = stały URL strony odcinka (nie zmienia się nawet po podmianie pliku audio)
 *  - <itunes:duration> w sekundach, <itunes:episode>, <itunes:season>, <itunes:episodeType>
 */
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../data/site';

const esc = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cdata = (value: string) => `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

const toSeconds = (duration: string) => duration.split(':').reduce((acc, part) => acc * 60 + Number(part), 0);

export async function GET(context: APIContext) {
  const base = (context.site ?? new URL(site.url)).toString().replace(/\/$/, '');
  const feedUrl = `${base}${site.podcast.feedPath}`;
  const podcast = site.podcast;

  const episodes = (await getCollection('episodes', ({ data }) => data.status === 'published' && !!data.audio.url)).sort(
    (a, b) => b.data.number - a.data.number,
  );

  const lastBuild = episodes[0]?.data.date ?? new Date();

  const items = episodes
    .map(({ id, data }) => {
      const link = `${base}/odcinki/${id}/`;
      const number = String(data.number).padStart(3, '0');
      const description = data.description ?? data.lead ?? data.summary;
      // Tytuły w YAML są wersalikami (typografia strony). W feedzie odcinek nazywa się tak jak na stronie:
      // shortTitle ("PDD #001 — Czy kod to już commodity?"), a bez niego "PDD #001 — TYTUŁ". Ten sam tekst idzie
      // do <title> (Spotify, czytniki RSS) i <itunes:title> (Apple pokazuje go zamiast <title>).
      const feedTitle = data.shortTitle?.trim() || `PDD #${number} — ${data.title}`;
      const html = `<p>${esc(description)}</p>${
        data.chapters.length
          ? `<p>Rozdziały:</p><ul>${data.chapters.map((c) => `<li>${esc(c.time)} — ${esc(c.title)}</li>`).join('')}</ul>`
          : ''
      }<p>Notatki i transkrypcja: <a href="${link}">${link}</a></p>${
        data.youtube ? `<p>Wersja wideo: <a href="${esc(data.youtube)}">${esc(data.youtube)}</a></p>` : ''
      }`;

      return `    <item>
      <title>${esc(feedTitle)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${data.date.toUTCString()}</pubDate>
      <description>${cdata(description)}</description>
      <content:encoded>${cdata(html)}</content:encoded>
      <enclosure url="${esc(data.audio.url!)}" length="${data.audio.bytes ?? 0}" type="audio/mpeg"/>
      <itunes:title>${esc(feedTitle)}</itunes:title>
      <itunes:summary>${esc(data.summary)}</itunes:summary>
      <itunes:duration>${toSeconds(data.duration)}</itunes:duration>
      <itunes:episode>${data.number}</itunes:episode>
      <itunes:season>${data.season}</itunes:season>
      <itunes:episodeType>${data.number === 0 ? 'trailer' : 'full'}</itunes:episodeType>
      <itunes:explicit>${data.explicit ? 'true' : 'false'}</itunes:explicit>
      <itunes:author>${esc(podcast.author)}</itunes:author>
      <itunes:image href="${esc(data.image ?? podcast.cover)}"/>
${data.tags.map((tag) => `      <category>${esc(tag)}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');

  const owner = podcast.ownerEmail
    ? `    <itunes:owner>
      <itunes:name>${esc(podcast.ownerName)}</itunes:name>
      <itunes:email>${esc(podcast.ownerEmail)}</itunes:email>
    </itunes:owner>
`
    : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>${esc(site.name)}</title>
    <link>${base}/</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <description>${cdata(podcast.summary)}</description>
    <language>${podcast.language}</language>
    <copyright>${esc(site.copyright)}</copyright>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <image>
      <url>${esc(podcast.cover)}</url>
      <title>${esc(site.name)}</title>
      <link>${base}/</link>
    </image>
    <itunes:image href="${esc(podcast.cover)}"/>
    <itunes:author>${esc(podcast.author)}</itunes:author>
    <itunes:subtitle>${esc(podcast.subtitle)}</itunes:subtitle>
    <itunes:summary>${esc(podcast.summary)}</itunes:summary>
${owner}    <itunes:category text="${esc(podcast.category)}"/>
    <itunes:explicit>${podcast.explicit ? 'true' : 'false'}</itunes:explicit>
    <itunes:type>${podcast.type}</itunes:type>
    <podcast:locked>no</podcast:locked>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
