import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { fileToGalleryPath } from "@/lib/gallery-storage";
import type { GalleryCategory } from "@/lib/gallery";
import { initializeDatabase } from "@/lib/db/init";
import { createGalleryItem, getGalleryItems } from "@/lib/db/gallery";
import { mapGalleryItem } from "@/lib/api/mappers";

const CATEGORIES = new Set<GalleryCategory>([
  "gym",
  "workout",
  "equipment",
  "members",
  "events",
]);

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();
    const items = await getGalleryItems();
    return NextResponse.json({
      items: items.map(mapGalleryItem),
      total: items.length,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const formData = await request.formData();
    const file = formData.get("image");
    const alt = String(formData.get("alt") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim() as GalleryCategory;
    const tall = formData.get("tall") === "true" || formData.get("tall") === "on";
    const isPublished = formData.get("isPublished") === "on";

    if (!file || !(file instanceof File)) {
      return jsonError("Image file is required", 400);
    }
    if (!alt) {
      return jsonError("Image description is required", 400);
    }
    if (!CATEGORIES.has(category)) {
      return jsonError("Valid category is required", 400);
    }

    const saved = await fileToGalleryPath(file);
    if ("error" in saved) {
      return jsonError(saved.error, 400);
    }

    const item = await createGalleryItem({
      src: saved.path,
      alt,
      category,
      tall,
      isPublished,
    });

    return NextResponse.json({ item: mapGalleryItem(item) }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
