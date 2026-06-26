"use client";

import { useEffect } from "react";
import { ensureGsapPlugins } from "@/lib/animations/gsap";

export default function AnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    ensureGsapPlugins();
  }, []);

  return <>{children}</>;
}
