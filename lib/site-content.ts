import fs from "fs/promises";
import path from "path";
import { readJson, writeJson } from "@/lib/db/store";
import {
  DEFAULT_ABOUT_PREVIEW_IMAGE,
  type SiteContent,
} from "@/lib/site-content.constants";

const SITE_CONTENT_FILE = "site-content.json";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "about");

export async function getSiteContent(): Promise<SiteContent> {
  return readJson<SiteContent>(SITE_CONTENT_FILE, {});
}

export async function getAboutPreviewImageUrl(): Promise<string> {
  const content = await getSiteContent();
  if (!content.aboutPreviewImage) {
    return DEFAULT_ABOUT_PREVIEW_IMAGE;
  }

  const filePath = path.join(process.cwd(), "public", content.aboutPreviewImage);
  try {
    await fs.access(filePath);
    const version = content.aboutPreviewUpdatedAt
      ? `?v=${encodeURIComponent(content.aboutPreviewUpdatedAt)}`
      : "";
    return `${content.aboutPreviewImage}${version}`;
  } catch {
    return DEFAULT_ABOUT_PREVIEW_IMAGE;
  }
}

export async function saveAboutPreviewImage(
  buffer: Buffer,
  extension: string
): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `about-preview.${extension}`;
  const relativePath = `/uploads/about/${filename}`;
  const absolutePath = path.join(UPLOAD_DIR, filename);

  await fs.writeFile(absolutePath, buffer);

  const updatedAt = new Date().toISOString();
  await writeJson<SiteContent>(SITE_CONTENT_FILE, {
    aboutPreviewImage: relativePath,
    aboutPreviewUpdatedAt: updatedAt,
  });

  return `${relativePath}?v=${encodeURIComponent(updatedAt)}`;
}
