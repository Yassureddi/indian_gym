import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { handleAuthError } from "@/lib/auth/api";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_ABOUT_IMAGE_BYTES,
  extensionForMime,
} from "@/lib/site-content.constants";
import { saveAboutPreviewImage } from "@/lib/site-content";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Image file is required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only JPG, PNG, or WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_ABOUT_IMAGE_BYTES) {
      return NextResponse.json(
        { success: false, message: "Image must be 5MB or smaller" },
        { status: 400 }
      );
    }

    const extension = extensionForMime(file.type);
    if (!extension) {
      return NextResponse.json(
        { success: false, message: "Unsupported image type" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveAboutPreviewImage(buffer, extension);

    return NextResponse.json({
      success: true,
      message: "About image updated",
      url,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
