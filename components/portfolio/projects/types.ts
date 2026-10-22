import type { Project, SectionIndex } from "@/types";

/**
 * @description Props for the projects section.
 */
export interface ProjectsProps {
  /** Published projects, already ordered by Contentful. */
  projects: Project[];
  /** Zero-padded position among the rendered sections. */
  index: SectionIndex;
  /**
   * Adds top spacing when the about section above is absent. The about section
   * already provides the gap between the two sections.
   */
  topSpacing?: boolean;
}

/**
 * @description Props for a single project card.
 */
export interface ProjectCardProps {
  /** Published project. */
  project: Project;
  /** Extra classes for the card wrapper. */
  className?: string;
}

/** A resolved project link rendered in the card footer. */
export interface ProjectLink {
  label: string;
  href: string;
}
