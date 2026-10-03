import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

type SectionHeadingProps = {
  index: string;
  label: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "between";
  className?: string;
  children?: React.ReactNode;
};

export function SectionHeading({
  index,
  label,
  title,
  description,
  align = "between",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "border-border flex flex-col gap-6 border-t pt-8",
        align === "between" && "lg:flex-row lg:items-end lg:justify-between lg:gap-16",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "between" && "lg:max-w-3xl")}>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span aria-hidden className="bg-border-strong h-px w-6" />
          {label}
        </p>
        {title ? (
          <h2 className="text-display mt-5 text-ink">{title}</h2>
        ) : null}
        {description ? (
          <p className="text-ink-soft mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </Reveal>
  );
}
