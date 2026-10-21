import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

const stops = z
  .array(
    z.object({
      name: z.string(),
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      note: z.string().optional(),
    }),
  )
  .min(2);

const rides = defineCollection({
  loader: glob({ base: './src/content/rides', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    region: z.string(),
    mapLabel: z.string().optional(),
    country: z.string(),
    season: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    distanceKm: z.number().int().positive(),
    days: z.number().int().positive(),
    bike: z.string(),
    cover: z.string(),
    featured: z.boolean().default(false),
    loop: z.boolean().default(true),
    youtube: z
      .string()
      .regex(/^[A-Za-z0-9_-]{11}$/)
      .optional(),
    clips: z
      .array(
        z.object({
          title: z.string(),
          file: z.string().regex(/^[\w-]+\.mp4$/),
          poster: z.string(),
          duration: z.string(),
          orientation: z.enum(['landscape', 'portrait']),
          note: z.string(),
          alt: z.string(),
        }),
      )
      .default([]),
    timeLapses: z
      .array(
        z.object({
          title: z.string(),
          file: z.string().regex(/^[\w-]+\.mp4$/),
          poster: z.string(),
          duration: z.string(),
          note: z.string(),
          alt: z.string(),
        }),
      )
      .default([]),
    stops,
  }),
});

const vlogs = defineCollection({
  loader: glob({ base: './src/content/vlogs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    episode: z.number().int().positive(),
    publishedAt: z.coerce.date(),
    duration: z.string(),
    youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
    poster: z.string(),
    stills: z.array(z.string()).default([]),
    ride: reference('rides'),
    series: z.string().optional(),
    location: z.string(),
    coords: z.tuple([z.number(), z.number()]).optional(),
    summary: z.string(),
    featured: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const photos = defineCollection({
  loader: file('./src/data/photos.json'),
  schema: z.object({
    file: z.string(),
    alt: z.string(),
    caption: z.string(),
    location: z.string(),
    coords: z.tuple([z.number(), z.number()]).optional(),
    ride: reference('rides').optional(),
    takenAt: z.coerce.date().optional(),
    film: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const places = defineCollection({
  loader: file('./src/data/places.json'),
  schema: z.object({
    title: z.string(),
    location: z.string(),
    region: z.string(),
    country: z.string(),
    coords: z.tuple([z.number(), z.number()]),
    publishedAt: z.coerce.date(),
    duration: z.string(),
    youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
    poster: z.string(),
    summary: z.string(),
  }),
});

export const collections = { rides, vlogs, posts, photos, places };
