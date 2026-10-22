import { cn } from "@/lib/utils";
import { SECTION_HEADING_DEFAULT_ALIGN } from "./defines";
import type { SectionHeadingProps } from "./types";

/**
 * @description Renders the eyebrow, title and description shared by the numbered
 * portfolio sections. Headings are server-rendered; the section itself owns the
 * scroll reveal so children are never animated twice.
 * @param props Section index, labels and optional trailing content.
 * @returns The section heading block.
 */
export function SectionHeading({
  index,
  label,
  title,
  titleId,
  description,
  align = SECTION_HEADING_DEFAULT_ALIGN,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn("section-heading", className)} data-align={align}>
      <div className="section-heading-body">
        <p className="eyebrow section-eyebrow">
          <span className="text-accent">{index}</span>
          <span aria-hidden className="eyebrow-rule" />
          {label}
        </p>
        {title ? (
          <h2 id={titleId} className="section-heading-title">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="section-lede section-heading-description">{description}</p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}
