import type { AboutSection, SectionIndex } from "@/types";

/**
 * @description Props for the about section.
 */
export interface AboutProps {
  /** Published about entry. */
  section: AboutSection;
  /** Zero-padded position among the rendered sections. */
  index: SectionIndex;
}
