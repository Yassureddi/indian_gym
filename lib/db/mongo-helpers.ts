import { connectDB } from "@/lib/mongodb";

/** Ensure MongoDB is connected before any data operation. */
export async function ensureDb(): Promise<void> {
  await connectDB();
}

/** Strip MongoDB internals from a lean document. */
export function toPlain<T>(doc: object | null | undefined): T | null {
  if (!doc) return null;
  const d = doc as Record<string, unknown>;
  const { _id, __v, ...rest } = d;
  return rest as T;
}

export function toPlainList<T>(docs: object[]): T[] {
  return docs.map((doc) => toPlain<T>(doc)!);
}
