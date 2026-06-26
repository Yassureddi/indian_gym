"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { DURATION, EASE } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  lift?: number;
  scale?: number;
}

export default function HoverLift({
  children,
  className,
  lift = 6,
  scale = 1.02,
}: HoverLiftProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: -lift, scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: DURATION.fast, ease: EASE.out }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
