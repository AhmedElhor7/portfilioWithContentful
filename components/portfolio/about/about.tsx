import { SectionReveal } from "@/components/motion/section-reveal/section-reveal";
import { SectionHeading } from "@/components/portfolio/section-heading/section-heading";
import { ABOUT_LABEL, ABOUT_REVEAL_DIRECTION, ABOUT_SECTION_ID } from "./defines";
import type { AboutProps } from "./types";

/**
 * @description About section. The heading and description come from Contentful,
 * so nothing is rendered when either value is missing.
 * @param props Published entry and section index.
 * @returns The revealed about section.
 */
export function About({ section, index }: AboutProps) {
  const titleId = section.heading ? `${ABOUT_SECTION_ID}-title` : undefined;

  return (
    <SectionReveal
      id={ABOUT_SECTION_ID}
      direction={ABOUT_REVEAL_DIRECTION}
      className="shell section-spacing"
      labelledBy={titleId}
    >
      <SectionHeading
        index={index}
        label={ABOUT_LABEL}
        title={section.heading || undefined}
        titleId={titleId}
        description={section.description || undefined}
      />
    </SectionReveal>
  );
}
