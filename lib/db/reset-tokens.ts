import ResetTokenModel from "@/models/ResetToken";
import { ensureDb, toPlain } from "./mongo-helpers";
import { createId } from "./store";
import type { ResetToken } from "@/lib/auth/types";

export async function getResetTokens(): Promise<ResetToken[]> {
  await ensureDb();
  const docs = await ResetTokenModel.find().lean();
  return docs.map((d) => toPlain<ResetToken>(d)!);
}

export async function saveResetToken(token: ResetToken) {
  await ensureDb();
  await ResetTokenModel.deleteMany({ userId: token.userId });
  await ResetTokenModel.create(token);
}

export async function getResetToken(token: string): Promise<ResetToken | null> {
  await ensureDb();
  const doc = await ResetTokenModel.findOne({ token }).lean();
  const found = toPlain<ResetToken>(doc);
  if (!found) return null;
  if (new Date(found.expiresAt) < new Date()) return null;
  return found;
}

export async function deleteResetToken(token: string) {
  await ensureDb();
  await ResetTokenModel.deleteOne({ token });
}

export function createResetToken(userId: string): ResetToken {
  return {
    token: createId("reset"),
    userId,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}
