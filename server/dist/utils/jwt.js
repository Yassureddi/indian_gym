import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
const JWT_ISSUER = "kn-raju-fitness";
const JWT_AUDIENCE = "kn-raju-fitness-users";
export function signToken(payload, rememberMe = false) {
    const expiresIn = rememberMe ? env.jwtRememberExpiresIn : env.jwtExpiresIn;
    const options = {
        expiresIn: expiresIn,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    };
    return jwt.sign(payload, env.jwtSecret, options);
}
export function verifyToken(token) {
    return jwt.verify(token, env.jwtSecret, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });
}
