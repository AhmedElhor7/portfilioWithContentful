import type { SectionIndex } from "@/types";

/**
 * @description Props for the toolkit section.
 */
export interface ToolkitProps {
  /** Technologies collected from the published projects. */
  technologies: string[];
  /** Zero-padded position among the rendered sections. */
  index: SectionIndex;
}
