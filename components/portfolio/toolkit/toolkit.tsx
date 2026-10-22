import { SectionReveal } from "@/components/motion/section-reveal/section-reveal";
import { SectionHeading } from "@/components/portfolio/section-heading/section-heading";
import { Badge } from "@/components/ui/badge";
import { TOOLKIT_LABEL, TOOLKIT_REVEAL_DIRECTION, TOOLKIT_SECTION_ID, TOOLKIT_TITLE } from "./defines";
import type { ToolkitProps } from "./types";

/**
 * @description Toolkit section: the technologies used by the published projects,
 * shown as a list of badges. Renders nothing when there are no projects.
 * @param props Technologies and section index.
 * @returns The revealed toolkit section.
 */
export function Toolkit({ technologies, index }: ToolkitProps) {
  if (technologies.length === 0) return null;

  return (
    <SectionReveal
      id={TOOLKIT_SECTION_ID}
      direction={TOOLKIT_REVEAL_DIRECTION}
      className="shell section-spacing"
      labelledBy={`${TOOLKIT_SECTION_ID}-title`}
    >
      <SectionHeading
        index={index}
        label={TOOLKIT_LABEL}
        title={TOOLKIT_TITLE}
        titleId={`${TOOLKIT_SECTION_ID}-title`}
      >
        <ul className="toolkit-list">
          {technologies.map((technology) => (
            <li key={technology}>
              <Badge variant="default">{technology}</Badge>
            </li>
          ))}
        </ul>
      </SectionHeading>
    </SectionReveal>
  );
}
