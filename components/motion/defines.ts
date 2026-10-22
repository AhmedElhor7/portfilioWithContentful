/** Shared easing curve: a calm, decelerating "expo out". */
export const MOTION_EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Motion's reduced-motion policy. `"user"` disables travel animations for
 * visitors who ask for reduced motion while keeping non-motion feedback.
 */
export const MOTION_REDUCED_POLICY = "user" as const;
