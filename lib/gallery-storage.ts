import fs from "fs/promises";
import path from "path";
import { createId } from "@/lib/db/store";
import {
  ALLOWED_IMAGE_TYPES,
  extensionForMime,
  MAX_ABOUT_IMAGE_BYTES,
} from "@/lib/site-content.constants";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "gallery");

export const MAX_GALLERY_IMAGE_BYTES = MAX_ABOUT_IMAGE_BYTES;

export function validateGalleryFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only JPG, PNG, or WebP images are allowed";
  }
  if (file.size > MAX_GALLERY_IMAGE_BYTES) {
    return "Image must be 5MB or smaller";
  }
  return null;
}

export async function saveGalleryImage(buffer: Buffer, extension: string): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${createId("gal")}.${extension}`;
  const relativePath = `/uploads/gallery/${filename}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return relativePath;
}

export async function deleteGalleryImageIfLocal(src: string): Promise<void> {
  if (!src.startsWith("/uploads/gallery/")) return;
  const filePath = path.join(process.cwd(), "public", src.split("?")[0]);
  try {
    await fs.unlink(filePath);
  } catch {
    // File may already be removed
  }
}

export async function fileToGalleryPath(file: File): Promise<{ path: string } | { error: string }> {
  const validationError = validateGalleryFile(file);
  if (validationError) return { error: validationError };

  const extension = extensionForMime(file.type);
  if (!extension) return { error: "Unsupported image type" };

  const buffer = Buffer.from(await file.arrayBuffer());
  const imagePath = await saveGalleryImage(buffer, extension);
  return { path: imagePath };
}
