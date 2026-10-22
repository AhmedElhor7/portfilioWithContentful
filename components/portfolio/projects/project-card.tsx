import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContentfulImage } from "@/components/ui/contentful-image";
import { cn } from "@/lib/utils";
import {
  PROJECT_CARD_FEATURED_LABEL,
  PROJECT_CARD_IMAGE,
  PROJECT_CARD_LINK_LABELS,
} from "./defines";
import type { ProjectCardProps, ProjectLink } from "./types";

/**
 * @description Renders one published project: cover (or a typographic fallback),
 * summary, technologies and the links that actually exist in Contentful.
 * @param props The project to render and optional wrapper classes.
 * @returns A project card article.
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  const candidates: Array<ProjectLink | null> = [
    project.demoUrl ? { label: PROJECT_CARD_LINK_LABELS.demo, href: project.demoUrl } : null,
    project.repositoryUrl
      ? { label: PROJECT_CARD_LINK_LABELS.repository, href: project.repositoryUrl }
      : null,
  ];

  const links = candidates.filter((link): link is ProjectLink => link !== null);

  return (
    <article className={cn("project-card", className)}>
      <div className="project-card-media">
        {project.coverImage ? (
          <ContentfulImage
            src={project.coverImage.url}
            alt={project.coverImage.alt}
            width={project.coverImage.width}
            height={project.coverImage.height}
            renderedWidth={PROJECT_CARD_IMAGE.renderedWidth}
            quality={PROJECT_CARD_IMAGE.quality}
            className="project-card-image"
          />
        ) : (
          <div aria-hidden className="project-card-media-fallback">
            <span className="project-card-initial">{project.name.charAt(0)}</span>
          </div>
        )}

        {project.featured ? (
          <span className="project-card-featured">
            <Badge variant="solid" size="sm">
              {PROJECT_CARD_FEATURED_LABEL}
            </Badge>
          </span>
        ) : null}

        <div className="project-card-fade" />
      </div>

      <div className="project-card-body">
        <h3 className="project-card-title">{project.name}</h3>

        {project.description ? (
          <p className="project-card-description">{project.description}</p>
        ) : null}

        {project.technologies.length > 0 ? (
          <ul className="project-card-techs">
            {project.technologies.map((technology) => (
              <li key={technology}>
                <Badge variant="outline" size="sm">
                  {technology}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}

        {links.length > 0 ? (
          <div className="project-card-footer">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${link.label}: ${project.name} (opens in a new tab)`}
                className="project-card-link"
              >
                {link.label}
                <ArrowUpRight aria-hidden className="project-card-link-icon" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
