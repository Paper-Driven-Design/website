import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const chapter = z.object({
  time: z.string(), // "14:30"
  seconds: z.number(),
  title: z.string(),
});

const takeaway = z.object({
  title: z.string(),
  text: z.string(),
});

const resource = z.object({
  kind: z.string(), // np. "Tablica Miro & Mural"
  title: z.string(),
  text: z.string().optional(),
  list: z.array(z.string()).optional(),
  cta: z.string(),
  href: z.string().default('#'),
  icon: z.string().default('description'), // nazwa ikony Material Symbols
  ctaIcon: z.string().default('download'),
  accent: z.enum(['primary', 'tertiary', 'neutral']).default('neutral'),
});

const transcriptLine = z.object({
  speaker: z.string(),
  initials: z.string(),
  time: z.string(),
  html: z.string(), // dozwolone proste tagi: <em>, <strong>
});

const episodes = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/episodes' }),
  schema: z.object({
    number: z.number(),
    season: z.number().default(1),
    title: z.string(),
    shortTitle: z.string().optional(), // tytuł w odtwarzaczu, np. "PDD #002 — ..."
    status: z.enum(['published', 'upcoming']).default('published'),
    badge: z.string().optional(), // "NAJNOWSZY", "PILOTAŻOWY"
    date: z.coerce.date(),
    dateLabel: z.string(), // "18 października 2026"
    monthLabel: z.string(), // "PAŹDZIERNIK 2026"
    duration: z.string().default('00:00'), // "52:14"
    durationMinutes: z.number().default(0),
    summary: z.string(), // tekst na karcie
    lead: z.string().optional(), // akapit wprowadzający na stronie odcinka
    description: z.string().optional(),
    tags: z.array(z.string()).default([]), // chipy na karcie / filtry
    topics: z.array(z.string()).default([]), // hashtagi na stronie odcinka
    hostsNote: z.string().optional(),
    audio: z
      .object({
        url: z.string().optional(), // pełny URL (CloudFront), np. https://d3057vo2xyrx9j.cloudfront.net/episodes/001-....mp3
        bytes: z.number().optional(), // rozmiar pliku w bajtach — <enclosure length> w feedzie (wypisuje upload-episode.sh)
        size: z.string().optional(), // etykieta na stronie, np. "31 MB"
        quality: z.string().optional(), // np. "128 kbps"
      })
      .default({}),
    image: z.string().optional(), // okładka odcinka 3000x3000 (pełny URL) — feed + og:image
    explicit: z.boolean().default(false),
    notes: z
      .object({
        url: z.string().optional(),
        label: z.string().optional(), // "Notatki wizualne (PDF 12 str.)"
      })
      .default({}),
    chapters: z.array(chapter).default([]),
    takeaways: z.array(takeaway).default([]),
    caseStudy: z
      .object({
        kicker: z.string(),
        title: z.string(),
        text: z.string(),
        photoLabel: z.string().optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
      })
      .optional(),
    resources: z.array(resource).default([]),
    transcript: z
      .object({
        range: z.string().optional(), // "[14:30 – 17:15]"
        wordCount: z.string().optional(), // "8 400"
        excerpt: z.array(transcriptLine).default([]),
        full: z.array(transcriptLine).default([]),
      })
      .default({ excerpt: [], full: [] }),
    teaser: z.string().optional(), // dla odcinków "upcoming"
  }),
});

export const collections = { episodes };
