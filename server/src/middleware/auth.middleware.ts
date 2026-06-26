import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../utils/ApiError.js";
import { verifyToken, type JwtPayload } from "../utils/jwt.js";
import { COOKIE_NAME } from "../utils/cookies.js";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  const cookieToken = req.cookies?.[COOKIE_NAME];
  if (cookieToken) return cookieToken;
  return null;
}

export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) {
    return next(new UnauthorizedError());
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
}

export function authorize(...roles: Array<"admin" | "member">) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError());
    }
    next();
  };
}

export const adminOnly = authorize("admin");
export const memberOrAdmin = authorize("admin", "member");
