"use client";

import * as React from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_EASE_OUT_EXPO } from "./defines";

type MaskRevealProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
};

/**
 * Runs before the browser paints on the client, and is skipped during SSR so the
 * server markup never renders clipped text.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * @description Splits a string into words and reveals each one from behind an
 * overflow mask. Intended for display headings, so pass plain text only. The
 * server markup stays readable; the hidden state is only applied on the client
 * right before the animation starts.
 * @param props Text, styling hooks and timing overrides.
 * @returns The masked heading content.
 */
export function MaskReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  duration = 0.85,
}: MaskRevealProps) {
  const reducedMotion = useReducedMotion();
  const controls = useAnimationControls();
  const words = React.useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const word = {
    hidden: { y: "115%" },
    visible: {
      y: "0%",
      transition: { duration, ease: MOTION_EASE_OUT_EXPO },
    },
  };

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;

    controls.set("hidden");
    void controls.start("visible");
  }, [controls, reducedMotion]);

  return (
    <motion.span
      className={cn("inline", className)}
      variants={container}
      initial={false}
      animate={controls}
    >
      {words.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className={cn("inline-flex overflow-hidden pb-[0.12em] align-bottom", wordClassName)}
        >
          <motion.span variants={word} className="inline-block will-change-transform">
            {value}
          </motion.span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}
