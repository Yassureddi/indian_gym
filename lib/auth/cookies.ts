import { cookies } from "next/headers";

export const AUTH_COOKIE = "auth_token";

export const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const SESSION_MAX_AGE = 60 * 60 * 24; // 1 day

export async function setAuthCookie(token: string, rememberMe: boolean) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: rememberMe ? REMEMBER_ME_MAX_AGE : SESSION_MAX_AGE,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value;
}
