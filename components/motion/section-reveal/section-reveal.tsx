"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { SECTION_REVEAL_DEFAULTS, SECTION_REVEAL_OFFSETS } from "./defines";
import type { SectionRevealProps } from "./types";

/**
 * @description Reveals a homepage section once when it enters the viewport using
 * Motion's scroll-triggered animations. Sections start slightly hidden and
 * offset, animate to their final position with opacity and transform, and
 * alternate direction by default. A fade-up is used where horizontal movement
 * feels unnatural. Already-visible sections on load appear immediately, and
 * visitors who prefer reduced motion never see the transition.
 * @param props Section content, direction, anchor id and layout classes.
 * @returns The section element with a one-shot scroll-triggered reveal.
 */
export function SectionReveal({
  children,
  direction,
  id,
  className,
  labelledBy,
}: SectionRevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <section id={id} aria-labelledby={labelledBy} className={cn(className)}>
        {children}
      </section>
    );
  }

  const offset = SECTION_REVEAL_OFFSETS[direction];

  return (
    <motion.section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(className)}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: SECTION_REVEAL_DEFAULTS.threshold, margin: SECTION_REVEAL_DEFAULTS.rootMargin }}
      transition={{
        duration: SECTION_REVEAL_DEFAULTS.duration,
        ease: SECTION_REVEAL_DEFAULTS.ease,
      }}
    >
      {children}
    </motion.section>
  );
}
