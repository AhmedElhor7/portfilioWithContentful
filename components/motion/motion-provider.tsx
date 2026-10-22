"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";
import { MOTION_EASE_OUT_EXPO, MOTION_REDUCED_POLICY } from "./defines";

/**
 * @description Applies the shared transition curve and lets Motion follow the
 * visitor's `prefers-reduced-motion` setting across the app.
 * @param props React children to wrap.
 * @returns The configured Motion context.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion={MOTION_REDUCED_POLICY}
      transition={{ ease: MOTION_EASE_OUT_EXPO }}
    >
      {children}
    </MotionConfig>
  );
}
