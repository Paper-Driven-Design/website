/**
 * Dane strukturalne (schema.org / JSON-LD) i pomocnicze funkcje SEO.
 * Google, Bing i asystenci AI (ChatGPT, Perplexity, Claude) czytają z nich, czym jest podcast,
 * kto go prowadzi, jakie są odcinki i gdzie leży audio — bez zgadywania z HTML-a.
 */
import type { CollectionEntry } from 'astro:content';
import { site } from '../data/site';

type Episode = CollectionEntry<'episodes'>;
type Host = (typeof site.hosts)[number];
type JsonLd = Record<string, unknown>;

const base = site.url.replace(/\/$/, '');

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${base}${path}`);

/** Tytuły w YAML są wersalikami (typografia strony); do <title>, feedu i schema bierzemy zwykłą pisownię z shortTitle. */
export const plainTitle = (data: Episode['data']) => data.shortTitle?.split(' — ')[1]?.trim() || data.title;

export const episodeUrl = (id: string) => `${base}/odcinki/${id}/`;

export const toSeconds = (duration: string) => duration.split(':').reduce((acc, part) => acc * 60 + Number(part), 0);

/** "31:51" → "PT31M51S" (ISO 8601, wymagane przez schema.org). */
export const isoDuration = (duration: string) => {
  const total = toSeconds(duration);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s}S`;
};

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

const youtubeId = (url: string) => url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{6,})/)?.[1];

const externalPlatforms = () =>
  site.platforms.filter((p) => /^https?:\/\//.test(p.href) && !('comingSoon' in p && p.comingSoon)).map((p) => p.href);

const ids = {
  website: `${base}/#website`,
  organization: `${base}/#organization`,
  podcast: `${base}/#podcast`,
  person: (host: Host) => `${base}/#${host.id}`,
};

export function personLd(host: Host): JsonLd {
  const blog = host.links.find((l) => l.label === 'Blog')?.href;
  return {
    '@type': 'Person',
    '@id': ids.person(host),
    name: host.name,
    jobTitle: host.roleShort,
    description: host.bio,
    image: absoluteUrl(host.photo),
    ...(blog ? { url: blog } : {}),
    sameAs: host.links.map((l) => l.href),
    worksFor: { '@id': ids.organization },
  };
}

export function organizationLd(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ids.organization,
    name: site.name,
    url: `${base}/`,
    logo: { '@type': 'ImageObject', url: site.podcast.cover, width: 3000, height: 3000 },
    sameAs: externalPlatforms(),
    founder: site.hosts.map((h) => ({ '@id': ids.person(h) })),
  };
}

export function websiteLd(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    name: site.name,
    url: `${base}/`,
    description: site.description,
    inLanguage: site.podcast.language,
    publisher: { '@id': ids.organization },
  };
}

export function podcastSeriesLd(): JsonLd {
  return {
    '@type': 'PodcastSeries',
    '@id': ids.podcast,
    name: site.name,
    alternateName: site.tagline,
    description: site.podcast.summary,
    url: `${base}/`,
    webFeed: `${base}${site.podcast.feedPath}`,
    image: site.podcast.cover,
    inLanguage: site.podcast.language,
    genre: ['Technology', 'Software architecture', 'Software engineering'],
    keywords: 'architektura oprogramowania, projektowanie systemów, Domain-Driven Design, Event Storming, podcast IT',
    author: site.hosts.map((h) => ({ '@id': ids.person(h) })),
    publisher: { '@id': ids.organization },
    sameAs: externalPlatforms(),
  };
}

export function podcastEpisodeLd(episode: Episode): JsonLd {
  const { data } = episode;
  const url = episodeUrl(episode.id);
  const name = plainTitle(data);
  const total = toSeconds(data.duration);
  const description = data.description ?? data.lead ?? data.summary;
  const image = data.image ?? site.podcast.cover;

  const media: JsonLd[] = [];
  if (data.audio.url) {
    media.push({
      '@type': 'AudioObject',
      name: `${name} (MP3)`,
      contentUrl: data.audio.url,
      encodingFormat: 'audio/mpeg',
      duration: isoDuration(data.duration),
      ...(data.audio.bytes ? { contentSize: String(data.audio.bytes) } : {}),
      uploadDate: isoDate(data.date),
    });
  }
  const ytId = data.youtube ? youtubeId(data.youtube) : undefined;
  if (data.youtube && ytId) {
    media.push({
      '@type': 'VideoObject',
      name: `${name} (wideo)`,
      description,
      thumbnailUrl: [image, `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`],
      uploadDate: isoDate(data.date),
      duration: isoDuration(data.duration),
      contentUrl: data.youtube,
      embedUrl: `https://www.youtube.com/embed/${ytId}`,
    });
  }

  const chapters = data.chapters.map((ch, i, all) => ({
    '@type': 'Clip',
    name: ch.title,
    startOffset: ch.seconds,
    endOffset: all[i + 1]?.seconds ?? total,
    url: `${url}#rozdzialy`,
  }));

  const transcript = data.transcript.full.length
    ? data.transcript.full.map((l) => `${l.speaker}: ${l.html.replace(/<[^>]+>/g, '')}`).join('\n')
    : undefined;

  return {
    '@type': 'PodcastEpisode',
    '@id': url,
    url,
    name,
    headline: name,
    episodeNumber: data.number,
    partOfSeason: { '@type': 'PodcastSeason', seasonNumber: data.season },
    partOfSeries: { '@id': ids.podcast },
    datePublished: isoDate(data.date),
    description,
    abstract: data.summary,
    timeRequired: isoDuration(data.duration),
    duration: isoDuration(data.duration),
    image,
    inLanguage: site.podcast.language,
    isFamilyFriendly: !data.explicit,
    keywords: [...data.tags, ...data.topics].join(', '),
    author: site.hosts.map((h) => ({ '@id': ids.person(h) })),
    publisher: { '@id': ids.organization },
    ...(media.length ? { associatedMedia: media } : {}),
    ...(chapters.length ? { hasPart: chapters } : {}),
    ...(transcript ? { transcript } : {}),
    sameAs: [data.spotify, data.youtube].filter(Boolean),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqLd(faq: readonly { q: string; a: string }[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** Meta description: Google pokazuje ok. 155–160 znaków, dłuższe ucina w pół zdania. Tniemy na granicy słowa. */
export function metaDescription(text: string, max = 158) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const atWord = cut.lastIndexOf(' ');
  return `${cut.slice(0, atWord > max * 0.6 ? atWord : cut.length).replace(/[\s,;:.]+$/, '')}…`;
}

/** Jeden <script type="application/ld+json"> z grafem — mniej duplikatów niż osobne skrypty. */
export function jsonLdGraph(nodes: JsonLd[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** JSON do set:html; "<" zamieniane na <, żeby "</script>" w treści nie zamknął tagu. */
export const serializeLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
