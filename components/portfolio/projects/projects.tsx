import { cn } from "@/lib/utils";
import { SectionReveal } from "@/components/motion/section-reveal/section-reveal";
import { SectionHeading } from "@/components/portfolio/section-heading/section-heading";
import {
  PROJECTS_LABEL,
  PROJECTS_REVEAL_DIRECTION,
  PROJECTS_SECTION_ID,
  PROJECTS_TITLE,
} from "./defines";
import { ProjectCard } from "./project-card";
import type { ProjectsProps } from "./types";

/**
 * @description Selected work section. Renders nothing when the space has no
 * published projects.
 * @param props Published projects, section index and optional top spacing.
 * @returns The revealed projects grid.
 */
export function Projects({ projects, index, topSpacing = false }: ProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <SectionReveal
      id={PROJECTS_SECTION_ID}
      direction={PROJECTS_REVEAL_DIRECTION}
      className={cn(
        "shell section-spacing scroll-mt-24",
        topSpacing && "section-spacing-top",
      )}
      labelledBy={`${PROJECTS_SECTION_ID}-title`}
    >
      <SectionHeading
        index={index}
        label={PROJECTS_LABEL}
        title={PROJECTS_TITLE}
        titleId={`${PROJECTS_SECTION_ID}-title`}
      />

      <ul className="projects-grid">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </SectionReveal>
  );
}
