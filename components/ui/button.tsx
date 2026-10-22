import Link from "next/link";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "font-mono text-[0.75rem] font-medium tracking-[0.08em] uppercase",
    "border border-transparent transition-all duration-300 ease-[var(--ease-out-expo)]",
    "outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-45",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  ],
  {
    variants: {
      variant: {
        // `ink` and `paper` invert with the theme, so these need no `dark:` overrides:
        // dark text on light paper in light mode, light text on dark paper in dark mode.
        solid: "bg-ink text-paper hover:bg-accent hover:text-accent-foreground",
        outline: "border-border-strong text-ink hover:border-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink-soft hover:text-ink hover:bg-muted",
        accent: "bg-accent text-accent-foreground hover:brightness-110",
        underline:
          "h-auto rounded-none px-0 text-ink hover:text-accent focus-visible:ring-0 focus-visible:ring-offset-0 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-[var(--ease-out-expo)] hover:after:origin-left hover:after:scale-x-100",
        link: "h-auto rounded-none px-0 text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-[var(--radius-sm)] px-3",
        default: "h-10 rounded-[var(--radius-md)] px-4",
        lg: "h-12 rounded-[var(--radius-lg)] px-6 text-[0.8125rem]",
        icon: "size-10 rounded-[var(--radius-md)]",
        "icon-sm": "size-8 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  },
);

export type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  /** Destination; same-origin paths and hashes use the Next.js router. */
  href: string;
  children: ReactNode;
  className?: string;
  /** Absolute http(s) destination that should open in a new tab. */
  external?: boolean;
  "aria-label"?: string;
};

/**
 * @description Navigation call to action styled as a button. Renders a Next.js
 * link for in-page routes and a plain anchor for mail and external URLs, so the
 * result always keeps native link semantics.
 * @param props Destination, variant, size and link attributes.
 * @returns The styled anchor or Next.js link.
 */
export function ButtonLink({
  href,
  children,
  className,
  variant,
  size,
  external = false,
  ...props
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const routed = href.startsWith("/") || href.startsWith("#");

  if (routed) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
