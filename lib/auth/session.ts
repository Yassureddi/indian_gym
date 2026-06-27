import { getAuthToken } from "./cookies";
import { verifyToken } from "./jwt";
import { getUserById, toSessionUser } from "@/lib/db/users";
import { initializeDatabase } from "@/lib/db/init";
import type { SessionUser } from "./types";

function sessionFromJwt(payload: NonNullable<Awaited<ReturnType<typeof verifyToken>>>): SessionUser {
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    phone: "",
  };
}

export async function getSession(): Promise<SessionUser | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload?.sub) return null;

  try {
    await initializeDatabase();
    const user = await getUserById(payload.sub);
    if (user) {
      return toSessionUser(user);
    }
  } catch (error) {
    console.error("[session] Database lookup failed, using JWT fallback:", error);
  }

  return sessionFromJwt(payload);
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
