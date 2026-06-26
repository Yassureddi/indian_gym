"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import {
  DURATION,
  EASE,
  REVEAL_VARIANTS,
  type RevealVariant,
} from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

export default function Reveal({
  children,
  variant = "slide-up",
  delay = 0,
  duration = DURATION.slow,
  className,
  once = true,
  amount = 0.15,
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const motionVariant = REVEAL_VARIANTS[variant];

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={motionVariant.hidden}
      whileInView={motionVariant.visible}
      viewport={{ once, amount, margin: "0px 0px -40px 0px" }}
      transition={{
        duration,
        delay,
        ease: EASE.out,
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
