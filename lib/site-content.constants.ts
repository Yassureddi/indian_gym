export const ABOUT_GYM_IMAGE = "/about/gym-interior.png";

export const DEFAULT_ABOUT_PREVIEW_IMAGE = ABOUT_GYM_IMAGE;
export interface SiteContent {
  aboutPreviewImage?: string;
  aboutPreviewUpdatedAt?: string;
}

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MAX_ABOUT_IMAGE_BYTES = 5 * 1024 * 1024;

export function extensionForMime(mime: string): string | null {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}
