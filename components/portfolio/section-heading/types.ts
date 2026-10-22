import type { ReactNode } from "react";
import type { SectionIndex } from "@/types";

/** Heading alignment: stacked on the left, or index/label opposite the actions. */
export type SectionHeadingAlign = "left" | "between";

/**
 * @description Props for the shared section heading used by the portfolio sections.
 */
export interface SectionHeadingProps {
  /** Zero-padded position, e.g. `"01"`. */
  index: SectionIndex;
  /** Short label shown next to the rule (e.g. "Work"). */
  label: string;
  /** Main heading; omitted when Contentful has no copy. */
  title?: ReactNode;
  /** Id applied to the heading so the surrounding section can reference it. */
  titleId?: string;
  /** Supporting paragraph; omitted when Contentful has no copy. */
  description?: ReactNode;
  /** Layout variant. */
  align?: SectionHeadingAlign;
  /** Extra classes for the heading block. */
  className?: string;
  /** Optional trailing content, such as the toolkit list. */
  children?: ReactNode;
}
