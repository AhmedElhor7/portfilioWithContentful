import type { RevealDirection } from "@/types";

/** Anchor id used by the "Work" navigation link. */
export const PROJECTS_SECTION_ID = "work";

/** Third section in the page order, so it enters from the left. */
export const PROJECTS_REVEAL_DIRECTION: RevealDirection = "left";

/** Label shown in the section eyebrow. */
export const PROJECTS_LABEL = "Work";

/** Section heading. */
export const PROJECTS_TITLE = "Selected work";

/** Contentful Image API options for project covers. The grid is a single
 * column until the `lg` breakpoint (1024px), where it becomes three columns,
 * so the cover never needs more than about a third of the viewport width. */
export const PROJECT_CARD_IMAGE = {
  renderedWidth: 900,
  quality: 68,
  sizes: "(min-width: 1024px) 33vw, 100vw",
} as const;

/** Badge shown on featured projects. */
export const PROJECT_CARD_FEATURED_LABEL = "Featured";

/** Visible labels for the project links. */
export const PROJECT_CARD_LINK_LABELS = {
  demo: "Live demo",
  repository: "Repository",
} as const;
