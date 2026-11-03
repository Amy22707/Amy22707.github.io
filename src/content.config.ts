import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    pinned: z.boolean().default(false),
    pinOrder: z.number().int().nonnegative().default(100),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    repository: z.string().url().optional(),
    demo: z.string().url().optional(),
    technologies: z.array(z.string()).default([]),
    kind: z.enum(["project", "notes"]).default("project"),
    featured: z.boolean().default(false),
    date: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD for project date.")]).pipe(z.coerce.date()).optional(),
    pinned: z.boolean().default(false),
    pinOrder: z.number().int().nonnegative().default(100),
  }),
});

export const collections = { blog, projects };
