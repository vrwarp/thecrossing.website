import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sermons = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/sermons' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    book: z.string().optional(),
    description: z.string().optional(),
    coverImage: z.string(),
    featured: z.boolean().default(false),
    order: z.number().int(),
    legacyArchiveUrl: z.string().optional(),
    episodes: z.array(
      z.object({
        title: z.string(),
        speaker: z.string().optional(),
        date: z.string().optional(),
        scripture: z.string().optional(),
        youtubeId: z.string(),
      })
    ).default([]),
  }),
});

export const collections = { sermons };
