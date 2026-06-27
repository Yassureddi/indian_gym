import fs from "fs/promises";
import path from "path";
import { createId } from "@/lib/db/store";
import {
  ALLOWED_IMAGE_TYPES,
  extensionForMime,
  MAX_ABOUT_IMAGE_BYTES,
} from "@/lib/site-content.constants";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "trainers");

export const MAX_TRAINER_IMAGE_BYTES = MAX_ABOUT_IMAGE_BYTES;

export function validateTrainerImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only JPG, PNG, or WebP images are allowed";
  }
  if (file.size > MAX_TRAINER_IMAGE_BYTES) {
    return "Image must be 5MB or smaller";
  }
  return null;
}

export async function saveTrainerImage(buffer: Buffer, extension: string): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${createId("trainer")}.${extension}`;
  const relativePath = `/uploads/trainers/${filename}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return relativePath;
}

export async function fileToTrainerImagePath(
  file: File
): Promise<{ path: string } | { error: string }> {
  const validationError = validateTrainerImage(file);
  if (validationError) return { error: validationError };

  const extension = extensionForMime(file.type);
  if (!extension) return { error: "Unsupported image type" };

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const imagePath = await saveTrainerImage(buffer, extension);
    return { path: imagePath };
  } catch {
    const base64 = buffer.toString("base64");
    return { path: `data:${file.type};base64,${base64}` };
  }
}
