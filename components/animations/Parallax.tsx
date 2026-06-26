"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap, ensureGsapPlugins } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Scroll speed multiplier — keep low for 60fps */
  speed?: number;
  direction?: "y" | "x";
}

export default function Parallax({
  children,
  className,
  speed = 0.12,
  direction = "y",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      const prop = direction === "y" ? "yPercent" : "xPercent";
      gsap.to(el, {
        [prop]: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed, direction, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
