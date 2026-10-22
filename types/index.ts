/**
 * @description Shared domain models and cross-component contracts.
 * Component-specific types stay in each component's `types.ts`.
 */
export type {
  AboutSection,
  ContactSection,
  HeroSection,
  ImageAsset,
  Project,
  ResolvedHero,
  SiteSettings,
} from "@/lib/contentful/types";

/** Zero-padded section position, e.g. `"01"`. Empty when the section is not numbered. */
export type SectionIndex = string;

/** Identities of the homepage sections that can be anchored and numbered. */
export type SectionId = "about" | "work" | "toolkit" | "contact";

/** Horizontal direction used by the scroll reveals. */
export type RevealDirection = "left" | "right" | "up";
