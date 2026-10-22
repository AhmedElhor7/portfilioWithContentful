import type { ReactNode } from "react";
import type { RevealDirection } from "@/types";

/**
 * @description Props for the {@link SectionReveal} wrapper.
 */
export interface SectionRevealProps {
  /** Section content. */
  children: ReactNode;
  /** Side the section enters from. */
  direction: RevealDirection;
  /** Anchor id, kept on the rendered `<section>`. */
  id?: string;
  /** Layout classes for the section (spacing, background, borders). */
  className?: string;
  /** Id of the element labelling the section, forwarded for assistive tech. */
  labelledBy?: string;
}
