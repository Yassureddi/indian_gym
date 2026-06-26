import type { Payment } from "@/lib/admin/types";
import type { MemberMembership } from "@/lib/auth/types";
import type { BlogItem } from "@/lib/blog";
import type { GalleryItem } from "@/lib/gallery";
import type { Trainer } from "@/lib/trainers";
import type { SessionUser } from "@/lib/auth/types";

export function mapUser(user: {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: "admin" | "member";
  avatar?: string;
  goal?: string;
  gender?: string;
  age?: number;
  joiningDate?: string;
}): SessionUser {
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

export function mapPayment(record: Payment) {
  return { ...record };
}

export function mapMembership(record: MemberMembership | null) {
  if (!record) return null;
  return { ...record };
}

export function mapBlog(record: BlogItem) {
  return { ...record };
}

export function mapTrainer(record: Trainer) {
  return { ...record };
}

export function mapGalleryItem(record: GalleryItem) {
  return { ...record };
}
