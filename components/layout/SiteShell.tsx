"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import AnimationProvider from "@/components/animations/AnimationProvider";
import PageTransition from "@/components/animations/PageTransition";

const AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password"];
const PANEL_ROUTES = ["/dashboard", "/admin"];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function usesMinimalLayout(pathname: string) {
  return matchesRoute(pathname, AUTH_ROUTES) || matchesRoute(pathname, PANEL_ROUTES);
}

function usesAuthShell(pathname: string) {
  return matchesRoute(pathname, AUTH_ROUTES);
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = usesMinimalLayout(pathname);

  if (minimal) {
    if (usesAuthShell(pathname)) {
      return <div className="auth-shell">{children}</div>;
    }
    return <>{children}</>;
  }

  return (
    <AnimationProvider>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={pathname}>{children}</PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </AnimationProvider>
  );
}
