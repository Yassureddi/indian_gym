import { readJson, writeJson, createId } from "./store";
import { hashPassword } from "@/lib/auth/password";
import type { User, SessionUser } from "@/lib/auth/types";

const USERS_FILE = "users.json";

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
  const users = await getUsers();
  return users.filter((u) => u.role === "member");
}

export async function getUsers(): Promise<User[]> {
  return readJson<User[]>(USERS_FILE, []);
}

export async function saveUsers(users: User[]) {
  await writeJson(USERS_FILE, users);
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  const normalized = email.toLowerCase().trim();
  return users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  const users = await getUsers();
  const normalized = phone.replace(/\D/g, "");
  return (
    users.find((u) => u.phone.replace(/\D/g, "") === normalized) ?? null
  );
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
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveUsers(users);
  return users[index];
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
  const users = await getUsers();
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
  users.push(user);
  await saveUsers(users);
  return user;
}

export async function ensureSeedUsers() {
  const users = await getUsers();
  if (users.length > 0) return;

  const now = new Date().toISOString();
  const adminHash = await hashPassword("Admin@123");
  const memberHash = await hashPassword("Member@123");

  const seedUsers: User[] = [
    {
      id: "user_admin_demo",
      email: "admin@gym.com",
      phone: "9999999999",
      name: "Gym Admin",
      passwordHash: adminHash,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "user_member_demo",
      email: "member@gym.com",
      phone: "8142113631",
      name: "Demo Member",
      passwordHash: memberHash,
      role: "member",
      goal: "Muscle Gain",
      gender: "Male",
      age: 28,
      joiningDate: now.split("T")[0],
      createdAt: now,
      updatedAt: now,
    },
  ];

  await saveUsers(seedUsers);
}
