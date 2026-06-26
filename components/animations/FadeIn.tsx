"use client";

import { ReactNode } from "react";
import Reveal from "./Reveal";
import { directionToVariant } from "@/lib/animations/config";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  variant?: "fade" | "zoom";
  className?: string;
  duration?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  variant,
  className,
  duration,
}: FadeInProps) {
  const revealVariant = variant ?? directionToVariant(direction);

  return (
    <Reveal
      variant={revealVariant}
      delay={delay}
      className={className}
      duration={duration}
    >
      {children}
    </Reveal>
  );
}
