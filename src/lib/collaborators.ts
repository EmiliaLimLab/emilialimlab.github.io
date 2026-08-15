import apel from "../assets/collaborators/apel.png";
import crick from "../assets/collaborators/crick.png";
import gsc from "../assets/collaborators/gsc.png";
import tfri from "../assets/collaborators/tfri.jpg";
import ubcMapcore from "../assets/collaborators/ubc-mapcore.jpg";
import ucolorado from "../assets/collaborators/ucolorado.jpg";

export type CollaboratorSlug = "apel" | "crick" | "gsc" | "tfri" | "ubc-mapcore" | "ucolorado";

// Display name + optional link for each collaborator logo. Referenced by
// slug from a publication's `collaborators:` frontmatter (content.config.ts).
export const COLLABORATORS: Record<
  CollaboratorSlug,
  { name: string; logo: ImageMetadata; url?: string }
> = {
  apel: { name: "Air Pollution Exposure Laboratory", logo: apel, url: "https://pollutionlab.com/" },
  crick: { name: "The Francis Crick Institute", logo: crick, url: "https://www.crick.ac.uk/" },
  gsc: {
    name: "Canada's Michael Smith Genome Sciences Centre",
    logo: gsc,
    url: "https://bcgsc.ca/",
  },
  tfri: {
    name: "Terry Fox Research Institute - The Environment and Lung Cancer",
    logo: tfri,
    url: "https://www.tfri.ca/our-research/research-project/the-environment-and-lung-cancer",
  },
  "ubc-mapcore": { name: "UBC MAPCore", logo: ubcMapcore, url: "https://mapcore.med.ubc.ca/" },
  ucolorado: {
    name: "University of Colorado Anschutz",
    logo: ucolorado,
    url: "https://medschool.cuanschutz.edu/biochemistry/people/primary-faculty/degregori-james",
  },
};
