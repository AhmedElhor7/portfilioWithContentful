import { Button as ButtonPrimitive } from "@base-ui/react/button";
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
        solid:
          "bg-ink text-paper hover:bg-accent hover:text-accent-foreground dark:bg-paper dark:text-ink dark:hover:bg-accent dark:hover:text-accent-foreground",
        outline:
          "border-border-strong text-ink hover:border-ink hover:bg-ink hover:text-paper dark:border-border-strong dark:text-paper dark:hover:border-paper dark:hover:bg-paper dark:hover:text-ink",
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

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    className?: string;
  };

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
