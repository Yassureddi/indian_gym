export type GalleryCategory =
  | "gym"
  | "workout"
  | "equipment"
  | "members"
  | "events";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  tall?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}

export const GALLERY_FILTERS: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "gym", label: "Gym Photos" },
  { id: "workout", label: "Workout" },
  { id: "equipment", label: "Equipment" },
  { id: "members", label: "Members" },
  { id: "events", label: "Events" },
];

export const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  gym: "Gym Photos",
  workout: "Workout",
  equipment: "Equipment",
  members: "Members",
  events: "Events",
};
