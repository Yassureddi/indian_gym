/** Premium easing curves — GPU-friendly (transform + opacity only) */
export const EASE = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const DURATION = {
  fast: 0.35,
  base: 0.55,
  slow: 0.8,
  page: 0.45,
};

export const REVEAL_OFFSET = 36;

export type RevealVariant =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom";

export const REVEAL_VARIANTS: Record<
  RevealVariant,
  { hidden: Record<string, number>; visible: Record<string, number> }
> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: REVEAL_OFFSET },
    visible: { opacity: 1, y: 0 },
  },
  "slide-down": {
    hidden: { opacity: 0, y: -REVEAL_OFFSET },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: REVEAL_OFFSET },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -REVEAL_OFFSET },
    visible: { opacity: 1, x: 0 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

/** Map legacy FadeIn direction prop → Reveal variant */
export function directionToVariant(
  direction: "up" | "down" | "left" | "right"
): RevealVariant {
  const map = {
    up: "slide-up",
    down: "slide-down",
    left: "slide-left",
    right: "slide-right",
  } as const;
  return map[direction];
}
