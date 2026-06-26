"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { DURATION, EASE } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.99,
  },
};

const reducedVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const reducedMotion = useReducedMotion();
  const variants = reducedMotion ? reducedVariants : pageVariants;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{
        duration: DURATION.page,
        ease: EASE.out,
      }}
      style={{ willChange: reducedMotion ? undefined : "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
