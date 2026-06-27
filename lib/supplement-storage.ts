import fs from "fs/promises";
import path from "path";
import { createId } from "@/lib/db/store";
import {
  ALLOWED_IMAGE_TYPES,
  extensionForMime,
  MAX_ABOUT_IMAGE_BYTES,
} from "@/lib/site-content.constants";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "supplements");

export const MAX_SUPPLEMENT_IMAGE_BYTES = MAX_ABOUT_IMAGE_BYTES;

export function validateSupplementImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only JPG, PNG, or WebP images are allowed";
  }
  if (file.size > MAX_SUPPLEMENT_IMAGE_BYTES) {
    return "Image must be 5MB or smaller";
  }
  return null;
}

export async function fileToSupplementImagePath(
  file: File
): Promise<{ path: string } | { error: string }> {
  const validationError = validateSupplementImage(file);
  if (validationError) return { error: validationError };

  const extension = extensionForMime(file.type);
  if (!extension) return { error: "Unsupported image type" };

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${createId("sup")}.${extension}`;
    const relativePath = `/uploads/supplements/${filename}`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return { path: relativePath };
  } catch {
    const base64 = buffer.toString("base64");
    return { path: `data:${file.type};base64,${base64}` };
  }
}

export async function deleteSupplementImageIfLocal(src: string): Promise<void> {
  if (!src.startsWith("/uploads/supplements/")) return;
  const filePath = path.join(process.cwd(), "public", src.split("?")[0]);
  try {
    await fs.unlink(filePath);
  } catch {
    // File may already be removed
  }
}
