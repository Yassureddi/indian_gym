import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getStoreSaleById } from "@/lib/db/store-sales";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await initializeDatabase();
    const { id } = await context.params;
    const sale = await getStoreSaleById(id);
    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }
    return NextResponse.json({ sale });
  } catch (error) {
    return handleAuthError(error);
  }
}
