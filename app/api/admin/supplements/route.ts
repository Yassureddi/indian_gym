import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError, jsonError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { createSupplement, getSupplements } from "@/lib/db/supplements";
import { fileToSupplementImagePath } from "@/lib/supplement-storage";
import { SUPPLEMENT_CATEGORIES, type SupplementCategory } from "@/lib/supplements";

const CATEGORY_IDS = new Set(SUPPLEMENT_CATEGORIES.map((c) => c.id));

function parseBenefits(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSupplementForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const category = String(formData.get("category") ?? "") as SupplementCategory;
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const discountRaw = String(formData.get("discountPrice") ?? "").trim();
  const discountPrice = discountRaw ? Number(discountRaw) : undefined;
  const stockQuantity = Number(formData.get("stockQuantity"));
  const weight = String(formData.get("weight") ?? "").trim();
  const flavor = String(formData.get("flavor") ?? "").trim();
  const benefits = parseBenefits(String(formData.get("benefits") ?? ""));
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const usageInstructions = String(formData.get("usageInstructions") ?? "").trim();
  const expiryDate = String(formData.get("expiryDate") ?? "").trim();
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  return {
    name,
    brand,
    category,
    description,
    price,
    discountPrice,
    stockQuantity,
    weight,
    flavor,
    benefits,
    ingredients,
    usageInstructions,
    expiryDate,
    isActive,
  };
}

function validateSupplementFields(
  fields: ReturnType<typeof parseSupplementForm>,
  requireImage: boolean,
  hasImage: boolean
) {
  if (!fields.name) return "Product name is required";
  if (!fields.brand) return "Brand is required";
  if (!CATEGORY_IDS.has(fields.category)) return "Valid category is required";
  if (!fields.description) return "Description is required";
  if (!Number.isFinite(fields.price) || fields.price <= 0) return "Valid price is required";
  if (
    fields.discountPrice != null &&
    (!Number.isFinite(fields.discountPrice) ||
      fields.discountPrice <= 0 ||
      fields.discountPrice >= fields.price)
  ) {
    return "Discount price must be less than regular price";
  }
  if (!Number.isFinite(fields.stockQuantity) || fields.stockQuantity < 0) {
    return "Valid stock quantity is required";
  }
  if (!fields.weight) return "Weight is required";
  if (!fields.flavor) return "Flavor is required";
  if (!fields.ingredients) return "Ingredients are required";
  if (!fields.usageInstructions) return "Usage instructions are required";
  if (!fields.expiryDate) return "Expiry date is required";
  if (requireImage && !hasImage) return "Product image is required";
  return null;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q")?.toLowerCase().trim() ?? "";
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let supplements = await getSupplements();
    const allSupplements = supplements;

    if (q) {
      supplements = supplements.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.brand.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }
    if (category && category !== "all") {
      supplements = supplements.filter((s) => s.category === category);
    }
    if (status === "active") {
      supplements = supplements.filter((s) => s.isActive);
    } else if (status === "inactive") {
      supplements = supplements.filter((s) => !s.isActive);
    } else if (status === "low_stock") {
      supplements = supplements.filter((s) => s.stockQuantity > 0 && s.stockQuantity <= 5);
    } else if (status === "out_of_stock") {
      supplements = supplements.filter((s) => s.stockQuantity <= 0);
    }

    const inventory = {
      totalProducts: allSupplements.length,
      activeProducts: allSupplements.filter((s) => s.isActive).length,
      totalStock: allSupplements.reduce((sum, s) => sum + s.stockQuantity, 0),
      lowStock: allSupplements.filter((s) => s.stockQuantity > 0 && s.stockQuantity <= 5).length,
      outOfStock: allSupplements.filter((s) => s.stockQuantity <= 0).length,
    };

    return NextResponse.json({ supplements, inventory });
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
    const fields = parseSupplementForm(formData);

    const validationError = validateSupplementFields(
      fields,
      true,
      file instanceof File && file.size > 0
    );
    if (validationError) return jsonError(validationError, 400);

    if (!file || !(file instanceof File)) {
      return jsonError("Product image is required", 400);
    }

    const saved = await fileToSupplementImagePath(file);
    if ("error" in saved) return jsonError(saved.error, 400);

    const supplement = await createSupplement({
      ...fields,
      image: saved.path,
    });

    return NextResponse.json({ supplement }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
