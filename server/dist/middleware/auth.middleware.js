import { UnauthorizedError, ForbiddenError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";
import { COOKIE_NAME } from "../utils/cookies.js";
function extractToken(req) {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
        return header.slice(7);
    }
    const cookieToken = req.cookies?.[COOKIE_NAME];
    if (cookieToken)
        return cookieToken;
    return null;
}
export function authenticate(req, _res, next) {
    const token = extractToken(req);
    if (!token) {
        return next(new UnauthorizedError());
    }
    try {
        req.user = verifyToken(token);
        next();
    }
    catch {
        next(new UnauthorizedError("Invalid or expired token"));
    }
}
export function authorize(...roles) {
    return (req, _res, next) => {
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
