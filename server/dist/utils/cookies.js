const COOKIE_NAME = "auth_token";
export function setAuthCookie(res, token, rememberMe) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
        path: "/",
    });
}
export function clearAuthCookie(res) {
    res.clearCookie(COOKIE_NAME, { path: "/" });
}
export { COOKIE_NAME };
