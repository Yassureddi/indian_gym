import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import {
  deleteSupplement,
  getSupplementById,
  updateSupplement,
} from "@/lib/db/supplements";
import { deleteSupplementImageIfLocal, fileToSupplementImagePath } from "@/lib/supplement-storage";
import { SUPPLEMENT_CATEGORIES, type SupplementCategory } from "@/lib/supplements";
import { notifyStockLevelChange } from "@/lib/notifications/events";

const CATEGORY_IDS = new Set(SUPPLEMENT_CATEGORIES.map((c) => c.id));

type RouteContext = { params: Promise<{ id: string }> };

function parseBenefits(raw: unknown): string[] | undefined {
  if (raw == null) return undefined;
  return String(raw)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const existing = await getSupplementById(id);
    if (!existing) return jsonError("Supplement not found", 404);

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image");
      const updates: Parameters<typeof updateSupplement>[1] = {};

      const fields = [
        "name",
        "brand",
        "category",
        "description",
        "weight",
        "flavor",
        "ingredients",
        "usageInstructions",
        "expiryDate",
      ] as const;

      for (const field of fields) {
        const value = formData.get(field);
        if (value != null && String(value).trim()) {
          (updates as Record<string, unknown>)[field] = String(value).trim();
        }
      }

      if (formData.get("price") != null) updates.price = Number(formData.get("price"));
      if (formData.get("discountPrice") != null) {
        const raw = String(formData.get("discountPrice")).trim();
        updates.discountPrice = raw ? Number(raw) : undefined;
      }
      if (formData.get("stockQuantity") != null) {
        updates.stockQuantity = Number(formData.get("stockQuantity"));
      }
      if (formData.get("benefits") != null) {
        updates.benefits = parseBenefits(formData.get("benefits")) ?? [];
      }
      if (formData.has("isActive")) {
        updates.isActive =
          formData.get("isActive") === "on" || formData.get("isActive") === "true";
      }

      if (updates.category && !CATEGORY_IDS.has(updates.category as SupplementCategory)) {
        return jsonError("Invalid category", 400);
      }

      if (file instanceof File && file.size > 0) {
        const saved = await fileToSupplementImagePath(file);
        if ("error" in saved) return jsonError(saved.error, 400);
        updates.image = saved.path;
        if (existing.image) await deleteSupplementImageIfLocal(existing.image);
      }

      const supplement = await updateSupplement(id, updates);
      if (!supplement) return jsonError("Supplement not found", 404);
      if (updates.stockQuantity != null) {
        await notifyStockLevelChange(
          id,
          supplement.name,
          existing.stockQuantity,
          supplement.stockQuantity
        );
      }
      return NextResponse.json({ supplement });
    }

    const body = await request.json();
    const updates: Parameters<typeof updateSupplement>[1] = {};

    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.brand !== undefined) updates.brand = String(body.brand).trim();
    if (body.category !== undefined) {
      if (!CATEGORY_IDS.has(body.category)) return jsonError("Invalid category", 400);
      updates.category = body.category;
    }
    if (body.description !== undefined) updates.description = String(body.description).trim();
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.discountPrice !== undefined) {
      updates.discountPrice = body.discountPrice ? Number(body.discountPrice) : undefined;
    }
    if (body.stockQuantity !== undefined) updates.stockQuantity = Number(body.stockQuantity);
    if (body.weight !== undefined) updates.weight = String(body.weight).trim();
    if (body.flavor !== undefined) updates.flavor = String(body.flavor).trim();
    if (body.benefits !== undefined) updates.benefits = body.benefits;
    if (body.ingredients !== undefined) updates.ingredients = String(body.ingredients).trim();
    if (body.usageInstructions !== undefined) {
      updates.usageInstructions = String(body.usageInstructions).trim();
    }
    if (body.expiryDate !== undefined) updates.expiryDate = String(body.expiryDate).trim();
    if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);

    if (Object.keys(updates).length === 0) {
      return jsonError("No updates provided", 400);
    }

    const supplement = await updateSupplement(id, updates);
    if (!supplement) return jsonError("Supplement not found", 404);
    if (updates.stockQuantity !== undefined) {
      await notifyStockLevelChange(
        id,
        supplement.name,
        existing.stockQuantity,
        supplement.stockQuantity
      );
    }
    return NextResponse.json({ supplement });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { id } = await context.params;
    const existing = await getSupplementById(id);
    if (!existing) return jsonError("Supplement not found", 404);

    await deleteSupplement(id);
    if (existing.image) await deleteSupplementImageIfLocal(existing.image);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
