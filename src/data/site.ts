// Site-wide singletons (identity, contact, social, navigation).
// Kept here rather than in a content collection so layout components can
// import them directly.
//
// ⚙️  EDIT THIS FIRST: replace every placeholder below with your lab's details.
//    (Tip: ask Claude to "fill in src/data/site.ts for my lab" and paste your
//    name, institution, and a one-line mission.)

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  pi: string;
  institution: string;
  centre: string;
  university: string;
  url: string;
  description: string;
  email: string;
  social: {
    scholar?: string;
    twitter?: string;
    github?: string;
  };
  nav: NavItem[];
}

export const site: SiteConfig = {
  name: "Environmental Oncogenomics",
  shortName: "Lim Lab",
  pi: "Emilia Lim, PhD",
  institution: "Department of Biochemistry and Molecular Biology",
  centre: "Edwin SH Leong Centre for Healthy Aging",
  university: "The University of British Columbia",
  // Your production URL (used for canonical links + sitemap).
  url: "https://emilialimlab.github.io",
  description:
    "The Lim Lab investigates how environmental pollutants shape the genomics, " +
    "transcriptomics, and epigenomics of cells to drive age-related disease, using " +
    "multi-omic approaches in cancer patients and pollution-exposed individuals.",
  email: "emilia.lim@ubc.ca",
  social: {
    scholar: "https://scholar.google.com/citations?user=O34k-7EAAAAJ&hl=en",
    github: "https://github.com/EmiliaLimLab",
  },
  nav: [
    { label: "People", href: "/people" },
    { label: "Research", href: "/research" },
    { label: "Publications", href: "/publications" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
};
