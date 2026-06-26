import { getAuthToken } from "./cookies";
import { verifyToken } from "./jwt";
import { getUserById, toSessionUser } from "@/lib/db/users";
import type { SessionUser } from "./types";

export async function getSession(): Promise<SessionUser | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload?.sub) return null;

  const user = await getUserById(payload.sub);
  if (!user) return null;

  return toSessionUser(user);
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
