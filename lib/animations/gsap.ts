import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsapPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ limitCallbacks: true });
  registered = true;
}

export { gsap, ScrollTrigger };
