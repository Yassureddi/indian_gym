"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { DURATION, EASE } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.out },
  },
};

export default function StaggerChildren({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0,
}: StaggerChildrenProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

// Remove unused container export warning - export for external use
export { container, item };
