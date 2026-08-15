import { getCollection, type CollectionEntry } from "astro:content";

export type Person = CollectionEntry<"people">;
export type Publication = CollectionEntry<"publications">;

// Tag vocabulary (must match the `areas` enum in content.config.ts). A paper may
// carry several — a topic/population and a publication type.
export type AreaSlug =
  | "cancer-origins"
  | "cancer-prevention"
  | "aging-cancer-risk"
  | "review"
  | "letter";

export const AREA_LABELS: Record<AreaSlug, string> = {
  "cancer-origins": "How Do Cancers Begin?",
  "cancer-prevention": "How Can We Prevent Cancer?",
  "aging-cancer-risk": "Why Does Aging Increase Cancer Risk?",
  review: "Review",
  letter: "Letter / commentary",
};

// Research-page sections, grouped by topic, with blurbs.
export const RESEARCH_GROUPS: { title: string; areas: { slug: AreaSlug; blurb: string }[] }[] = [
  {
    title: "Research topics",
    areas: [
      {
        slug: "cancer-origins",
        blurb:
          "Mapping the impact of pollution exposure — uncovering how environmental exposures reshape lung tissue through integrated analyses of digital pathology, spatial 'omics, and single-cell sequencing.",
      },
      {
        slug: "cancer-prevention",
        blurb:
          "Developing strategies to prevent pollution-promoted lung cancer — testing pharmacologic interventions that can mitigate the effects of wood smoke and diesel exhaust in controlled human airway models.",
      },
      {
        slug: "aging-cancer-risk",
        blurb:
          "Defining the molecular basis of biological aging — using advanced molecular profiling and long-read sequencing to understand how environmental exposures shape aging and cancer susceptibility.",
      },
    ],
  },
];

/** Research-page groups → each area with its most-recent pubs (capped) + total count. */
export async function getResearchGroups(limit = 4) {
  const pubs = await getPublications();
  return RESEARCH_GROUPS.map((g) => ({
    title: g.title,
    areas: g.areas
      .map((a) => {
        const all = pubs.filter((p) => p.data.areas.includes(a.slug));
        return { slug: a.slug, label: AREA_LABELS[a.slug], blurb: a.blurb, pubs: all.slice(0, limit), total: all.length };
      })
      .filter((a) => a.total > 0),
  })).filter((g) => g.areas.length > 0);
}

// Display order of groups within the People page.
export const GROUP_ORDER = [
  "Faculty",
  "Researchers",
  "Staff",
  "Students",
  "Bioinformaticians",
  "Affiliates",
  "Alumni",
] as const;

const byOrder = (a: Person, b: Person) => a.data.order - b.data.order;

/** People grouped and ordered: current groups first, then Alumni. */
export async function getGroupedPeople() {
  const people = await getCollection("people");
  return GROUP_ORDER.map((group) => ({
    group,
    people: people.filter((p) => p.data.group === group).sort(byOrder),
  })).filter((g) => g.people.length > 0);
}

/** Publications newest-first. */
export async function getPublications() {
  const pubs = await getCollection("publications");
  return pubs.sort(
    (a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title),
  );
}

// --- author <-> person matching (best-effort, for profile pages) -----------

const normAlpha = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z]/g, "");

export interface PersonKey {
  initial: string;
  last: string;
}

export function personKey(name: string): PersonKey {
  const base = name.split(",")[0].trim(); // drop trailing credentials
  const toks = base.split(/\s+/);
  return {
    initial: (normAlpha(toks[0])[0] || ""),
    last: normAlpha(toks[toks.length - 1] || ""),
  };
}

/** Does a CV-style author string ("Miller GN", "Ortega-Marquez J") name this person? */
export function authorIsPerson(author: string, pk: PersonKey): boolean {
  if (!pk.last) return false;
  // Strip a trailing co-first/co-senior marker ("Lim EL*") before parsing —
  // otherwise the initials regex fails to match at all and silently falls
  // back to treating the whole string (including the author's own surname)
  // as the "last name" half, breaking the initial check below.
  const cleaned = author.trim().replace(/\*+$/, "");
  const m = cleaned.match(/^(.*?)\s+([A-Za-z]{1,4})$/);
  const wholeLast = normAlpha(m ? m[1] : cleaned);
  const initials = m ? m[2].toLowerCase() : "";
  // Suffix (not substring) match: personKey only captures a surname's last
  // token, so a compound citation surname like "Van Loo" (-> "vanloo") must
  // still match a person keyed on "Loo" (-> "loo"). A raw `.includes()` here
  // would also match "loo" against an unrelated surname like "Alonzo", so we
  // anchor to the end of the string instead.
  const lastOk = wholeLast.endsWith(pk.last);
  const initialOk = !pk.initial || !initials || initials[0] === pk.initial;
  return lastOk && initialOk;
}

/** Publications authored by a person, newest-first (best-effort name match). */
export function publicationsForPerson(person: Person, pubs: Publication[]) {
  const pk = personKey(person.data.name);
  return pubs.filter((p) => p.data.authors.some((a) => authorIsPerson(a, pk)));
}

// Everyone profiled is treated as a "mentee" for the publication badges EXCEPT
// the people listed here (typically the PI and senior faculty/collaborators).
// Use each person's slug = their markdown filename without ".md".
export const NON_MENTEE_SLUGS = new Set(["e-lim"]);

/** Build an `isMentee(authorString)` predicate from the people collection. */
export function menteeMatcher(people: Person[]) {
  const dir = people.map((p) => ({ slug: p.id, key: personKey(p.data.name) }));
  return (author: string) => {
    const d = dir.find((x) => authorIsPerson(author, x.key));
    return !!d && !NON_MENTEE_SLUGS.has(d.slug);
  };
}

const menteeLed = (p: Publication, isMentee: (a: string) => boolean) =>
  isMentee(p.data.authors[0] ?? "");

/**
 * Featured predicate: a mentee-led paper, or a PI first/senior paper from
 * 2019 on. Mentee status is membership-derived (see menteeMatcher).
 */
export function featuredMatcher(people: Person[]) {
  const isMentee = menteeMatcher(people);
  return (p: Publication) => {
    // Letters and reviews aren't "featured" primary research on the homepage.
    if (p.data.areas.includes("letter") || p.data.areas.includes("review")) return false;
    return menteeLed(p, isMentee) || (p.data.piFirstOrSenior && p.data.year >= 2019);
  };
}

/** Sort featured papers: mentee-led first, then most recent. */
export function featuredSorter(people: Person[]) {
  const isMentee = menteeMatcher(people);
  return (a: Publication, b: Publication) => {
    const diff = Number(menteeLed(b, isMentee)) - Number(menteeLed(a, isMentee));
    return diff || b.data.year - a.data.year;
  };
}
