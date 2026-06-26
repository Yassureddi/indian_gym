import { SignJWT, jwtVerify } from "jose";
import type { JwtPayload } from "./types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "kn-raju-fitness-dev-secret-change-in-production"
);

const ISSUER = "kn-raju-fitness";
const AUDIENCE = "kn-raju-fitness-users";

export async function signToken(
  payload: JwtPayload,
  expiresIn: string
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as JwtPayload["role"],
    };
  } catch {
    return null;
  }
}
