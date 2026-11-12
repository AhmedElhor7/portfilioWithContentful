import { unstable_cache } from "next/cache";
import {
  getAboutSection,
  getContactSection,
  getHeroSection,
  getProjects,
  getSiteSettings,
  resolveContactHeading,
  resolveHero,
} from "@/lib/contentful/portfolio";
import type {
  AboutSection,
  Project,
  ResolvedHero,
  SiteSettings,
} from "@/lib/contentful/types";
import { collectTechnologies } from "@/lib/portfolio";

/** The published portfolio data that the assistant is allowed to use. */
export interface PortfolioKnowledge {
  settings: SiteSettings | null;
  hero: ResolvedHero;
  about: AboutSection | null;
  contactHeading: string;
  contactMessage: string;
  projects: Project[];
  technologies: string[];
}

/**
 * @description Reads every published portfolio section in parallel. Image
 * metadata and entry ids are intentionally excluded: they add no answer value
 * and would only grow the prompt.
 * @returns The normalized portfolio knowledge.
 */
async function loadPortfolioKnowledge(): Promise<PortfolioKnowledge> {
  const [settings, hero, about, contact, projects] = await Promise.all([
    getSiteSettings(),
    getHeroSection(),
    getAboutSection(),
    getContactSection(),
    getProjects(),
  ]);

  return {
    settings,
    hero: resolveHero(hero),
    about,
    contactHeading: resolveContactHeading(contact),
    contactMessage: contact?.message ?? "",
    projects,
    technologies: collectTechnologies(projects),
  };
}

/**
 * @description Portfolio knowledge shared across chat requests. The cache is
 * revalidated every five minutes so new published Contentful entries reach the
 * assistant without querying Contentful on every message.
 */
export const getPortfolioKnowledge = unstable_cache(
  loadPortfolioKnowledge,
  ["portfolio-chatbot-knowledge"],
  { revalidate: 300 },
);

function addLine(lines: string[], label: string, value: string | null | undefined): void {
  const trimmed = value?.trim();
  if (!trimmed) return;
  lines.push(`${label}: ${trimmed}`);
}

function formatProject(project: Project, index: number): string[] {
  const lines = [`${index + 1}. ${project.name || "Untitled project"}`];

  addLine(lines, "   Description", project.description);

  if (project.technologies.length > 0) {
    addLine(lines, "   Technologies", project.technologies.join(", "));
  }

  addLine(lines, "   Demo", project.demoUrl);
  addLine(lines, "   Repository", project.repositoryUrl);

  return lines;
}

/**
 * @description Serializes the published knowledge as compact plain text. Empty
 * fields are omitted so the model never receives placeholders as facts.
 * @param knowledge The normalized portfolio knowledge.
 * @returns A prompt-ready description of the portfolio.
 */
export function serializePortfolioKnowledge(knowledge: PortfolioKnowledge): string {
  const lines: string[] = [];
  const { settings, hero, about, contactHeading, contactMessage, projects, technologies } =
    knowledge;

  if (settings) {
    addLine(lines, "Name", settings.siteName);
    addLine(lines, "Professional title", settings.professionalTitle);
    addLine(lines, "Location", settings.location);
    addLine(lines, "Site description", settings.siteDescription);
    addLine(lines, "Contact email", settings.contactEmail);
    addLine(lines, "GitHub", settings.gitHubUrl);
    addLine(lines, "LinkedIn", settings.linkedInUrl);

    if (settings.availabilityMessage) {
      addLine(lines, "Availability", settings.availabilityMessage);
    } else {
      lines.push(`Availability: ${settings.isAvailable ? "Yes" : "No"}`);
    }
  } else {
    lines.push("Site settings are not available.");
  }

  if (lines.length > 0) lines.push("");

  addLine(lines, "Hero headline", hero.headline);
  addLine(lines, "Hero introduction", hero.introduction);
  addLine(lines, "About heading", about?.heading);
  addLine(lines, "About description", about?.description);
  addLine(lines, "Contact heading", contactHeading);
  addLine(lines, "Contact message", contactMessage);

  lines.push("", "Projects:");

  if (projects.length === 0) {
    lines.push("No published projects are available.");
  } else {
    projects.forEach((project, index) => {
      lines.push(...formatProject(project, index));
    });
  }

  lines.push("", "Technologies used across published projects:");
  lines.push(technologies.length > 0 ? technologies.join(", ") : "No technologies are available.");

  return lines.join("\n").trim();
}
