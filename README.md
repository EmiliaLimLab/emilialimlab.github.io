# Lim Lab Website

Website for the **Emilia Lim Lab**, built on [lab-website-template](https://github.com/bchcohenlab/lab-website-template) by the Cohen Laboratory of Translational Neuroimaging — a research-lab site built with **Astro + Tailwind CSS v4**, deployed free to GitHub Pages.

This replaces the previous Jekyll-based site (same repo, `EmiliaLimLab/emilialimlab.github.io`, history preserved). Live at [emilialimlab.github.io](https://emilialimlab.github.io/).

## About the Lab

**PI:** Dr. Emilia Lim, PhD
**Title:** Assistant Professor, Department of Biochemistry and Molecular Biology, Faculty of Medicine, UBC
**Affiliation:** Investigator, [Edwin S.H. Leong Centre for Healthy Aging](https://healthyaging.med.ubc.ca/faculty/lim-emilia)

**Education**
- BSc, University of Alberta (2009)
- PhD, University of British Columbia (2016)
- Postdoctoral research, Francis Crick Institute, University College London (2023)

**Research Focus**

The Lim Lab investigates how environmental pollutants shape the genomics, transcriptomics, and epigenomics of cells to transform normal tissues into disease states. Using multi-omic approaches, the lab examines connections between pollution exposure and age-related diseases including cancer and cardiovascular disease. Dr. Lim's prior work discovered that air pollution triggers lung cancer by promoting clonal expansion of cells with oncogenic mutations accumulated through aging.

Research background spans epigenomic and transcriptomic biomarker discovery for pediatric and hematological cancers, chromosomal instability in lung cancer evolution, and environmental factors in cancer initiation in never-smokers.

**Key Research Areas:** Bioinformatics, cancer biology, aging, genomics, transcriptomics, epigenomics, pollution exposure

**Contact**
- Office: Life Sciences Centre, Room 5502, 2350 Health Sciences Mall, Vancouver, BC V6T 1Z3
- Phone: 604-822-8114
- Email: emilia.lim@ubc.ca
- X (Twitter): [@LimEmilia](https://x.com/LimEmilia)

**Sources**
- [biochem.ubc.ca/fac-research/faculty/lim-emilia](https://biochem.ubc.ca/fac-research/faculty/lim-emilia/)
- [healthyaging.med.ubc.ca/faculty/lim-emilia](https://healthyaging.med.ubc.ca/faculty/lim-emilia)

## Stack

- [Astro](https://astro.build/) — static-site framework
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- Content as Markdown via Astro content collections (`src/content/`) — no database, no CMS
- Hosting: [GitHub Pages](https://pages.github.com/) via GitHub Actions, free, supports a custom domain

## What the template gives us

- **Pages:** Home, People (per-person profiles), Research (grouped by topic), Publications (filter by role/topic + search/sort, with automatic Google Scholar citation-count refresh), Figures (copyright-gated), Lab Life (photo gallery), Contact, 404
- A **research-topic taxonomy** that auto-groups Research and drives Publications filters
- Built-in image optimization (Astro `<Image>` → responsive WebP)
- `npm run enrich:orcid` — fills in ORCID iDs from publication author metadata
- One-click deploy to GitHub Pages via GitHub Actions

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
```

Then customize: edit `src/data/site.ts` first (site identity, contact, nav), swap content in `src/content/`, replace the placeholder favicon in `public/`.

## Customizing with Claude Code

This template is designed to be filled in by Claude Code — it reads `CLAUDE.md` automatically, so describing the lab in plain English (with a CV/roster) is enough to get content, people, and publications filled in. See [CLAUDE.md](./CLAUDE.md) for the full guided workflow.

## Commands

| Command            | Action                                            |
| :----------------- | :------------------------------------------------ |
| `npm install`       | Install dependencies                              |
| `npm run dev`       | Start the local dev server at `localhost:4321`    |
| `npm run build`     | Build the production site to `./dist/`            |
| `npm run preview`   | Preview the production build locally              |
| `npx astro check`   | Type-check `.astro` files and content frontmatter |

## Project layout

```
src/
  content/            people · publications · figures · gallery  (content, as Markdown)
  content.config.ts   collection schemas + the research-topic vocabulary
  data/site.ts        site identity, contact, nav  ← EDIT THIS FIRST
  lib/content.ts       taxonomy labels/groups + query helpers
  components/          layout + UI
  pages/                one file per route
public/                 favicon set, CNAME, robots.txt
scripts/                citation refresh, ORCID enrichment, link check, CV importer
.github/workflows/      deploy.yml (Pages) + refresh-citations.yml (weekly Scholar counts)
```

See [SETUP.md](./SETUP.md) for going live (GitHub Pages, custom domain, citation-refresh secret).

## A note on figure copyright

The `figures` collection is gated: a figure renders only if its frontmatter sets `rightsConfirmed: true` (default `false`, fail-closed). Only mark figures `rightsConfirmed: true` if we have the right to post them (open-access/CC-licensed, or author-reuse rights).

## Status

- [x] Merge `lab-website-template` into this repo (history preserved from the old Jekyll site)
- [ ] Local setup (`npm install`, `npm run dev`)
- [ ] Fill in `src/data/site.ts` (lab identity, contact, nav)
- [ ] Populate Research, People, Publications pages
- [ ] Configure custom domain (or keep `emilialimlab.github.io`)
- [ ] Push and deploy to GitHub Pages
- [ ] Decide whether to backfill content (team bios, publications, images) from the old site — still in git history under this repo's earlier commits
