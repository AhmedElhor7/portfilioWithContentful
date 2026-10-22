import type { Project } from "@/lib/contentful/types";
import type { SectionId } from "@/types";

/**
 * @description Technologies used across the published projects, de-duplicated
 * case-insensitively and kept in project order.
 * @param projects The projects rendered on the homepage.
 * @returns Unique technology names suitable for the toolkit list.
 */
export function collectTechnologies(projects: Project[]): string[] {
  const seen = new Set<string>();
  const technologies: string[] = [];

  for (const project of projects) {
    for (const technology of project.technologies) {
      const key = technology.toLowerCase();
      if (seen.has(key)) continue;

      seen.add(key);
      technologies.push(technology);
    }
  }

  return technologies;
}

/**
 * @description The numbered sections that actually render, in page order.
 * Contact is always present because the contact section has fallback copy.
 * @param available Which optional sections have content.
 * @returns Section ids in display order.
 */
export function buildSectionOrder(available: {
  about: boolean;
  projects: boolean;
  toolkit: boolean;
}): SectionId[] {
  return [
    available.about ? "about" : null,
    available.projects ? "work" : null,
    available.toolkit ? "toolkit" : null,
    "contact",
  ].filter((section): section is SectionId => section !== null);
}

/**
 * @description Zero-padded position of a section among the sections that render,
 * so the visible sequence never skips a number.
 * @param order Section ids in display order.
 * @param section The section to number.
 * @returns A value such as `"02"`, or an empty string when the section is absent.
 */
export function getSectionIndex(order: readonly SectionId[], section: SectionId): string {
  const index = order.indexOf(section);
  return index === -1 ? "" : String(index + 1).padStart(2, "0");
}
