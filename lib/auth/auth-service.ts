import { signToken } from "@/lib/auth/jwt";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import {
  createUser,
  ensureSeedUsers,
  findUserByLogin,
  getUserById,
  toSessionUser,
  updateUser,
} from "@/lib/db/users";
import {
  createResetToken,
  deleteResetToken,
  getResetToken,
  saveResetToken,
} from "@/lib/db/reset-tokens";
import { initializeDatabase } from "@/lib/db/init";

export async function loginUser(body: {
  login: string;
  password: string;
  rememberMe?: boolean;
}) {
  await initializeDatabase();
  const user = await findUserByLogin(body.login);
  if (!user) return null;

  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) return null;

  const expiresIn = body.rememberMe ? "30d" : "7d";
  const token = await signToken(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    expiresIn
  );

  return { token, user: toSessionUser(user) };
}

export async function getUserProfile(userId: string) {
  await initializeDatabase();
  const user = await getUserById(userId);
  return user ? toSessionUser(user) : null;
}

export async function updateUserProfile(
  userId: string,
  updates: { name?: string; email?: string; phone?: string; goal?: string }
) {
  await initializeDatabase();
  const user = await updateUser(userId, updates);
  return user ? toSessionUser(user) : null;
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  await initializeDatabase();
  const user = await getUserById(userId);
  if (!user) return { ok: false as const, error: "User not found" };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return { ok: false as const, error: "Current password is incorrect" };

  await updateUser(userId, { passwordHash: await hashPassword(newPassword) });
  return { ok: true as const };
}

export async function requestPasswordReset(email: string) {
  await initializeDatabase();
  const { getUserByEmail } = await import("@/lib/db/users");
  const user = await getUserByEmail(email);
  if (!user) {
    return { message: "If an account exists, a reset link has been generated." };
  }

  const reset = createResetToken(user.id);
  await saveResetToken(reset);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${reset.token}`;

  return {
    message: "If an account exists, a reset link has been generated.",
    resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
  };
}

export async function resetUserPassword(token: string, password: string) {
  await initializeDatabase();
  const reset = await getResetToken(token);
  if (!reset) return { ok: false as const, error: "Invalid or expired reset token" };

  await updateUser(reset.userId, { passwordHash: await hashPassword(password) });
  await deleteResetToken(token);
  return { ok: true as const, message: "Password updated successfully" };
}

export async function registerMember(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  goal?: string;
}) {
  await initializeDatabase();
  const { getUserByEmail, getUserByPhone } = await import("@/lib/db/users");
  if (await getUserByEmail(data.email)) {
    return { ok: false as const, error: "Email already registered" };
  }
  if (await getUserByPhone(data.phone)) {
    return { ok: false as const, error: "Phone already registered" };
  }

  const user = await createUser({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    role: "member",
    goal: data.goal,
  });

  return { ok: true as const, user: toSessionUser(user) };
}
