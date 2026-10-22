"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { readTheme, serverTheme, subscribeToTheme, writeTheme } from "@/components/layout/theme-store";
import { THEME_TOGGLE_LABELS } from "./defines";
import type { ThemeToggleProps } from "./types";

/**
 * @description Toggles between the light and dark tokens and persists the choice.
 * The accessible name states the action, and the icon swap is skipped when the
 * visitor prefers reduced motion.
 * @param props Optional extra classes.
 * @returns The theme toggle button.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = React.useSyncExternalStore(subscribeToTheme, readTheme, serverTheme);
  const reducedMotion = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => writeTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? THEME_TOGGLE_LABELS.toLight : THEME_TOGGLE_LABELS.toDark}
      className={cn(
        "border-border text-ink-soft hover:border-border-strong hover:text-ink",
        "relative grid size-9 place-items-center overflow-hidden rounded-full border",
        "transition-colors duration-300 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={reducedMotion ? false : { y: 14, opacity: 0, rotate: -35 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={reducedMotion ? undefined : { y: -14, opacity: 0, rotate: 35 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center"
        >
          {isDark ? <Moon aria-hidden className="size-4" /> : <Sun aria-hidden className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
