import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import { initializeDatabase } from "@/lib/db/init";
import { getBlogs } from "@/lib/db/blogs";
import { mapBlog } from "@/lib/api/mappers";

export async function GET() {
  try {
    await requireAdmin();
    await initializeDatabase();
    const blogs = await getBlogs();
    return NextResponse.json({ blogs: blogs.map(mapBlog) });
  } catch (error) {
    return handleAuthError(error);
  }
}
