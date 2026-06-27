import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getStoreSales } from "@/lib/db/store-sales";
import { isThisMonth, isThisWeek, isToday } from "@/lib/store-pos";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await initializeDatabase();

    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q")?.toLowerCase().trim() ?? "";
    const period = searchParams.get("period") ?? "all";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let sales = await getStoreSales();

    if (q) {
      sales = sales.filter(
        (s) =>
          s.customerName.toLowerCase().includes(q) ||
          s.mobile.includes(q) ||
          s.invoiceNumber.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    if (period === "today") {
      sales = sales.filter((s) => isToday(s.createdAt));
    } else if (period === "week") {
      sales = sales.filter((s) => isThisWeek(s.createdAt));
    } else if (period === "month") {
      sales = sales.filter((s) => isThisMonth(s.createdAt));
    } else if (period === "custom" && from && to) {
      const start = new Date(from);
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      sales = sales.filter((s) => {
        const d = new Date(s.createdAt);
        return d >= start && d <= end;
      });
    }

    return NextResponse.json({ sales });
  } catch (error) {
    return handleAuthError(error);
  }
}
