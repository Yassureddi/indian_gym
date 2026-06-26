import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: "admin" | "member";
}

const JWT_ISSUER = "kn-raju-fitness";
const JWT_AUDIENCE = "kn-raju-fitness-users";

export function signToken(
  payload: JwtPayload,
  rememberMe = false
): string {
  const expiresIn = rememberMe ? env.jwtRememberExpiresIn : env.jwtExpiresIn;
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  }) as JwtPayload;
}
