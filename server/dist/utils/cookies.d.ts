import type { Response } from "express";
declare const COOKIE_NAME = "auth_token";
export declare function setAuthCookie(res: Response, token: string, rememberMe: boolean): void;
export declare function clearAuthCookie(res: Response): void;
export { COOKIE_NAME };
