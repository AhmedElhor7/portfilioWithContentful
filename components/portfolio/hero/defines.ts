import type { RevealDirection } from "@/types";

/** Anchor id for the opening section. */
export const HERO_SECTION_ID = "top";

/** Hero is the first section, so its reveal enters from the left. */
export const HERO_REVEAL_DIRECTION: RevealDirection = "left";

/** Labels for the facts list, which pairs CMS values with their meaning. */
export const HERO_FACT_LABELS = {
  role: "Role",
  location: "Based in",
  status: "Status",
} as const;

/** Contentful Image API options for the portrait. */
export const HERO_PROFILE_IMAGE = {
  renderedWidth: 480,
  quality: 74,
  sizes: "16rem",
} as const;
