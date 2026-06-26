import { User } from "../models/User.model.js";
import { ResetToken } from "../models/ResetToken.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import { generateResetToken } from "../utils/token.js";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError, } from "../utils/ApiError.js";
function toPublicUser(user) {
    return {
        id: String(user._id),
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        goal: user.goal,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
}
function issueToken(user, rememberMe) {
    return signToken({
        sub: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
    }, rememberMe);
}
export const register = asyncHandler(async (req, res) => {
    const { name, email, phone, password, goal } = req.body;
    const existing = await User.findOne({
        $or: [{ email }, { phone }],
    });
    if (existing) {
        throw new ConflictError("Email or phone already registered");
    }
    const user = await User.create({
        name,
        email,
        phone,
        passwordHash: await hashPassword(password),
        role: "member",
        goal,
    });
    const token = issueToken(user, false);
    setAuthCookie(res, token, false);
    res.status(201).json({
        success: true,
        message: "Registration successful",
        data: { user: toPublicUser(user), token },
    });
});
export const login = asyncHandler(async (req, res) => {
    const { login, password, rememberMe = false } = req.body;
    const trimmed = String(login).trim();
    const query = trimmed.includes("@")
        ? { email: trimmed.toLowerCase() }
        : { phone: trimmed.replace(/\D/g, "") };
    const user = await User.findOne(query).select("+passwordHash");
    if (!user || !user.isActive) {
        throw new UnauthorizedError("Invalid credentials");
    }
    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
        throw new UnauthorizedError("Invalid credentials");
    }
    const token = issueToken(user, rememberMe);
    setAuthCookie(res, token, rememberMe);
    res.json({
        success: true,
        message: "Login successful",
        data: { user: toPublicUser(user), token },
    });
});
export const logout = asyncHandler(async (_req, res) => {
    clearAuthCookie(res);
    res.json({ success: true, message: "Logged out successfully" });
});
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.sub);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    res.json({ success: true, data: toPublicUser(user) });
});
export const updateProfile = asyncHandler(async (req, res) => {
    const updates = req.body;
    const userId = req.user.sub;
    if (updates.email || updates.phone) {
        const conflict = await User.findOne({
            _id: { $ne: userId },
            $or: [
                ...(updates.email ? [{ email: updates.email }] : []),
                ...(updates.phone ? [{ phone: updates.phone }] : []),
            ],
        });
        if (conflict) {
            throw new ConflictError("Email or phone already in use");
        }
    }
    const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new NotFoundError("User not found");
    }
    res.json({
        success: true,
        message: "Profile updated",
        data: toPublicUser(user),
    });
});
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.sub).select("+passwordHash");
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid) {
        throw new BadRequestError("Current password is incorrect");
    }
    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
});
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    let resetToken;
    if (user) {
        resetToken = generateResetToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await ResetToken.deleteMany({ userId: user._id });
        await ResetToken.create({ token: resetToken, userId: user._id, expiresAt });
        if (process.env.NODE_ENV !== "production") {
            console.log(`Password reset token for ${email}: ${resetToken}`);
        }
    }
    res.json({
        success: true,
        message: "If that email exists, a reset link has been sent",
        ...(resetToken && process.env.NODE_ENV !== "production"
            ? {
                resetUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`,
            }
            : {}),
    });
});
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const resetRecord = await ResetToken.findOne({ token });
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
        throw new BadRequestError("Invalid or expired reset token");
    }
    const user = await User.findById(resetRecord.userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    user.passwordHash = await hashPassword(password);
    await user.save();
    await ResetToken.deleteMany({ userId: user._id });
    res.json({ success: true, message: "Password reset successful" });
});
