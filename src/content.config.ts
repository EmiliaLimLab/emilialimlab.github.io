import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

/*
  Content collections for the lab site (Astro 6 Content Layer API).

  Content lives in src/content/<collection>/*.md so a CMS (Sveltia/Decap) can
  layer on later with no schema change.
*/

// People — bio lives in the markdown body (use render()).
const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/people" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      status: z.enum(["current", "alumni"]),
      group: z.enum([
        "Faculty",
        "Researchers",
        "Staff",
        "Bioinformaticians",
        "Students",
        "Affiliates",
        "Alumni",
      ]),
      role: z.string(),
      title: z.string().optional(),
      headshot: image().optional(),
      links: z
        .object({
          email: z.email().optional(),
          twitter: z.url().optional(),
          scholar: z.url().optional(),
          orcid: z.url().optional(),
          linkedin: z.url().optional(),
          website: z.url().optional(),
        })
        .default({}),
      order: z.number().default(0),
      featured: z.boolean().default(false),
    }),
});

// Publications — frontmatter only (any markdown body is optional notes).
const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    journal: z.string().optional(),
    doi: z.string().optional(),
    pmid: z.string().optional(),
    pmcid: z.string().optional(),
    url: z.url().optional(),
    scholarUrl: z.url().optional(),
    citations: z.number().optional(),
    isMenteePaper: z.boolean().default(false),
    menteeFirstAuthor: z.boolean().default(false),
    // The lab PI is first or last (senior) author.
    piFirstOrSenior: z.boolean().default(false),
    featured: z.boolean().default(false),
    openAccess: z.boolean().default(false),
    // Research tags — topic/population AREAS (drive the Research page) plus
    // cross-cutting facets. One field; a paper may carry several. The vocabulary
    // is mirrored in src/lib/content.ts — keep the two in sync when you edit it.
    areas: z
      .array(
        z.enum([
          "cancer-origins",
          "cancer-prevention",
          "aging-cancer-risk",
          "review",
          "letter",
        ]),
      )
      .default([]),
    // Collaborating institutions/cores whose logo should show on this paper.
    // Slugs are keys into COLLABORATORS in src/lib/collaborators.ts.
    collaborators: z.array(z.string()).default([]),
  }),
});

// Press — external media/news coverage about the lab. Each entry links out
// to the original article; there's no markdown body to render.
const press = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/press" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // the article's headline
      outlet: z.string(), // publication/outlet name, e.g. "CBC News"
      url: z.url(), // link to the original coverage
      date: z.coerce.date(),
      image: image().optional(), // thumbnail
      imageAlt: z.string().optional(),
      excerpt: z.string().optional(), // short description or pull-quote
      featured: z.boolean().default(false),
    }),
});

export const collections = { people, publications, press };
