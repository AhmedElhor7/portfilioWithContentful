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
        solid: "border-transparent bg-ink text-paper dark:bg-paper dark:text-ink",
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

export { Badge, badgeVariants };
