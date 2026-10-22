import type { RevealDirection } from "@/types";
import { MOTION_EASE_OUT_EXPO } from "../defines";

/**
 * Timing and geometry shared by every section reveal.
 * Section-specific directions live in each section's `defines.ts`.
 */
export const SECTION_REVEAL_DEFAULTS = {
  /** Horizontal travel in pixels; intentionally small so the motion stays subtle. */
  distance: 32,
  duration: 1.1,
  ease: MOTION_EASE_OUT_EXPO,
  /** Fraction of the section that must be visible before it reveals. */
  threshold: 0.2,
  /** Keeps the reveal from firing while the section is still entering the viewport. */
  rootMargin: "0px 0px -8% 0px",
  /**
   * A section whose top is already above this fraction of the viewport on mount
   * is shown immediately instead of being hidden and animated.
   */
  visibleViewportRatio: 0.85,
} as const;

/** Supported directions mapped to their offsets. */
export const SECTION_REVEAL_OFFSETS: Record<RevealDirection, { x: number; y: number }> = {
  left: { x: -SECTION_REVEAL_DEFAULTS.distance, y: 0 },
  right: { x: SECTION_REVEAL_DEFAULTS.distance, y: 0 },
  up: { x: 0, y: SECTION_REVEAL_DEFAULTS.distance },
};
