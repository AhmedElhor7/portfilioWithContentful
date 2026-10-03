import * as React from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import { ContentfulImage } from "./contentful-image";

type AvatarProps = React.ComponentProps<"div"> & {
  name?: string | null;
  picture?: string | null;
  size?: "sm" | "default" | "lg";
};

const sizeClasses = {
  sm: "size-7 text-[0.625rem]",
  default: "size-9 text-[0.6875rem]",
  lg: "size-12 text-xs",
} as const;

const imageClasses = {
  sm: "size-7",
  default: "size-9",
  lg: "size-12",
} as const;

function Avatar({ name, picture, size = "default", className, ...props }: AvatarProps) {
  const label = name?.trim() || "Anonymous";

  return (
    <div
      data-slot="avatar"
      className={cn(
        "border-border bg-muted relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {picture ? (
        <ContentfulImage
          src={picture}
          alt={label}
          renderedWidth={size === "lg" ? 96 : 72}
          quality={60}
          width={96}
          height={96}
          className={cn("h-full w-full object-cover", imageClasses[size])}
        />
      ) : (
        <span
          aria-hidden
          className="text-ink-soft font-mono font-medium tracking-[0.08em] select-none"
        >
          {initials(label)}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export { Avatar };
