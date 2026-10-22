"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Vertical travel in pixels in each direction; keep it small. */
  distance?: number;
};

/**
 * @description Shifts its content vertically as it scrolls through the viewport.
 * Disabled automatically when the visitor prefers reduced motion.
 * @param props Content, wrapper classes and travel distance.
 * @returns The parallax wrapper.
 */
export function Parallax({ children, className, distance = 60 }: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reducedMotion ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
