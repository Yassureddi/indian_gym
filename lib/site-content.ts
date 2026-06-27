import fs from "fs/promises";
import path from "path";
import SiteContentModel from "@/models/SiteContent";
import { ensureDb, toPlain } from "@/lib/db/mongo-helpers";
import {
  DEFAULT_ABOUT_PREVIEW_IMAGE,
  type SiteContent,
} from "@/lib/site-content.constants";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "about");
const SITE_CONTENT_KEY = "default";

export async function getSiteContent(): Promise<SiteContent> {
  await ensureDb();
  const doc = await SiteContentModel.findOne({ key: SITE_CONTENT_KEY }).lean();
  const content = toPlain<SiteContent & { key?: string }>(doc);
  if (!content) return {};
  const { key: _key, ...rest } = content;
  return rest;
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
  await ensureDb();
  await SiteContentModel.findOneAndUpdate(
    { key: SITE_CONTENT_KEY },
    {
      key: SITE_CONTENT_KEY,
      aboutPreviewImage: relativePath,
      aboutPreviewUpdatedAt: updatedAt,
    },
    { upsert: true, new: true }
  );

  return `${relativePath}?v=${encodeURIComponent(updatedAt)}`;
}
