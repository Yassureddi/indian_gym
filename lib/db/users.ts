import UserModel from "@/models/User";
import { ensureDb, toPlain, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import { hashPassword } from "@/lib/auth/password";
import type { User, SessionUser } from "@/lib/auth/types";

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    goal: user.goal,
    gender: user.gender,
    age: user.age,
    joiningDate: user.joiningDate,
  };
}

export async function getMembers(): Promise<User[]> {
  await ensureDb();
  const docs = await UserModel.find({ role: "member" }).lean();
  return toPlainList<User>(docs);
}

export async function getUsers(): Promise<User[]> {
  await ensureDb();
  const docs = await UserModel.find().lean();
  return toPlainList<User>(docs);
}

export async function saveUsers(users: User[]) {
  await ensureDb();
  await UserModel.deleteMany({});
  if (users.length > 0) {
    await UserModel.insertMany(users);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  await ensureDb();
  const doc = await UserModel.findOne({ id }).lean();
  return toPlain<User>(doc);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await ensureDb();
  const normalized = email.toLowerCase().trim();
  const doc = await UserModel.findOne({ email: normalized }).lean();
  return toPlain<User>(doc);
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  await ensureDb();
  const normalized = phone.replace(/\D/g, "");
  const users = await getUsers();
  return users.find((u) => u.phone.replace(/\D/g, "") === normalized) ?? null;
}

export async function findUserByLogin(login: string): Promise<User | null> {
  const trimmed = login.trim();
  if (trimmed.includes("@")) {
    return getUserByEmail(trimmed);
  }
  return getUserByPhone(trimmed);
}

export async function updateUser(
  id: string,
  updates: Partial<
    Pick<User, "name" | "phone" | "email" | "goal" | "avatar" | "passwordHash" | "gender" | "age" | "joiningDate">
  >
): Promise<User | null> {
  await ensureDb();
  const doc = await UserModel.findOneAndUpdate(
    { id },
    { ...updates, updatedAt: new Date().toISOString() },
    { new: true }
  ).lean();
  return toPlain<User>(doc);
}

export async function createUser(data: {
  email: string;
  phone: string;
  name: string;
  password: string;
  role: User["role"];
  goal?: string;
  gender?: string;
  age?: number;
  joiningDate?: string;
}): Promise<User> {
  await ensureDb();
  const now = new Date().toISOString();
  const user: User = {
    id: createId("user"),
    email: data.email.toLowerCase().trim(),
    phone: data.phone.trim(),
    name: data.name.trim(),
    passwordHash: await hashPassword(data.password),
    role: data.role,
    goal: data.goal,
    gender: data.gender,
    age: data.age,
    joiningDate: data.joiningDate,
    createdAt: now,
    updatedAt: now,
  };
  await UserModel.create(user);
  return user;
}

/** Pre-computed bcrypt hashes so demo login works on serverless cold starts. */
const DEMO_ADMIN_HASH =
  "$2b$12$dZHC8NHZoQ631AhiARumt.gTb.58aSzN2yoKg97SWlAZUOKwZJWTq";
const DEMO_MEMBER_HASH =
  "$2b$12$sMh/osFM1GJRUjr4Vip5Te7g/8pJelHWHvffQWVFK.BtxImUPB/vu";

export async function ensureSeedUsers() {
  await ensureDb();
  const now = new Date().toISOString();

  const seeds = [
    {
      id: "user_admin_demo",
      email: "admin@gym.com",
      phone: "9999999999",
      name: "Gym Admin",
      passwordHash: DEMO_ADMIN_HASH,
      role: "admin" as const,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "user_member_demo",
      email: "member@gym.com",
      phone: "8142113631",
      name: "Demo Member",
      passwordHash: DEMO_MEMBER_HASH,
      role: "member" as const,
      goal: "Muscle Gain",
      gender: "Male",
      age: 28,
      joiningDate: now.split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const user of seeds) {
    await UserModel.findOneAndUpdate({ id: user.id }, user, { upsert: true });
  }
}
