"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap, ensureGsapPlugins } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";

interface GsapRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  variant?: "slide" | "zoom";
}

export default function GsapReveal({
  children,
  className,
  stagger = 0.1,
  variant = "slide",
}: GsapRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const items = el.children;
    if (items.length === 0) return;

    ensureGsapPlugins();

    const from =
      variant === "zoom"
        ? { opacity: 0, scale: 0.9 }
        : { opacity: 0, y: 48 };

    const ctx = gsap.context(() => {
      gsap.fromTo(items, from, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, variant, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
