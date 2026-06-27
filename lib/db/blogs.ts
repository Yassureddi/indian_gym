import BlogModel from "@/models/Blog";
import { ensureDb, toPlain, toPlainList } from "./mongo-helpers";
import { createId } from "./store";
import { slugify } from "@/lib/utils/slug";
import type { BlogItem } from "@/lib/blog";

export async function getBlogs(): Promise<BlogItem[]> {
  await ensureDb();
  const docs = await BlogModel.find().sort({ date: -1 }).lean();
  return toPlainList<BlogItem>(docs);
}

export async function getPublishedBlogs(): Promise<BlogItem[]> {
  return (await getBlogs()).filter((b) => b.isPublished !== false);
}

export async function getBlogById(id: string): Promise<BlogItem | null> {
  await ensureDb();
  const doc = await BlogModel.findOne({ id }).lean();
  return toPlain<BlogItem>(doc);
}

export async function saveBlog(blog: BlogItem) {
  await ensureDb();
  await BlogModel.findOneAndUpdate({ id: blog.id }, blog, {
    upsert: true,
    new: true,
  });
}

const BLOG_SEED = [
  {
    title: "10 Essential Exercises for Beginners",
    excerpt: "Start your fitness journey with these foundational movements.",
    content: "Starting your fitness journey can feel overwhelming. Focus on compound movements like squats, push-ups, and rows to build a strong foundation...",
    category: "Training",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=350&fit=crop",
    readTime: "5 min",
    date: "2025-06-15",
  },
  {
    title: "Nutrition Tips for Muscle Building",
    excerpt: "Learn what to eat before and after workouts for maximum gains.",
    content: "Muscle building requires consistent training and proper nutrition. Prioritize protein intake and eat balanced meals around your workouts...",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=350&fit=crop",
    readTime: "7 min",
    date: "2025-06-10",
  },
  {
    title: "The Science of Recovery",
    excerpt: "Why rest days are just as important as training days.",
    content: "Recovery is when your body adapts and grows stronger. Sleep, hydration, and active recovery all play critical roles...",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=350&fit=crop",
    readTime: "6 min",
    date: "2025-06-05",
  },
];

export async function ensureSeedBlogs() {
  await ensureDb();
  const count = await BlogModel.countDocuments();
  if (count > 0) return;
  for (const seed of BLOG_SEED) {
    const blog: BlogItem = {
      id: createId("blog"),
      slug: slugify(seed.title),
      ...seed,
      isPublished: true,
    };
    await saveBlog(blog);
  }
}
