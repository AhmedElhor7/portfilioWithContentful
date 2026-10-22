import type { SectionIndex } from "@/types";

/**
 * @description Props for the contact section.
 */
export interface ContactProps {
  /** Heading, resolved from Contentful with its agreed fallback. */
  heading: string;
  /** Supporting copy; omitted when the entry has none. */
  message: string;
  /** Public email address used for the primary action. */
  email: string;
  /** GitHub profile URL, when published in the settings entry. */
  gitHubUrl: string | null;
  /** Zero-padded position among the rendered sections. */
  index: SectionIndex;
}
