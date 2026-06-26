export interface JwtPayload {
    sub: string;
    email: string;
    name: string;
    role: "admin" | "member";
}
export declare function signToken(payload: JwtPayload, rememberMe?: boolean): string;
export declare function verifyToken(token: string): JwtPayload;
