import { readJson, writeJson, createId } from "./store";
import type { ResetToken } from "@/lib/auth/types";

const FILE = "reset-tokens.json";

export async function getResetTokens(): Promise<ResetToken[]> {
  return readJson<ResetToken[]>(FILE, []);
}

export async function saveResetToken(token: ResetToken) {
  const tokens = await getResetTokens();
  const filtered = tokens.filter((t) => t.userId !== token.userId);
  filtered.push(token);
  await writeJson(FILE, filtered);
}

export async function getResetToken(token: string): Promise<ResetToken | null> {
  const tokens = await getResetTokens();
  const found = tokens.find((t) => t.token === token);
  if (!found) return null;
  if (new Date(found.expiresAt) < new Date()) return null;
  return found;
}

export async function deleteResetToken(token: string) {
  const tokens = await getResetTokens();
  await writeJson(
    FILE,
    tokens.filter((t) => t.token !== token)
  );
}

export function createResetToken(userId: string): ResetToken {
  return {
    token: createId("reset"),
    userId,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}
