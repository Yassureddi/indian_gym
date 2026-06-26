export type UserRole = "admin" | "member";

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  goal?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar?: string;
  goal?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}

export type MembershipStatus = "active" | "expired" | "pending";

export interface MemberMembership {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  amount: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
}

export interface WorkoutExercise {
  name: string;
  sets: string;
  reps: string;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  exercises: WorkoutExercise[];
  assignedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DietMeal {
  time: string;
  items: string;
  calories?: number;
}

export interface DietPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  meals: DietMeal[];
  assignedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResetToken {
  token: string;
  userId: string;
  expiresAt: string;
}
