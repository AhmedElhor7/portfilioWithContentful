import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-mono text-[0.6875rem] leading-none font-medium tracking-[0.12em] uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "border-border-strong text-ink-soft",
        accent: "border-accent/30 bg-accent-soft text-accent",
        // `ink`/`paper` invert with the theme; no `dark:` overrides are needed.
        solid: "border-transparent bg-ink text-paper",
        outline: "border-border text-muted-foreground",
      },
      size: {
        default: "px-2.5 py-1",
        sm: "px-2 py-0.5 text-[0.625rem]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

/**
 * @description Small label used for technologies and the featured marker.
 * @param props Variant, size, classes and span attributes.
 * @returns The badge element.
 */
function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge };
