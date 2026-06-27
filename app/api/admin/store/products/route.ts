import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getActiveSupplements } from "@/lib/db/supplements";

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();
    const products = await getActiveSupplements();
    return NextResponse.json({ products });
  } catch (error) {
    return handleAuthError(error);
  }
}
