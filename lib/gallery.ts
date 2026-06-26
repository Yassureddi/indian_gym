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
}

export const GALLERY_FILTERS: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "gym", label: "Gym Photos" },
  { id: "workout", label: "Workout" },
  { id: "equipment", label: "Equipment" },
  { id: "members", label: "Members" },
  { id: "events", label: "Events" },
];

export const GALLERY_IMAGES: GalleryItem[] = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop",
    alt: "Premium gym floor",
    category: "gym",
    tall: true,
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1623874514711-0f321325f318?w=600&h=400&fit=crop",
    alt: "Luxury locker room",
    category: "gym",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=500&fit=crop",
    alt: "Cardio training zone",
    category: "gym",
  },
  {
    id: "w1",
    src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=750&fit=crop",
    alt: "Weight training session",
    category: "workout",
    tall: true,
  },
  {
    id: "w2",
    src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
    alt: "Group HIIT class",
    category: "workout",
  },
  {
    id: "w3",
    src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=500&fit=crop",
    alt: "Personal training",
    category: "workout",
  },
  {
    id: "w4",
    src: "https://images.unsplash.com/photo-1593079831268-3381b0f4c77b?w=600&h=700&fit=crop",
    alt: "CrossFit workout",
    category: "workout",
    tall: true,
  },
  {
    id: "e1",
    src: "https://images.unsplash.com/photo-1540497077202-7a8b3d8e8f3e?w=600&h=450&fit=crop",
    alt: "Premium dumbbells",
    category: "equipment",
  },
  {
    id: "e2",
    src: "https://images.unsplash.com/photo-1532029837206-abbe2b7650e3?w=600&h=600&fit=crop",
    alt: "Strength machines",
    category: "equipment",
    tall: true,
  },
  {
    id: "e3",
    src: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=400&fit=crop",
    alt: "Yoga mats and accessories",
    category: "equipment",
  },
  {
    id: "m1",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=500&fit=crop",
    alt: "Member transformation",
    category: "members",
  },
  {
    id: "m2",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=750&fit=crop",
    alt: "Ladies workout zone",
    category: "members",
    tall: true,
  },
  {
    id: "m3",
    src: "https://images.unsplash.com/photo-1594381898411-8465977c892e?w=600&h=450&fit=crop",
    alt: "Member training session",
    category: "members",
  },
  {
    id: "ev1",
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=500&fit=crop",
    alt: "Fitness challenge event",
    category: "events",
  },
  {
    id: "ev2",
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=700&fit=crop",
    alt: "Wellness workshop",
    category: "events",
    tall: true,
  },
  {
    id: "ev3",
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b875d?w=600&h=400&fit=crop",
    alt: "Annual fitness competition",
    category: "events",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1540497077202-7a8b3d8e8f3e?w=600&h=550&fit=crop",
    alt: "Reception and lounge",
    category: "gym",
  },
  {
    id: "w5",
    src: "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=600&h=400&fit=crop",
    alt: "Deadlift training",
    category: "workout",
  },
];

export const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  gym: "Gym Photos",
  workout: "Workout",
  equipment: "Equipment",
  members: "Members",
  events: "Events",
};
