import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-[var(--radius-md)] border border-border bg-transparent px-3",
        "font-sans text-[0.9375rem] text-ink placeholder:text-muted-foreground",
        "transition-colors duration-200 outline-none",
        "hover:border-border-strong",
        "focus-visible:border-ink focus-visible:ring-1 focus-visible:ring-ink/20 dark:focus-visible:border-paper dark:focus-visible:ring-paper/20",
        "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
