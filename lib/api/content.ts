import type { BlogItem } from "@/lib/blog";
import type { GalleryItem } from "@/lib/gallery";
import type { Trainer } from "@/lib/trainers";
import { withDbContent } from "@/lib/db/build-guard";
import { initializeDatabase } from "@/lib/db/init";
import { getPublishedBlogs, getBlogById } from "@/lib/db/blogs";
import { getPublishedGalleryItems } from "@/lib/db/gallery";
import { getActiveTrainers } from "@/lib/db/trainers";
import { getBlogs } from "@/lib/db/blogs";
import { getGalleryItems } from "@/lib/db/gallery";
import { getTrainers } from "@/lib/db/trainers";
import { mapBlog, mapGalleryItem, mapTrainer } from "@/lib/api/mappers";

export async function fetchGalleryItems(category?: string): Promise<GalleryItem[]> {
  return withDbContent(async () => {
    await initializeDatabase();
    return (await getPublishedGalleryItems(category)).map(mapGalleryItem);
  }, []);
}

export async function fetchTrainers(): Promise<Trainer[]> {
  return withDbContent(async () => {
    await initializeDatabase();
    return (await getActiveTrainers()).map(mapTrainer);
  }, []);
}

export async function fetchBlogs(): Promise<BlogItem[]> {
  return withDbContent(async () => {
    await initializeDatabase();
    return (await getPublishedBlogs()).map(mapBlog);
  }, []);
}

export async function fetchBlogById(id: string): Promise<BlogItem | null> {
  return withDbContent(async () => {
    await initializeDatabase();
    const blog = await getBlogById(id);
    if (!blog || blog.isPublished === false) return null;
    return mapBlog(blog);
  }, null);
}

export async function fetchContentCounts() {
  return withDbContent(async () => {
    await initializeDatabase();
    const [gallery, blogs, trainers] = await Promise.all([
      getGalleryItems(),
      getBlogs(),
      getTrainers(),
    ]);

    return {
      galleryItems: gallery.length,
      blogPosts: blogs.length,
      trainers: trainers.length,
    };
  }, { galleryItems: 0, blogPosts: 0, trainers: 0 });
}
