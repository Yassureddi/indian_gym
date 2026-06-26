"use client";

import { useEffect, useRef } from "react";
import { gsap, ensureGsapPlugins } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  /** Element to use as scroll trigger; defaults to counter itself */
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 2.2,
  className,
  triggerRef,
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

    if (reducedMotion) {
      counter.textContent = String(value);
      return;
    }

    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        counter,
        { innerText: 0 },
        {
          innerText: value,
          duration,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: triggerRef?.current ?? counter,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [value, duration, reducedMotion, triggerRef]);

  return (
    <span className={className}>
      <span ref={counterRef}>0</span>
      {suffix}
    </span>
  );
}
