"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type MaskRevealProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Renders each word as a block so multi-line headings mask correctly. */
  animateOnMount?: boolean;
};

/**
 * Splits a string into words and reveals each one from behind an overflow mask.
 * Intended for display headings — pass plain text only.
 */
export function MaskReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  duration = 0.85,
  animateOnMount = false,
}: MaskRevealProps) {
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
      transition: { duration, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.span
      className={cn("inline", className)}
      variants={container}
      initial="hidden"
      {...(animateOnMount
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
    >
      {words.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className={cn("inline-flex overflow-hidden pb-[0.12em] align-bottom", wordClassName)}
        >
          <motion.span variants={word} className="inline-block will-change-transform">
            {value}
          </motion.span>
          {index < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </motion.span>
  );
}
