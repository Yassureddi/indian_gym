import { ReactNode } from "react";
import styles from "./GlassCard.module.css";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export default function GlassCard({
  children,
  className,
  hover = true,
  padding = "md",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        styles.card,
        hover && styles.hover,
        styles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
