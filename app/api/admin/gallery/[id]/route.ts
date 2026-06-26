import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { deleteGalleryImageIfLocal } from "@/lib/gallery-storage";
import type { GalleryCategory } from "@/lib/gallery";
import { initializeDatabase } from "@/lib/db/init";
import {
  deleteGalleryItem,
  getGalleryItemById,
  updateGalleryItem,
} from "@/lib/db/gallery";
import { mapGalleryItem } from "@/lib/api/mappers";

const CATEGORIES = new Set<GalleryCategory>([
  "gym",
  "workout",
  "equipment",
  "members",
  "events",
]);

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const body = await request.json();
    const updates: Parameters<typeof updateGalleryItem>[1] = {};

    if (body.alt !== undefined) updates.alt = String(body.alt).trim();
    if (body.category !== undefined) {
      const category = String(body.category) as GalleryCategory;
      if (!CATEGORIES.has(category)) {
        return jsonError("Invalid category", 400);
      }
      updates.category = category;
    }
    if (body.tall !== undefined) updates.tall = Boolean(body.tall);
    if (body.isPublished !== undefined) updates.isPublished = Boolean(body.isPublished);
    if (body.sortOrder !== undefined) updates.sortOrder = Number(body.sortOrder);

    if (Object.keys(updates).length === 0) {
      return jsonError("No updates provided", 400);
    }

    const item = await updateGalleryItem(id, updates);
    if (!item) return jsonError("Gallery item not found", 404);

    return NextResponse.json({ item: mapGalleryItem(item) });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const existing = await getGalleryItemById(id);
    if (!existing) return jsonError("Gallery item not found", 404);

    await deleteGalleryItem(id);
    if (existing.src) {
      await deleteGalleryImageIfLocal(existing.src);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
