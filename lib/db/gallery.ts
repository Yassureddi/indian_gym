import { readJson, writeJson, createId } from "./store";
import type { GalleryCategory, GalleryItem } from "@/lib/gallery";

const FILE = "gallery.json";

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const items = await readJson<GalleryItem[]>(FILE, []);
  return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function getPublishedGalleryItems(category?: string): Promise<GalleryItem[]> {
  let items = (await getGalleryItems()).filter((i) => i.isPublished !== false);
  if (category && category !== "all") {
    items = items.filter((i) => i.category === category);
  }
  return items;
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const items = await getGalleryItems();
  return items.find((i) => i.id === id) ?? null;
}

export async function saveGalleryItem(item: GalleryItem) {
  const items = await getGalleryItems();
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) items[index] = item;
  else items.push(item);
  await writeJson(FILE, items);
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const items = await getGalleryItems();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await writeJson(FILE, next);
  return true;
}

export async function createGalleryItem(data: {
  src: string;
  alt: string;
  category: GalleryCategory;
  tall?: boolean;
  isPublished?: boolean;
}): Promise<GalleryItem> {
  const items = await getGalleryItems();
  const item: GalleryItem = {
    id: createId("gal"),
    src: data.src,
    alt: data.alt,
    category: data.category,
    tall: data.tall ?? false,
    isPublished: data.isPublished ?? true,
    sortOrder: items.length + 1,
  };
  await saveGalleryItem(item);
  return item;
}

export async function updateGalleryItem(
  id: string,
  updates: Partial<Pick<GalleryItem, "alt" | "category" | "tall" | "isPublished" | "sortOrder">>
): Promise<GalleryItem | null> {
  const item = await getGalleryItemById(id);
  if (!item) return null;
  const updated = { ...item, ...updates };
  await saveGalleryItem(updated);
  return updated;
}

const GALLERY_SEED: Omit<GalleryItem, "id">[] = [
  { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop", alt: "Gym floor", category: "gym", isPublished: true, sortOrder: 1 },
  { src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop", alt: "Weight training", category: "workout", isPublished: true, sortOrder: 2 },
  { src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop", alt: "Cardio zone", category: "equipment", isPublished: true, sortOrder: 3 },
  { src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop", alt: "Group class", category: "workout", isPublished: true, sortOrder: 4 },
  { src: "https://images.unsplash.com/photo-1540497077202-7a8b3d8e8f3e?w=600&h=400&fit=crop", alt: "Personal training", category: "members", isPublished: true, sortOrder: 5 },
  { src: "https://images.unsplash.com/photo-1623874514711-0f321325f318?w=600&h=400&fit=crop", alt: "Locker room", category: "gym", isPublished: true, sortOrder: 6 },
];

export async function ensureSeedGallery() {
  const items = await getGalleryItems();
  if (items.length > 0) return;
  for (const seed of GALLERY_SEED) {
    await saveGalleryItem({ ...seed, id: createId("gal") });
  }
}
