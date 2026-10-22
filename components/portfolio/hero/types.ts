import type { ResolvedHero, SiteSettings } from "@/types";

/** A single label/value pair displayed next to the hero portrait. */
export interface HeroFact {
  label: string;
  value: string;
}

/**
 * @description Props for the hero section.
 */
export interface HeroProps {
  /** Hero copy with Contentful fallbacks already applied. */
  content: ResolvedHero;
  /** Site settings used for availability, the portrait and the fact list. */
  settings: SiteSettings | null;
}
