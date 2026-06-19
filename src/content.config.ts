import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: postSchema,
});

const travel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/travel' }),
  schema: postSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: postSchema.extend({
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

const albums = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/albums' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    cover: z.string().optional(),
    images: z
      .array(z.object({ src: z.string(), caption: z.string().optional() }))
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { journal, travel, projects, albums };
