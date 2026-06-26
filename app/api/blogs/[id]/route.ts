import { NextResponse } from "next/server";
import { fetchBlogById } from "@/lib/api/content";
import { jsonError } from "@/lib/auth/api";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const blog = await fetchBlogById(id);

  if (!blog) {
    return jsonError("Blog not found", 404);
  }

  return NextResponse.json({ blog });
}
