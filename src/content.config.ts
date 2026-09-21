import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const bakers = z.enum(["loaf", "eagle", "both"]);

const menu = defineCollection({
  loader: glob({ base: "./src/content/menu", pattern: "**/[^_]*.md" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      order: z.number().int(),
      status: z.enum(["fresh", "proving", "day-old"]),
      ingredients: z.array(z.string()).min(1),
      bakers,
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

const bench = defineCollection({
  // Underscore-prefixed files are loaded on purpose so the dev-only sample works. Drafts are filtered in code.
  loader: glob({ base: "./src/content/bench", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      bakers,
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { menu, bench };
