"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

const MINIMAL_LAYOUT_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/dashboard",
  "/admin",
];

function usesMinimalLayout(pathname: string) {
  return MINIMAL_LAYOUT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = usesMinimalLayout(pathname);

  if (minimal) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
