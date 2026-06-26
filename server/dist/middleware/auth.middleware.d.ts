import type { Request, Response, NextFunction } from "express";
import { type JwtPayload } from "../utils/jwt.js";
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void;
export declare function authorize(...roles: Array<"admin" | "member">): (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare const adminOnly: (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare const memberOrAdmin: (req: AuthRequest, _res: Response, next: NextFunction) => void;
