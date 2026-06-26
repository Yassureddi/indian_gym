import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "kn-raju-fitness-dev-secret-change-in-production"
);

const AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password"];
const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: "kn-raju-fitness",
      audience: "kn-raju-fitness-users",
    });
    return payload as { sub?: string; role?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const payload = token ? await verifyAuthToken(token) : null;
  const isAuthenticated = Boolean(payload?.sub);

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminRoute = pathname.startsWith("/admin");

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && isAuthenticated && payload?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    const dest = payload?.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/forgot-password",
    "/reset-password",
  ],
};
