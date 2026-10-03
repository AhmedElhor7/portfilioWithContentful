"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { href: "/", label: "Index" },
  { href: "/posts", label: "Journal" },
  { href: "/#work", label: "Work" },
  { href: "/#contact", label: "Contact" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 12);
  });

  React.useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <motion.header
      initial={reducedMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || menuOpen
          ? "bg-background/85 border-border border-b backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
        >
          <span className="font-serif text-[1.05rem] leading-none font-semibold tracking-[-0.02em]">
            Ada Whitfield
          </span>
          <span className="text-accent font-serif text-[1.05rem] leading-none italic transition-transform duration-500 group-hover:-rotate-12">
            ✳
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 font-mono text-[0.75rem] tracking-[0.1em] uppercase transition-colors duration-300",
                  "focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:outline-none",
                  active ? "text-ink" : "text-muted-foreground hover:text-ink",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="bg-muted absolute inset-0 -z-10 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={cn(
              "border-border text-ink hover:border-border-strong grid size-9 place-items-center rounded-full border",
              "transition-colors duration-300 outline-none md:hidden",
              "focus-visible:ring-2 focus-visible:ring-ring/45",
            )}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <motion.div
        id="mobile-nav"
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden md:hidden"
      >
        <nav className="shell flex flex-col gap-1 py-4" aria-label="Mobile">
          {NAV_ITEMS.map((item, index) => (
            <motion.div
              key={item.href}
              initial={reducedMotion ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: menuOpen ? 1 : 0, x: menuOpen ? 0 : -12 }}
              transition={{ duration: 0.35, delay: menuOpen ? index * 0.05 : 0 }}
            >
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "font-serif text-[1.6rem] tracking-[-0.02em] transition-colors",
                  isActive(pathname, item.href) ? "text-accent" : "text-ink hover:text-accent",
                )}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
}
