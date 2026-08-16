import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { docsCollection, partialsCollection } from "@cloudflare/nimbus-docs/content";

export const collections = {
  docs: defineCollection(
    docsCollection({
      schemaFields: {
        audience: z.literal("human").optional(),
      },
    }),
  ),
  "docs-en": defineCollection(
    docsCollection({
      base: "docs-en",
      schemaFields: {
        audience: z.literal("human").optional(),
      },
    }),
  ),
  partials: defineCollection(partialsCollection()),
  blog: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
    }),
  }),
};
