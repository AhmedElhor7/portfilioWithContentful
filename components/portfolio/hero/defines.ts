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

/** Contentful Image API options for the portrait. Below the `lg` breakpoint it
 * spans the column up to 28rem; from `lg` it fills the hero's right column
 * (about 25rem at the widest shell). */
export const HERO_PROFILE_IMAGE = {
  renderedWidth: 480,
  quality: 74,
  sizes: "(min-width: 1024px) 25rem, min(28rem, 100vw)",
} as const;
